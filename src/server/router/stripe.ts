import { z } from "zod";
import {
  adminOrgProcedure,
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "./context";
import { stripe } from "../stripe/client";
import { getCustomerOrCreate } from "../stripe/stripeHandlers";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

export const stripeRouter = createTRPCRouter({
  createSubscription: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        priceId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const customer = await getCustomerOrCreate({
        stripe,
        userId: input.userId,
      });
      if (!customer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to retrieve or create stripe id.",
        });
      }
      try {
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass it to the front end to confirm the payment
        const subscription = await stripe.subscriptions.create({
          customer: customer,
          items: [
            {
              price: input.priceId,
            },
          ],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"],
        });
        const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent =
          latestInvoice.payment_intent as Stripe.PaymentIntent;
        return {
          subscriptionId: subscription.id,
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error: any) {
        throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
      }
    }),

  getSubscriptionByID: publicProcedure
    .input(z.object({ subId: z.string() }))
    .query(async ({ input }) => {
      return await stripe.subscriptions.retrieve(input.subId);
    }),

  getSubscriptionSecretByID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const sub = await stripe.subscriptions.retrieve(input.id, {
        expand: ["latest_invoice.payment_intent"],
      });
      try {
        const invoice = sub.latest_invoice as Stripe.Invoice;
        const intent = invoice.payment_intent as Stripe.PaymentIntent;
        return { clientSecret: intent.client_secret };
      } catch (_error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getSubscriptionPlan: adminOrgProcedure.query(async ({ ctx }) => {
    if (!ctx.org.stripeCustomerId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
    const allSubs = await stripe.subscriptions.list({
      customer: ctx.org.stripeCustomerId,
    });

    if (!allSubs.data[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error: Unable to retreieve the subscription plan.",
      });
    }
    return allSubs.data[0];
  }),

  updateSubscriptionPrice: publicProcedure
    .input(
      z.object({
        subId: z.string(),
        priceId: z.string(),
        chargeChangeImmediately: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const subscription = await stripe.subscriptions.retrieve(input.subId);
      return await stripe.subscriptions.update(
        input.subId,

        {
          cancel_at_period_end: false,
          items: [
            {
              id: subscription?.items?.data[0]?.id,
              price: input.priceId,
            },
          ],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          proration_behavior: input.chargeChangeImmediately
            ? "always_invoice"
            : "create_prorations",
          expand: ["latest_invoice.payment_intent"],
        }
      );
    }),

  createOrRetrieveSetupIntent: publicProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input }) => {
      // check for existing setup before creating new one
      const existingIntents = await stripe.setupIntents.list({
        customer: input.customerId,
      });
      if (existingIntents.data.length > 0) {
        return { clientSecret: existingIntents.data[0]?.client_secret };
      }

      const intent = await stripe.setupIntents.create({
        customer: input.customerId,
        automatic_payment_methods: { enabled: true },
      });

      return { clientSecret: intent.client_secret };
    }),

  getInvoices: adminOrgProcedure
    .input(
      z.object({
        limit: z.number().optional().default(12),
        cursor: z.string().nullish(),
        forward: z.boolean().optional().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.org.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error: Stripe ID does not exist on organization.",
        });
      }

      // call the correct query for if we are
      // pading forward or backward
      if (input.forward) {
        return await stripe.invoices.list({
          customer: ctx.org.stripeCustomerId,
          limit: input.limit,
          starting_after: input.cursor ?? undefined,
        });
      } else {
        return await stripe.invoices.list({
          customer: ctx.org.stripeCustomerId,
          limit: input.limit,
          ending_before: input.cursor ?? undefined,
        });
      }
    }),
  getDefaultPaymentMethod: adminOrgProcedure.query(async ({ ctx }) => {
    if (ctx.org.stripeCustomerId == null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No Stripe Customer on Organization.",
      });
    }

    const customer = (await stripe.customers.retrieve(
      ctx.org.stripeCustomerId
    )) as Stripe.Customer;

    // if the default payment method is not the id of the method then return null
    if (typeof customer.invoice_settings.default_payment_method != "string") {
      return { paymentMethod: null };
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(
      customer.invoice_settings.default_payment_method
    );

    return { paymentMethod: paymentMethod };
  }),
});
