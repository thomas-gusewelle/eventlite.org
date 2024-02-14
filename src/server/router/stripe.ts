import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "./context";
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

  getAllInvoices: adminProcedure
    .input(
      z.object({
        limit: z.number().optional().default(12),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const orgId = await prisma?.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          organizationId: true,
        },
      });
      if (!orgId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to find organization",
        });
      }

      const org = await prisma?.organization.findUnique({
        where: {
          id: orgId?.organizationId ?? undefined,
        },
        select: {
          stripeCustomerId: true,
        },
      });

      if (!org || !org.stripeCustomerId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error finding organization",
        });
      }

      return await stripe.invoices.list({
        customer: org.stripeCustomerId,
        limit: input.limit,
        starting_after: input.cursor ?? undefined,
      });
    }),
});
