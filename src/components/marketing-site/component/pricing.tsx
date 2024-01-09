import { MdCheck } from "react-icons/md";
import { BtnPurple } from "../../btn/btnPurple";

export const IndexPricingLayout = () => {
  const tiers = [
    {
      name: "Free",
      tag: "All included. Free Forever",
      price: 0,
      btnText: "Get Started",
      features: ["5 Team members", "Real-time scheduling", "Email reminders", "Powerful team management"],
    },
    {
      name: "Medium",
      tag: "All included. Free Forever",
      price: 10,
      btnText: "Subscribe Now",
      features: ["20 Team members", "Real-time scheduling", "Email reminders", "Powerful team management"],
    },
    {
      name: "Unlimited",
      tag: "All included. Free Forever",
      price: 15,
      btnText: "Subsribe Now",
      features: ["Unlimited Team members", "Real-time scheduling", "Email reminders", "Powerful team management"],
    },
  ];
  return (
    <section
      id="pricing"
      className="bg-gradient-to-tl from-indigo-500 to-indigo-900 py-16 px-2 text-lg text-white"
    >
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-xl px-2 text-center text-lg">
          <h2 className="text-4xl font-bold xl:text-5xl">Pricing Plans</h2>
          <p className="mt-0 text-gray-300 sm:mt-3">
            Volunteer scheduling is just the tip of the iceberg. We&apos;re
            constantly working on new developments and updates that will help
            you manage your team of volunteers more effectively.
          </p>
        </div>

        <div className="grid gap-6 pt-9 md:grid-cols-3">
          {tiers.map((tier) => (
            <div className="flex flex-col rounded-xl bg-white py-6 px-6 text-black shadow">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="pt-3">{tier.tag}</p>
              <p className="py-6">
                <span className="text-2xl font-bold">${tier.price}</span>/month
              </p>
              <BtnPurple>{tier.btnText}</BtnPurple>
              <ul className="pt-6">
                {tier.features.map((feat, i) => (
                  <li key-={i} className="flex items-center gap-3">
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
