import { api } from "../../server/utils/api";
import { MdCheck } from "react-icons/md";
import { classNames } from "../../utils/classnames";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { SectionHeading } from "../headers/SectionHeading";
import { BtnPurple } from "../btn/btnPurple";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ChangePlanModal } from "../modal/billing/changePlan";

// This is a wrapper for the data call
export const PlanPayment = () => {
  const [sub, _subQuery] = api.stripe.getSubscriptionPlan.useSuspenseQuery();
  const [open, setOpen] = useState(true);
  const subPlanId = sub?.items.data[0]?.plan.id;
  return (
    <>
      {open && createPortal(<ChangePlanModal open={open} setOpen={setOpen} priceId={subPlanId} subId={sub.id} customerId={sub.customer as string}/> , document.body)}
      <section>
        <div className="md:mr-3 md:flex md:items-center md:justify-between">
          <SectionHeading>Plan Details</SectionHeading>{" "}
          <div className="mt-3">
            <BtnPurple onClick={() => {setOpen(!open)}}>Edit</BtnPurple>
          </div>
        </div>
        <PlanCards subPriceId={subPlanId} />
      </section>
    </>
  );
};

//TODO: add in ability to click new plan and have that bring up confirmation of the change
const PlanCards = ({ subPriceId }: { subPriceId: string | undefined }) => {
  const tiers = [
    {
      name: "Free",
      tag: "All included. Free Forever",
      price: 0,
      btnText: "Get Started",
      features: [
        "5 Team members",
        "Real-time scheduling",
        "Email reminders",
        "Powerful team management",
      ],
      priceId: "price_1OWkdVKjgiEDHq2AesuPdTmq",
    },
    {
      name: "Medium",
      tag: "All included. Free Forever",
      price: 10,
      btnText: "Subscribe Now",
      features: [
        "20 Team members",
        "Real-time scheduling",
        "Email reminders",
        "Powerful team management",
      ],
      priceId: "price_1OWkdjKjgiEDHq2AOHNwODgi",
    },
    {
      name: "Unlimited",
      tag: "All included. Free Forever",
      price: 15,
      btnText: "Subsribe Now",
      features: [
        "Unlimited Team members",
        "Real-time scheduling",
        "Email reminders",
        "Powerful team management",
      ],
      priceId: "price_1OWkdyKjgiEDHq2AnKIzRjEY",
    },
  ];
  if (subPriceId == undefined) {
    return <div>No price found</div>;
  }
  return (
    <section id="pricing" className="py-6 px-2 text-lg text-white">
      <div className="container mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => {
            const selected = tier.priceId === subPriceId;
            return (
              <div
                key={i}
                className={classNames(
                  `flex flex-col rounded-xl bg-white py-6 px-6 text-black shadow`,
                  selected ? "border-2 border-indigo-600" : ""
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  {selected ? (
                    <FaCheckCircle className="text-indigo-700" />
                  ) : (
                    <FaRegCircle className="text-gray-200" />
                  )}
                </div>
                <p className="pt-3">{tier.tag}</p>
                <p className="pt-6">
                  <span className="text-2xl font-bold">${tier.price}</span>
                  /month
                </p>
                <ul className="pt-6">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <MdCheck className="text-indigo-600" />
                      <p>{feat}</p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
