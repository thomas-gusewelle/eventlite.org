import { api } from "../../server/utils/api";

//TODO: get default payment info and display to user
export const PaymentMethod = () => {
  const [pm, _pmQuery] = api.stripe.getDefaultPaymentMethod.useSuspenseQuery();
  return <>{pm.paymentMethod ?? null}</>;
};
