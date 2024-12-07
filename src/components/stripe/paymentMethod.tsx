import { FaCcVisa, FaCheckCircle, FaPlus, FaRegCircle } from "react-icons/fa";
import Stripe from "stripe";
import { api } from "../../server/utils/api";

//TODO: get default payment info and display to user
export const PaymentMethod = () => {
  const [paymentMethods, _paymentMethodsQuery] =
    api.stripe.getAllPaymentMethods.useSuspenseQuery();
  return (
    <>
      {paymentMethods.data.map((pm, i) => (
        <PaymentMethodCard key={i} pm={pm} />
      ))}
      <button className="flex items-center gap-3 text-gray-600">
        <FaPlus />
        Add new payment method
      </button>
    </>
  );
};

//TODO: get the default payment and implement selecting and saving that
const PaymentMethodCard = ({ pm }: { pm: Stripe.PaymentMethod }) => {
  const setDefaultPayment = api.stripe.setPaymentMethodAsDefault.useMutation();
  const [defaultPaymentMethod, defaultPaymentMethodQuery] = api.stripe.getDefaultPaymentMethod.useSuspenseQuery();
  console.log(pm)
  return (
    <div className="space-between flex rounded-xl p-3 shadow">
      <div className="flex gap-3">
        <FaCcVisa size={50} />
        <div className="flex flex-col gap-1 text-sm">
          <h3 className="text-base font-bold first-letter:capitalize">
            {pm.card?.brand} ending in {pm.card?.last4}
          </h3>
          <p className="text-neutral-600">
            Expires {pm.card?.exp_month}/{pm.card?.exp_year}
          </p>
          <div className="flex items-center gap-3 pt-3">
            {defaultPaymentMethod.paymentMethod?.id === pm.id ? <></> : <button
              className="text-left text-neutral-600"
              onClick={() =>
                setDefaultPayment.mutate(
                  { paymentMethodId: pm.id },
                  {
                    onSuccess: () => {
                      api.useUtils().stripe.getAllPaymentMethods.refetch();
                    },
                  }
                )
              }
            >
              Set as default
            </button> }
            <button className="text-indigo-600">Edit</button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-end">
        {true ? (
          <FaCheckCircle className="text-indigo-700" />
        ) : (
          <FaRegCircle className="text-gray-200" />
        )}
      </div>
    </div>
  );
};
