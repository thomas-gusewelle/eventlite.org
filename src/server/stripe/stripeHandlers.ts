import type Stripe from "stripe";
import { prisma } from "../db/client";

export async function getCustomerOrCreate({
	stripe,
	userId,
}: {
	stripe: Stripe;
	userId: string;
})  {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	const org = await prisma.organization.findUnique({where: {id: user?.organizationId ?? undefined}})
	if (!user || !org) {
		throw new Error("Error finding user or organization");
	}

	if (org?.stripeCustomerId) {
		return org.stripeCustomerId
	}

	const stripeCustomer = await stripe.customers.create({
		name: org.name,
		email: user.email,
		metadata: {
			userId: userId,
		},
	});
	const updatedOrg = await prisma.organization.update({
		where: { id: org?.id },
		data: {
			stripeCustomerId: stripeCustomer.id,
		},
	});
	if (updatedOrg.stripeCustomerId){
		return updatedOrg.stripeCustomerId
	}
}
