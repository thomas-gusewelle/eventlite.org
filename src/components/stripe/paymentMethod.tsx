import { api } from "../../server/utils/api";

export const PaymentMethod = () => {
  const [pm, pmQuery] = api.stripe.getDefaultPaymentMethod.useSuspenseQuery();
  return <>{pm.paymentMethod ?? "null"}</>;
};
