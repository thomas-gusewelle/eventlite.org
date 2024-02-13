import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { classNames } from "../../../utils/classnames";

export const BillingLayout = ({ children }: { children: ReactNode }) => {
  const routes = [
    {
      name: "History",
      slug: "history",
      onClick: () => {
        router.push("/account/billing/history");
      },
    },
    {
      name: "Billing Settings",
      slug: "settings",
      onClick: () => {
        router.push("/account/billing/settings");
      },
    },
  ];
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // checks the last part of the path to find the button that should be active
  useEffect(() => {
    const page = router.pathname.split("/").pop();
    const index = routes.findIndex((i) => i.slug === page);
    if (index != -1) {
      setSelectedIndex(index);
    }
  }, [router]);

  return (
    <>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="mb-6 flex justify-start space-x-1 rounded-xl bg-gray-100 p-1 sm:w-fit">
          {routes.map((item, index) => (
            <Tab
              key={index}
              onClick={item.onClick}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg px-4 py-3 text-sm font-medium leading-5 sm:w-auto",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-indigo-700 shadow"
                    : " text-gray-600 hover:bg-white/[0.12] hover:text-gray-400"
                )
              }
            >
              {item.name}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>

      {children}
    </>
  );
};
