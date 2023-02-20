import Link from "next/link";
import { ReactNode } from "react";
import { MdAddCircleOutline } from "react-icons/md";

//Provides a way for linking from selection or handling an onclick
export const AddSelection = ({
  href,
  children,
  onClick,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) => {
  if (href != undefined) {
    return (
      <div className='relative cursor-default select-none py-2 px-2 text-gray-700 hover:bg-indigo-100'>
        <Link href={href} className='flex items-center gap-3 '>
          <MdAddCircleOutline size={22} color={"green"} />
          {children}
        </Link>
      </div>
    );
  }
  if (onClick != undefined) {
    return (
      <div
        onClick={onClick}
        className='relative flex cursor-default select-none items-center gap-3 py-2 px-2 text-gray-700 hover:bg-indigo-100'>
        <MdAddCircleOutline size={22} color={"green"} />
        {children}
      </div>
    );
  }
  return <>gfgfds</>;
};
