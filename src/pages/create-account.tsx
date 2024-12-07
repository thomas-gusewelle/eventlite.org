import { Dispatch, SetStateAction, useState } from "react";
import { CreateOrganization } from "../components/create-account-flow/steps/createOrganization";
import { YourInfoStep } from "../components/create-account-flow/steps/yourInfo";
import { LoginCard } from "../components/create-account-flow/components/card";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
// import { PricingTiers } from "../components/create-account-flow/steps/pricingTier";
import { CreateOrgProvider } from "../components/create-account-flow/dataStore";
// import { CreateAccountIdentifier } from "../components/create-account-flow/steps/creatingAccountIndicator";
// import { CardInfoSection } from "../components/create-account-flow/steps/cardInfo";
// import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
// import { getCookie, hasCookie, setCookie } from "cookies-next";
// import { stripe } from "../server/stripe/client";

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   let stripeSubscriptionId: string;
//
//   const { tier } = context.query;
//   if (Array.isArray(tier)) {
//     throw new Error("Tier must be a single string");
//   }
//
//   if (
//     hasCookie("stripeSubscriptionId", { req: context.req, res: context.res })
//   ) {
//     stripeSubscriptionId = getCookie("stripeSubscriptionId", {
//       req: context.req,
//       res: context.res,
//     }) as string;
//     const subscription = await stripe.subscriptions.retrieve(
//       stripeSubscriptionId,
//       { expand: ["latest_invoice.payment_intent"] }
//     );
//
//     //check to make sure subscription is the same as the selected tier and if not update it to reflect the chosen tier
//     if (tier && subscription.items.data[0]?.price.id != tier) {
//       const updatedSubscription = await stripe.subscriptions.update(
//         stripeSubscriptionId,
//         {
//           cancel_at_period_end: false,
//           items: [
//             {
//               id: subscription?.items?.data[0]?.id,
//               price: tier,
//             },
//           ],
//           expand: ["latest_invoice.payment_intent"],
//         }
//       );
//
//       return { props: { subscription: updatedSubscription } };
//     }
//
//     return { props: { subscription: subscription } };
//   }

// if there is no existing subscription in cookies then create on
//   const customer = await stripe.customers.create();
//   const subscription = await stripe.subscriptions.create({
//     customer: customer.id,
//     items: [
//       {
//         // takes in the priceID from the selectedID or uses the fier tier
//         price: tier ?? "price_1OWkdVKjgiEDHq2AesuPdTmq",
//       },
//     ],
//     payment_behavior: "default_incomplete",
//     payment_settings: { save_default_payment_method: "on_subscription" },
//     expand: ["latest_invoice.payment_intent"],
//   });
//
//   setCookie("stripeSubscriptionId", subscription.id, {
//     req: context.req,
//     res: context.res,
//   });
//
//   return { props: { subscription: subscription } };
// };

const CreateAccount = () => {
  const [step, setStep] = useState(1);

  return (
    <>
      <VerticalLogo />
      <LoginCard>
        <Steps step={step} setStep={setStep} />
      </LoginCard>
    </>
  );
};

const CreateAcountPage = () =>
  // subscription: InferGetServerSidePropsType<typeof getServerSideProps>
  {
    // const subID = subscription.subscription.id;
    // const customerID = subscription.subscription.customer;
    // const tier = subscription.subscription.items.data[0]?.plan.id ?? "";

    return (
      <CreateOrgProvider
      // subId={subID}
      // customerId={typeof customerID == "string" ? customerID : ""}
      // tier={tier}
      >
      <CreateAccount />
      </CreateOrgProvider>
    );
  };

CreateAcountPage.getLayout = loginFlowLayout;
export default CreateAcountPage;

const Steps = ({
  step,
  setStep,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  switch (step) {
    case 1:
      return <CreateOrganization setStep={setStep} />;
    case 2:
      return <YourInfoStep setStep={setStep} />;
    // case 3:
    //   return <CreateAccountIdentifier setStep={setStep} />;
    // case 4:
    //   return <PricingTiers setStep={setStep} />;
    // case 5:
    //   return <CardInfoSection setStep={setStep} />;
    default:
      return <div></div>;
  }
};
