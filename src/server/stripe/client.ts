import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const loadedStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC!);
