import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./context";
import { loadStripe } from "@stripe/stripe-js"

export const stripeRouter = createTRPCRouter({
  createCustomer: publicProcedure.input(z.object({
    orgName: z.string(),
    email: z.string()
  })).mutation(async ({ ctx }) {
    //TODO: finish create customer implementation
    const stripe = loadStripe(process.env.STRIPE_SECRET_KEY!)
  })
}); 
