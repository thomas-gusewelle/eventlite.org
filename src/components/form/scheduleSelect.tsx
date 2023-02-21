import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { MdAddCircleOutline, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import Link from "next/link";
import { useRouter } from "next/router";

//this requies data to have an id and name property
export const ScheduleSelect: React.FC<{
  selected: any;
  setSelected: Dispatch<SetStateAction<any>>;
  list: { name: string | null; show: boolean }[];
}> = ({ selected, setSelected, list }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [peopleList, setPeopleList] = useState(list);

  useEffect(() => {
    setPeopleList(list);
  }, [list]);

  // list.unshift({ name: "Not Scheduled", show: true });
  const filteredPeople =
    query === ""
      ? peopleList
      : peopleList.filter((person) =>
          person.name
            ?.toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  if (!list) return <div></div>;

  return (
    <div className='block w-full border-t border-gray-200 first:border-t-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm '>
      <Combobox
        value={selected}
        onChange={(value) => {
          setSelected(value);
        }}>
        <div className='flex w-full items-center'>
          <div
            className={`relative w-full ${
              selected.userResponce == null && "bg-gray-100"
            }
                            ${selected.userResponce == true && "bg-green-200"}
                            ${selected.userResponce == false && "bg-red-200"}`}>
            {selected.name != null && (
              <button
                className='absolute left-1 top-1/2 z-10 -translate-y-1/2'
                onClick={() => setSelected({ name: null })}>
                <TiDeleteOutline className='text-red-400' size={28} />
              </button>
            )}
            <Combobox.Button>
              <Combobox.Input
                autoComplete={"false"}
                className={`relative h-12 w-full cursor-default border-none py-2 pl-10 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm
                ${selected.userResponce == null && "bg-gray-100"}
                ${selected.userResponce == true && "bg-green-200"}
                ${selected.userResponce == false && "bg-red-200"}`}
                displayValue={(item: any) => item.name || ""}
                onChange={(event) =>
                  setQuery(event.target.value)
                }></Combobox.Input>
            </Combobox.Button>

            <Combobox.Button>
              <div className='absolute right-4 top-1/2 -translate-y-1/2 '>
                <MdOutlineKeyboardArrowDown
                  size={28}
                  className='text-gray-500'
                />
              </div>
            </Combobox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Combobox.Options className='absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {filteredPeople.map((item, index) => {
                  if (item.show != false) {
                    return (
                      <Combobox.Option
                        key={index}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? "bg-indigo-100" : "text-gray-900"
                          }`
                        }
                        value={item}>
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected
                                  ? "font-medium text-indigo-700"
                                  : "font-normal"
                              }`}>
                              {item.name}
                            </span>
                          </>
                        )}
                      </Combobox.Option>
                    );
                  }
                })}

                <div className='relative cursor-default select-none py-2 px-2 text-gray-700 hover:bg-indigo-100'>
                  <Link
                    href={`/people/adduser?redirect=${router.asPath}`}
                    className='flex items-center gap-3 '>
                    <MdAddCircleOutline size={22} color={"green"} />
                    Add a User
                  </Link>
                </div>
              </Combobox.Options>
            </Transition>
          </div>
        </div>
      </Combobox>
    </div>
  );
};
