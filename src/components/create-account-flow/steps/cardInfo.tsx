import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { AlertContext } from "../../../providers/alertProvider";
import { loadedStripe } from "../../../server/stripe/client";
import { api } from "../../../server/utils/api";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnPurple } from "../../btn/btnPurple";
import { CircularProgress } from "../../circularProgress";
import { CardHeader } from "../components/cardHeader";
import { CreateOrgContext } from "../dataStore";

export const CardInfoSection = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { state } = useContext(CreateOrgContext)!;

  const clientSecret = api.stripe.getSubscriptionSecretByID.useQuery({
    id: state.stripeSubscriptionId,
  });

  let secret = clientSecret.data?.clientSecret;

  if (clientSecret.isLoading || secret == null) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <CardHeader>Setup your payment method</CardHeader>
      <Elements stripe={loadedStripe} options={{ clientSecret: secret }}>
        <CardForm setStep={setStep} secret={secret} />
      </Elements>
    </>
  );
};

const CardForm = ({
  secret,
  setStep,
}: {
  secret: string;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { state } = useContext(CreateOrgContext)!;
  const { setError } = useContext(AlertContext)!;
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || secret === "") {
      return;
    }
    setIsLoading(true);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setIsLoading(false);
      setError({
        state: true,
        message: "Error verifying card information. Please try again.",
      });
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements: elements,
      confirmParams: {
        return_url: `${window.location.origin}/account/confirm-email?email=${state.email}`,
      },
    });

    if (error) {
      setIsLoading(false);
      setError({
        state: true,
        message: "Error submitting payment. Please try again.",
      });
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <BtnPurple isLoading={isLoading} type="submit" fullWidth>
          Save
        </BtnPurple>
      </div>
    </form>
  );
};
