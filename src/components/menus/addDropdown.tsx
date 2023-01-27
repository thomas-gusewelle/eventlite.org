import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { BiChevronDown } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import { Url } from "url";
import { TableOptionsDropdown } from "../../../types/tableMenuOptions";

export const AddDropdownMenu: React.FC<{ options: TableOptionsDropdown }> = ({
  options,
}) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Menu as='div' className='relative inline-block text-left md:mr-6'>
      <div>
        <Menu.Button className='inline-flex justify-center w-full border border-gray-300 shadow-sm p-2 rounded-full bg-indigo-700 text-sm font-medium text-gray-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
          <MdAdd color='white' size={25} aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <Menu.Items className='origin-top-right absolute right-0 mt-2 w-56 z-50 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            {options.map((option, index) => {
              if (option.href && !option.show != false) {
                return (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      (<Link
                        href={option.href as unknown as Url}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}>

                        {option.name}

                      </Link>)
                    )}
                  </Menu.Item>
                );
              }
              if (option.function != undefined && !option.show != false) {
                return (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <button
                        onClick={() => option.function?.()}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full text-left px-4 py-2 text-sm"
                        )}>
                        {option.name}
                      </button>
                    )}
                  </Menu.Item>
                );
              }
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
