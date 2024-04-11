import { Dispatch, SetStateAction } from "react";
import { Modal } from "../modal";
import { ModalBody } from "../modalBody";
import { ModalTitle } from "../modalTitle";
import { RadioGroup } from "@headlessui/react";
import { FormEvent, useContext, useState } from "react";
import { CardHeader } from "../../create-account-flow/components/cardHeader";
import { MdCheck } from "react-icons/md";
import { BtnPurple } from "../../btn/btnPurple";
import { api } from "../../../server/utils/api";
import { useRouter } from "next/router";
import { AlertContext } from "../../../providers/alertProvider";
import { BtnCancel } from "../../btn/btnCancel";
import { BottomButtons } from "../bottomButtons";
import { CircularProgress } from "../../circularProgress";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadedStripe } from "../../../server/stripe/client";
import { BtnNeutral } from "../../btn/btnNeutral";

export const ChangePlanModal = ({
  open,
  setOpen,
  priceId,
  subId,
  customerId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  priceId: string | undefined;
  subId: string;
  customerId: string;
}) => {
  const [showPaymentMethodAdd, setShowPaymentMethodAdd] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<string | undefined>(
    priceId
  );
  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalBody>
        {showPaymentMethodAdd ? (
          <PaymentAddSection
            subId={subId}
            customerId={customerId}
            selectedPriceId={selectedPrice}
            setShowPaymentAdd={setShowPaymentMethodAdd}
            setOpen={setOpen}
          />
        ) : (
          <PricingTiers
            originalPriceId={priceId}
            currentPriceId={selectedPrice}
            subId={subId}
            setOpen={setOpen}
            setShowPaymentAdd={setShowPaymentMethodAdd}
            setSelectedPrice={setSelectedPrice}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

type plan = {
  name: string;
  tier: "free" | "medium" | "unlimited";
  description: string;
  stripeId: string;
};
const plans: plan[] = [
  {
    name: "Free",
    tier: "free",
    description: "Up to 5 users",
    stripeId: "price_1OWkdVKjgiEDHq2AesuPdTmq",
  },
  {
    name: "Medium",
    tier: "medium",
    description: "Up to 20 users",
    stripeId: "price_1OWkdjKjgiEDHq2AOHNwODgi",
  },
  {
    name: "Unlimited",
    tier: "unlimited",
    description: "Unlimited users",
    stripeId: "price_1OWkdyKjgiEDHq2AnKIzRjEY",
  },
];

const PricingTiers = ({
  originalPriceId,
  currentPriceId,
  subId,
  setOpen,
  setShowPaymentAdd,
  setSelectedPrice,
}: {
  originalPriceId: string | undefined;
  currentPriceId: string | undefined;

  subId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setShowPaymentAdd: Dispatch<SetStateAction<boolean>>;
  setSelectedPrice: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const router = useRouter();
  const { setError, setSuccess } = useContext(AlertContext)!;
  const updateSub = api.stripe.updateSubscriptionPrice.useMutation();
  const defaultPaymentQuery = api.stripe.getDefaultPaymentMethod.useQuery();

  // const priceId = originalPriceId
  //   ? originalPriceId
  //   : "price_1OWkdVKjgiEDHq2AesuPdTmq";

  const plan = plans.findIndex((p) => p.stripeId === currentPriceId);
  const [selected, setSelected] = useState<plan>(plans[plan == -1 ? 0 : plan]!);

  const handleSubmit = async (e: FormEvent) => {
    console.log("hereh");
    e.preventDefault();

    if (
      defaultPaymentQuery.isLoading ||
      defaultPaymentQuery.isError ||
      defaultPaymentQuery.data === undefined
    ) {
      return;
    }

    // if sub is the same then exit
    if (selected.stripeId == originalPriceId) {
      setOpen(false);
      return;
    }

    //plan is free
    if (selected.stripeId === plans[0]?.stripeId) {
      updateSub.mutate(
        {
          priceId: selected.stripeId,
          subId,
        },
        {
          onSuccess: () => window.location.reload(),
          onError(error, _variables, _context) {
            setError({ state: true, message: `Error: ${error.message}` });
          },
        }
      );
      return;
    }

    //if plan is a paid plan check for payment method
    const { paymentMethod } = defaultPaymentQuery.data;

    // if there is no payment method and the selected plan is not a free plan
    // then save the tier wanted and ask for payment
    // we will collect the payment method with a setup intent
    // and save it as the default payment method
    // then we will update the subscription which will charge the default payment method
    if (!paymentMethod && selected.stripeId != plans[0]?.stripeId) {
      setSelectedPrice(selected.stripeId);
      setShowPaymentAdd(true);
      return;
    }

    //  if payment method then udate subscription with proration
    //  if no payment method then ask for payment method
    // if (paymentMethod || selected.stripeId != plans[0]?.stripeId) {
    //   updateSub.mutate(
    //     {
    //       priceId: selected.stripeId,
    //       subId,
    //     },
    //     {
    //       onSuccess: () => window.location.reload(),
    //       onError(error, _variables, _context) {
    //         setError({ state: true, message: `Error: ${error.message}` });
    //       },
    //     }
    //   );
    //   return;
    // } else {
    //   await updateSub.mutateAsync({
    //     priceId: selected.stripeId,
    //     subId,
    //     chargeChangeImmediately: true,
    //   });
    //   setShowPaymentAdd(true);
    //   return;
    // }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>Choose your plan</CardHeader>
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="sr-only">Plan Selection</RadioGroup.Label>
        <div className="space-y-3">
          {plans.map((plan) => (
            <RadioGroup.Option
              key={plan.name}
              value={plan}
              className={({ checked }) =>
                `${checked ? "ring-2 ring-indigo-600" : ""}
                 relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`text-left  font-medium text-gray-900 `}
                        >
                          {plan.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className={`inline  text-gray-500`}
                        >
                          {plan.description}
                        </RadioGroup.Description>
                      </div>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-indigo-600">
                        <MdCheck />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <BottomButtons>
        <BtnPurple
          disabled={updateSub.isPending || defaultPaymentQuery.isLoading}
          isLoading={updateSub.isPending}
          type="submit"
        >
          Save
        </BtnPurple>
        <BtnCancel onClick={() => setOpen(false)} />
      </BottomButtons>
    </form>
  );
};

const PaymentAddSection = ({
  subId,
  customerId,
  selectedPriceId,
  setShowPaymentAdd,
  setOpen,
}: {
  subId: string;
  customerId: string;
  selectedPriceId: string | undefined;
  setShowPaymentAdd: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const elements = useElements();
  const clientSecret = api.stripe.createOrRetrieveSetupIntent.useQuery({
    customerId: customerId,
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
      <CardHeader>Add a Payment Method</CardHeader>
      <Elements
        stripe={loadedStripe}
        options={{ clientSecret: clientSecret.data?.clientSecret ?? undefined }}
      >
        <PaymentAddForm setShowPaymentAdd={setShowPaymentAdd} setOpen={setOpen}/>
      </Elements>
    </>
  );
};

const PaymentAddForm = ({
  setShowPaymentAdd,
  setOpen
}: {
  setShowPaymentAdd: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { setError } = useContext(AlertContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        //make an update sub page that will take in the subId and priceId and update the sub
        //this page will then display a thank you message and button to go back to dashboard
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError({
        state: true,
        message: `Error saving payment: ${error.message}`,
      });
      setOpen(false);
      return;
    }


  };

  return (
    <form className="py-3" onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="mt-6 flex items-center justify-center gap-6">
        <BtnNeutral
          fullWidth
          func={() => {
            setShowPaymentAdd(false);
          }}
        >
          Back
        </BtnNeutral>
        <BtnPurple type="submit" fullWidth>
          Save
        </BtnPurple>
      </div>
    </form>
  );
};
