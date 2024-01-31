import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { loadedStripe } from "../../../server/stripe/client";
import { api } from "../../../server/utils/api";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";
import { CardHeader } from "../components/cardHeader";
import { CreateOrgContext } from "../dataStore";
export const CardInfoSection = ({
  setStep,
  stripeCustomerId,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  stripeCustomerId: string;
}) => {
  return (
    <>
      <CardHeader>Setup your payment method</CardHeader>
      <Elements
        stripe={loadedStripe}
        options={{ mode: "setup", currency: "usd" }}
      >
        <CardForm setStep={setStep} customerId={stripeCustomerId} />
      </Elements>
    </>
  );
};

const CardForm = ({
  setStep,
  customerId,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  customerId: string;
}) => {
  const { state } = useContext(CreateOrgContext)!;
  const stripe = useStripe();
  const elements = useElements();
  const clientSecret = api.stripe.createOrRetrieveSetupIntent.useQuery(
    {
      customerId: customerId,
    },
    {
      onSuccess(data) {
        if (typeof data == "string") {
          setSecret(data);
        }
      },
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState("");

  //TODO: implement and test
  const handleSubmit = async (e: FormDataEvent) => {
    e.preventDefault();

    if (!stripe || !elements || secret === "") {
      return;
    }
    setIsLoading(true);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setIsLoading(false);
      console.error(submitError);
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements: elements,
      clientSecret: secret,
      confirmParams: {
        return_url: `${window.location.origin}/account/confirm-account?email=${state.email}`,
      },
    });
    if (error) {
      setIsLoading(false);
      console.error(error);
      return;
    }
  };

  return (
    <form>
      <PaymentElement />
      <div className="mt-6 flex items-center justify-center gap-6">
        <BtnNeutral
          fullWidth
          func={() => {
            console.log("back being called");
            setStep(3);
          }}
        >
          Back
        </BtnNeutral>
        <BtnPurple
          disabled={clientSecret.isLoading}
          isLoading={isLoading}
          type="submit"
          fullWidth
        >
          Save
        </BtnPurple>
      </div>
    </form>
  );
};
