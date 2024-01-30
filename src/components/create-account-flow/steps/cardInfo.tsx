import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { Dispatch, SetStateAction } from "react";
import { loadedStripe } from "../../../server/stripe/client";
import { api } from "../../../server/utils/api";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";
import { CardHeader } from "../components/cardHeader";
export const CardInfoSection = ({
  setStep,
  stripeCustomerId
}: {
  setStep: Dispatch<SetStateAction<number>>
  stripeCustomerId: string
}) => {

  const clientSecret = api.stripe.createSetupIntent.useQuery({customerId: stripeCustomerId})

  return (
    <>
      <CardHeader>Setup your payment method</CardHeader>
      <Elements
        stripe={loadedStripe}
        options={{ mode: "setup", currency: "usd" }}
      >
        <PaymentElement />
      </Elements>
      <div className="mt-6 flex items-center justify-center gap-6">
        <BtnNeutral
          fullWidth
          func={() => {
            console.log("back being called");
            setStep(3)
          }}
        >
          Back
        </BtnNeutral>
        <BtnPurple disabled={clientSecret.isLoading} type="submit" fullWidth>
          Save
        </BtnPurple>
      </div>
    </>
  );
};
