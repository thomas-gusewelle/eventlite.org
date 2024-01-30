import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useRouter } from "next/router";
import { CreateOrganization } from "../components/create-account-flow/steps/createOrganization";
import { YourInfoStep } from "../components/create-account-flow/steps/yourInfo";
import { api } from "../server/utils/api";
import { AlertContext } from "../providers/alertProvider";
import { LoginCard } from "../components/create-account-flow/components/card";
import { loginFlowLayout } from "../components/layout/login-flow-layout";
import { VerticalLogo } from "../components/create-account-flow/components/VerticalLogo";
import { PricingTiers } from "../components/create-account-flow/steps/pricingTier";
import { CreateOrgProvider } from "../components/create-account-flow/dataStore";
import { CreateAccountIdentifier } from "../components/create-account-flow/steps/creatingAccountIndicator";
import { CardInfoSection } from "../components/create-account-flow/steps/cardInfo";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { stripe } from "../server/stripe/client";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let stripeSubscriptionId: string;

  const { tier } = context.query;
  if (Array.isArray(tier)) {
    throw new Error("Tier must be a single string");
  }

  if (
    hasCookie("stripeSubscriptionId", { req: context.req, res: context.res })
  ) {
    stripeSubscriptionId = getCookie("stripeSubscriptionId", {
      req: context.req,
      res: context.res,
    }) as string;
    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId,
      { expand: ["latest_invoice.payment_intent"] }
    );

    //check to make sure subscription is the same as the selected tier and if not update it to reflect the chosen tier
    if (tier && subscription.items.data[0]?.price.id != tier) {
      const updatedSubscription = await stripe.subscriptions.update(
        stripeSubscriptionId,
        {
          cancel_at_period_end: false,
          items: [
            {
              id: subscription?.items?.data[0]?.id,
              price: tier,
            },
          ],
          expand: ["latest_invoice.payment_intent"],
        }
      );

      const subscription = updatedSubscription;
      return { props: { subscription } };
    }

    return { props: { subscription } };
  }

  // if there is no existing subscription in cookies then create on
  const customer = await stripe.customers.create();
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        // takes in the priceID from the selectedID or uses the fier tier
        price: tier ?? "price_1OWkdVKjgiEDHq2AesuPdTmq",
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  });

  setCookie("stripeSubscriptionId", subscription.id, {
    req: context.req,
    res: context.res,
  });

  return { props: { subscription } };
};

const CreateAccount = ({
  tier,
  subscription,
}: {
  tier: string | undefined;
  subscription: Stripe.Response<Stripe.Subscription>;
}) => {
  const { setError } = useContext(AlertContext);
  const [step, setStep] = useState(4);
  const createOrg = api.organization.createOrg.useMutation({
    onError(error, _variables, _context) {
      setError({
        state: true,
        message: `Error creating organization. Message: ${error.message}`,
      });
    },
  });
  const createUser = api.user.addUser.useMutation({
    onError(error, _variables, _context) {
      setError({
        state: true,
        message: `Error creating user. Message: ${error.message}`,
      });
    },
  });

  return (
    <>
      <VerticalLogo />
      <CreateOrgProvider>
        <LoginCard>
          <Steps
            step={step}
            setStep={setStep}
            stripeSubscriptionid={subscription.id}
            stripeCustomerId={subscription.customer as string}
          />
        </LoginCard>
      </CreateOrgProvider>
    </>
  );
};

const CreateAcountPage = ({
  subscription,
}: {
  subscription: InferGetServerSidePropsType<typeof getServerSideProps>;
}) => {
  const router = useRouter();
  const { tier } = router.query;

  if (Array.isArray(tier)) {
    return <div>Error with invite link</div>;
  }
  return <CreateAccount tier={tier} subscription={subscription} />;
};

CreateAcountPage.getLayout = loginFlowLayout;
export default CreateAcountPage;

const Steps = ({
  step,
  setStep,
  stripeSubscriptionId,
  stripeCustomerId,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  stripeSubscriptionid: string;
  stripeCustomerId: string;
}) => {
  switch (step) {
    case 1:
      return <CreateOrganization setStep={setStep} />;
    case 2:
      return <YourInfoStep setStep={setStep} />;
    case 3:
      return <PricingTiers tier={undefined} setStep={setStep} />;
    case 4:
      return (
        <CardInfoSection
          setStep={setStep}
          stripeCustomerId={stripeCustomerId}
        />
      );
    case 5:
      return <CreateAccountIdentifier />;
    default:
      return <div></div>;
  }
};
