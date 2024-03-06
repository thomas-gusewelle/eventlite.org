import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { stripe } from "../server/stripe/client";
import Stripe from "stripe";

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

      return { props: { subscription: updatedSubscription } };
    }

    return { props: { subscription: subscription } };
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

    return { props: { subscription: subscription } };

};

const CreateAccount = ({
  firstName,
  lastName,
  orgName,
  email,
  tier,
}: {
  firstName: string | undefined;
  lastName: string | undefined;
  orgName: string | undefined;
  email: string | undefined;
  tier: string | undefined;
}) => {
  const { setError } = useContext(AlertContext);
  const [step, setStep] = useState(1);
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
          />
          {/*  {step == 4 && (
            <div className="mt-6 flex justify-center gap-6">
              <BtnNeutral
                fullWidth={true}
                func={() => {
                  setStep(1);
                }}
              >
                Back
              </BtnNeutral>
              <BtnPurple
                isLoading={createOrg.isLoading}
                fullWidth={true}
                type="submit"
              >
                Submit
              </BtnPurple>
            </div>
          )} */}
        </LoginCard>
      </CreateOrgProvider>
    </>
  );
};

const CreateAcountPage = (
  subscription: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { orgName, firstName, lastName, email, tier } = router.query;


  if (
    Array.isArray(orgName) ||
    Array.isArray(firstName) ||
    Array.isArray(lastName) ||
    Array.isArray(email) ||
    Array.isArray(tier)
  ) {
    return <div>Error with invite link</div>;
  }

  return (
    <CreateAccount
      orgName={orgName}
      lastName={lastName}
      firstName={firstName}
      email={email}
      tier={tier}
    />
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
      return <CreateOrganization setStep={setStep} stripeCustomerId={""} stripeSubscriptionId={""} stripePriceId={""} />;
    case 2:
      return <YourInfoStep setStep={setStep} />;
    case 3:
      return <PricingTiers tier={undefined} setStep={setStep} />;
    case 4:
      return <CardInfoSection setStep={setStep}/>;
    case 5:
      return <CreateAccountIdentifier setStep={setStep} />;
    default:
      return <div></div>;
  }
};
