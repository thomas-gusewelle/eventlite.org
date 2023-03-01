import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, ReactNode } from "react";
import { classNames } from "../../utils/classnames";
import { SidebarLayout } from "./sidebar";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const route = router.route;

  const links = [
    { name: "Beta request", href: "/admin/beta" },
    { name: "Organizations", href: "/admin/orgs" },
    { name: "Login Users", href: "/admin/login-users" },
  ];
  return (
    <>
      <div className='flex flex-wrap gap-3'>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={classNames(
              route == link.href
                ? "bg-gray-100 text-indigo-600"
                : "bg-gray-200 text-black",
              "rounded-lg bg-gray-200 px-3 py-1"
            )}>
            {link.name}
          </Link>
        ))}
      </div>
      <div className='mt-12'>{children}</div>
    </>
  );
};
