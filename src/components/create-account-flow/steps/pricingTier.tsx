import { RadioGroup } from "@headlessui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { CardHeader } from "../components/cardHeader";
import { MdCheck } from "react-icons/md";
import { BtnPurple } from "../../btn/btnPurple";
import { BtnNeutral } from "../../btn/btnNeutral";
import { useFormKeyboardControls } from "../../../hooks/useFormKeyboardControls";

const plans = [
  {
    name: "Free",
    description: "Up to 5 users",
  },
  {
    name: "Medium",
    description: "Up to 20 users",
  },
  {
    name: "Unlimited",
    description: "Unlimited users",
  },
];

export const PricingTiers = ({ tier, setStep }: { tier: string | undefined , setStep: Dispatch<SetStateAction<number>>}) => {
  const [selected, setSelected] = useState(plans[0]);
  useFormKeyboardControls(() => setStep(2))
  return (
    <>
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
      <div
        onClick={(e) => e.preventDefault()}
        className='mt-6 flex items-center justify-center gap-6'>
        <BtnNeutral
          fullWidth
          func={() => {
            setStep(2);
          }}>
          Back
        </BtnNeutral> 
        <BtnPurple
          fullWidth
          onClick={() => null} >
          Next
        </BtnPurple>
      </div>
    </>
  );
};
