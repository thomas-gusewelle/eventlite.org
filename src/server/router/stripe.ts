import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./context";
import { loadStripe } from "@stripe/stripe-js";
import { stripe } from "../stripe/client";
import { getCustomerOrCreate } from "../stripe/stripeHandlers";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

export const stripeRouter = createTRPCRouter({
  createCustomer: publicProcedure
    .input(
      z.object({
        orgName: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      //TODO: finish create customer implementation

      const customer = await stripe?.customers.create({
        name: input.orgName,
        email: input.email,
      });
    return customer
    }),

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
});
