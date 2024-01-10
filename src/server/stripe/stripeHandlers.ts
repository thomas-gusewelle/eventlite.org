import type Stripe from "stripe";
import { prisma } from "../db/client";

export async function getUserOrCreate({
	stripe,
	userId,
}: {
	stripe: Stripe;
	userId: string;
})  {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) {
		throw new Error("No user exists");
	}

	if (user.stripeCustomerId) {
		return user.stripeCustomerId;
	}

	const stripeCustomer = await stripe.customers.create({
		name: user.firstName + " " + user.lastName,
		email: user.email,
		metadata: {
			userId: userId,
		},
	});
	const updatedPrismaUser = await prisma.user.update({
		where: { id: userId },
		data: {
			stripeCustomerId: stripeCustomer.id,
		},
	});
	if (updatedPrismaUser.stripeCustomerId){
		return updatedPrismaUser.stripeCustomerId
	}
}
