import { FormEvent, Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
// import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
export const MultiSelect = () => {
  type person = {
    id: string;
    name: string;
  };

  const people = [
    { id: "3387467e-012c-11ed-b939-0242ac120002", name: "Durward Reynolds" },
    { id: "44363f98-012c-11ed-b939-0242ac120002", name: "Kenton Towne" },
    { id: "4af7e4bc-012c-11ed-b939-0242ac120002", name: "Therese Wunsch" },
    { id: "4f690daa-012c-11ed-b939-0242ac120002", name: "Benedict Kessler" },
    { id: "53db5154-012c-11ed-b939-0242ac120002", name: "Katelyn Rohan" },
  ];
  const [selectedPeople, setSelectedPeople] = useState<typeof people>([]);
  const [listPeople, setListPeople] = useState<typeof people>(people);

  const removeSelected = (person: person, e: FormEvent) => {
    e.stopPropagation();
    setSelectedPeople(selectedPeople.filter((e) => e.id != person.id));
    setListPeople((arr) => [...arr, person]);
  };

  const addSelected = (people: { id: string; name: string }[]) => {
    if (!people) return;

    setListPeople(listPeople.filter((e) => !people.includes(e)));
    setSelectedPeople(people);
  };

  useEffect(() => {
    console.log("this is selected people", selectedPeople);
  }, [selectedPeople]);

  useEffect(() => {
    console.log("This is list People", listPeople);
  }, [listPeople]);

  return (
    <div className=' focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'>
      <Listbox
        value={selectedPeople}
        onChange={(person) => addSelected(person)}
        multiple>
        <div className='relative mt-1 '>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <div className='flex flex-wrap gap-2'>
              {selectedPeople.map((person) => (
                <div
                  className='flex gap-2 items-center z-50 py-1 px-2 rounded bg-indigo-100'
                  key={person.id}
                  onClick={(e) => removeSelected(person, e)}>
                  {person.name}
                  <AiOutlineCloseCircle size={15} className='cursor-pointer' />
                </div>
              ))}
            </div>
            <div className='flex justify-end items-center'>
              <MdOutlineArrowDropDownCircle
                size={30}
                className='text-indigo-700'
              />
            </div>
            {/* <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                
                <SelectorIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
              </span> */}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {listPeople.map((person) => (
                <Listbox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={person}>
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}>
                        {person.name}
                      </span>
                      {/* {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null} */}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

{
  /* <Listbox value={selectedPeople} onChange={setSelectedPeople} multiple >
      <Listbox.Button>
        {selectedPeople.map((person) => person?.name).join(", ")}
      </Listbox.Button>
      <Listbox.Options>
        {people.map((person) => (
          <Listbox.Option key={person.id} value={person}>
            {person.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  ); */
}
