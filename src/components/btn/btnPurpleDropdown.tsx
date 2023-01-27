import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { MdChevronLeft } from "react-icons/md";
import { Url } from "url";
import { TableOptionsDropdown } from "../../../types/tableMenuOptions";
import { classNames } from "../../utils/classnames";

export const BtnPurpleDropdown = ({
  children,
  btnFunction,
  type = "button",
  fullWidth = false,
  options,
}: {
  children: any;
  btnFunction?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  options: TableOptionsDropdown;
}) => {
  return (
    <div className='flex'>
      <button
        type={type}
        tabIndex={1}
        className={`flex w-full items-center justify-center rounded-l-md bg-indigo-600 py-2 pl-4 pr-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  sm:text-sm ${
          fullWidth ? "" : "sm:w-auto"
        }`}
        onClick={btnFunction}>
        {children}
      </button>
      <Menu as='div' className='relative inline-block text-left md:mr-6'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-r-md border-l border-gray-300 bg-indigo-600 py-2 px-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-0 focus:ring-indigo-500'>
            <MdChevronLeft
              color='white'
              size={25}
              aria-hidden='true'
              className='-rotate-90'
            />
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
          <Menu.Items className='absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
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
                          onClick={() => option.function}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full px-4 py-2 text-left text-sm"
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
    </div>
  );
};
