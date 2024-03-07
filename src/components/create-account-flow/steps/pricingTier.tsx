import { RadioGroup } from "@headlessui/react";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { CardHeader } from "../components/cardHeader";
import { MdCheck } from "react-icons/md";
import { BtnPurple } from "../../btn/btnPurple";
import { CreateOrgContext } from "../dataStore";
import { api } from "../../../server/utils/api";
import { useRouter } from "next/router";

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

export const PricingTiers = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const router = useRouter();
  const { state, setState } = useContext(CreateOrgContext)!;
  const { setError } = useContext(AlertContext)!;
  const updateSub = api.stripe.updateSubscriptionPrice.useMutation();

  const priceId =
    state.tier === "" ? state.tier : "price_1OWkdVKjgiEDHq2AesuPdTmq";

  const plan = plans.findIndex((p) => p.stripeId === state.tier);
  const [selected, setSelected] = useState<plan>(plans[plan == -1 ? 0 : plan]!);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      tier: selected.stripeId,
    }));

    // if tier is different then update
    if (priceId != selected.stripeId) {
      // since the subscription has never been active
      // we want to charge the change immediately
      await updateSub.mutateAsync(
        {
          subId: state.stripeSubscriptionId,
          priceId: selected.stripeId,
          chargeChangeImmediately: true,
        },
        {
          onError(error, _variables, _context) {
            setError({
              state: true,
              message: "Error saving the selected plan. Please try again.",
            });
          },
        }
      );
    }

    if (selected.tier == "free") {
      router.push(`/account/confirm-email?email=${state.email}`);
    } else {
      setStep(5);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>Choose your plan</CardHeader>
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
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
                          className={`font-medium  text-gray-900 `}
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
      <div className="mt-6 flex items-center justify-center gap-6">
        <BtnPurple
          disabled={updateSub.isPending}
          isLoading={updateSub.isPending}
          type="submit"
          fullWidth
        >
          Next
        </BtnPurple>
      </div>
    </form>
  );
};
