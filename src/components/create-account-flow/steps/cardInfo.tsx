import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadedStripe } from "../../../server/stripe/client";
export const CardInfoSection = ({
  stripeClientSecret,
}: {
  stripeClientSecret: string | null;
}) => {
  if (stripeClientSecret == null) {
    return <></>;
  }

  return (
    <Elements
      stripe={loadedStripe}
      options={{ clientSecret: stripeClientSecret }}
    >
      <PaymentElement />
    </Elements>
  );
};
