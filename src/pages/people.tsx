import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { userInfo } from "os";
import { BtnNeutral } from "../components/btn/btnNeutral";
import { Fragment } from "react";
import SidebarLayout from "../components/layout/sidebar";
import { PicNameRow } from "../components/profile/PicNameRow";
import { trpc } from "../utils/trpc";
import { BiChevronDown } from "react-icons/bi";

const PeoplePage = () => {
  const people = trpc.useQuery(["user.getUsersByOrganization"]);
  console.log("This is the poeple", people);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  if (people.isLoading) {
    return <div></div>;
  }

  return (
    <SidebarLayout>
      <div className='w-full bg-white'>
        <table className='w-full table-auto text-left'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.data?.map((person, index) => (
              <tr key={index} className='border-t last:border-b'>
                <td className='py-2'>
                  <PicNameRow user={person} />
                </td>
                <td>{person.email}</td>
                <td>{person.status}</td>
                <td>
                  <div className='flex gap-2'>
                    <BtnNeutral>Edit</BtnNeutral>
                    <BtnNeutral>Email</BtnNeutral>
                  </div>
                </td>
                <td>
                  <Menu as='div' className='relative inline-block text-left'>
                    <div>
                      <Menu.Button className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
                        Options
                        <BiChevronDown
                          className='-mr-1 ml-2 h-5 w-5'
                          aria-hidden='true'
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
                      <Menu.Items className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        <div className='py-1'>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href='#'
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}>
                                Account settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href='#'
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}>
                                Support
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href='#'
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}>
                                License
                              </a>
                            )}
                          </Menu.Item>
                          <form method='POST' action='#'>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type='submit'
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block w-full text-left px-4 py-2 text-sm"
                                  )}>
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </form>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
};

export default PeoplePage;
