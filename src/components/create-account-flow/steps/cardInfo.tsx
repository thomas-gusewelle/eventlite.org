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
  useEffect,
  useState,
} from "react";
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
  const [secret, setSecret] = useState("");

  useEffect(() => {
    console.log("This is the secret: ", secret);
  }, [secret]);
  const clientSecret = api.stripe.createOrRetrieveSetupIntent.useQuery(
    {
      customerId: state.stripeCustomerId,
    },
    {
      onSuccess(data) {
        if (typeof data.clientSecret == "string") {
          setSecret(data.clientSecret);
        }
      },
    }
  );

  if (clientSecret.isLoading || secret === "") {
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
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  //TODO: implement and test
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || secret === "") {
      console.log("here");
      return;
    }
    setIsLoading(true);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setIsLoading(false);
      console.error(submitError);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements: elements,
      clientSecret: secret,
      confirmParams: {
        return_url: `${window.location.origin}/account/confirm-email?email=${state.email}`,
      },
    });

    if (error) {
      setIsLoading(false);
      console.error(error);
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
