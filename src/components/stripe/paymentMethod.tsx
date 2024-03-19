import { FaPlus } from "react-icons/fa";
import { api } from "../../server/utils/api";

//TODO: get default payment info and display to user
export const PaymentMethod = () => {
  const [pm, _pmQuery] = api.stripe.getDefaultPaymentMethod.useSuspenseQuery();
  return (
    <>
      <PaymentMethodCard/>
      <button className="flex gap-3 items-center text-gray-600">
        <FaPlus/>
        Add new payment method
      </button>
    </>
  );
};


const PaymentMethodCard = () => {
return <div></div>
}
