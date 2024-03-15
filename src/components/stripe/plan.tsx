import { api } from "../../server/utils/api";
import { useRouter } from "next/router";
import { MdCheck } from "react-icons/md";
import { BtnPurple } from "../btn/btnPurple";

export const PlanPayment = () => {
  const [sub, subQuery] = api.stripe.getSubscriptionPlan.useSuspenseQuery();
  const subPlanId = sub?.items.data[0]?.plan.id;
  return (
    <>
      <PlanCards subId={subPlanId}/>
      {sub?.id ?? "null"}
    </>
  );
};

//TODO: Finish styling and selecting the correct price ID
const PlanCards = ({subId}: {subId: string | undefined}) => {
  const router = useRouter();
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
  if (subId == undefined) {
    return <div>No price found</div>
  }
  return (
    <section id="pricing" className="py-16 px-2 text-lg text-white">
      <div className="container mx-auto">
        <div className="grid gap-6 pt-9 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl bg-white py-6 px-6 text-black shadow"
            >
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="pt-3">{tier.tag}</p>
              <p className="py-6">
                <span className="text-2xl font-bold">${tier.price}</span>/month
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
          ))}
        </div>
      </div>
    </section>
  );
};
