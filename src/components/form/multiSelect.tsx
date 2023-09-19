import { Dispatch, FormEvent, Fragment, ReactNode, SetStateAction, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { MdOutlineKeyboardArrowDown, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ItemWithHide, ListWithHide } from "../../../types/genericTypes";

//this requies data to have an id and name property
export const MultiSelect: React.FC<{
  selected: any[];
  setSelected: Function;
  list: any[];
  setList: Function;
  disabled?: boolean;
}> = ({ selected, setSelected, list, setList, disabled = false }) => {
  const removeSelected = (item: any, e: FormEvent) => {
    e.stopPropagation();
    setSelected(selected.filter((e) => e.id != item.id));
    setList((arr: any) => [...arr, item]);
  };

  const addSelected = (items: any[]) => {
    if (!items) return;
    setList(list.filter((e) => !items.includes(e)));
    setSelected(items);
  };

  useEffect(() => {
    const filteredList = list.filter((e) =>
      selected.every((s) => s.id != e.id)
    );

    setList(filteredList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!list) return <div></div>;

  return (
    <div className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'>
      <Listbox
        disabled={disabled}
        value={selected}
        onChange={(person) => addSelected(person)}
        multiple>
        <div className='relative mt-1 '>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <div className='flex min-h-[1rem] flex-wrap gap-2'>
              {selected.map((item) => (
                <div
                  className='flex items-center gap-2 rounded bg-indigo-100 py-1 px-2'
                  key={item.id}
                  onClick={(e) => {
                    if (disabled) return;
                    removeSelected(item, e);
                  }}>
                  {item.name}
                  {disabled == false && (
                    <AiOutlineCloseCircle
                      size={15}
                      className='cursor-pointer'
                    />
                  )}
                </div>
              ))}
            </div>
            <div className='absolute right-1 top-1/2 -translate-y-1/2'>
              <MdOutlineKeyboardArrowDown size={20} className='text-gray-500' />
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {list.map((item) => (
                <Listbox.Option
                  key={item.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-indigo-100" : "text-gray-900"
                    }`
                  }
                  value={item}>
                  {({ selected }) => (
                    <div>
                      <MdCheckBoxOutlineBlank />
                      <span
                        className={`block truncate ${selected
                          ? "font-medium text-indigo-700"
                          : "font-normal"
                          }`}>
                        {item.name}
                      </span>
                    </div>
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



interface MultiSelectProps<ListItem extends { id: string }> {
  selected: ListWithHide<ListItem>;
  setSelected: Dispatch<SetStateAction<ListWithHide<ListItem>>>;
  list: ListWithHide<ListItem>;
  label: (item: ItemWithHide<ListItem>) => any;
  showAdd?: boolean;
  showAddComponent?: ReactNode;
  disabled?: boolean
}

//this requies data to have an id and name property
// comma after generic is used ot tell TSX file that it is a type and not a componenet
export const NewMultiSelect = <List extends { id: string },>({
  selected,
  setSelected,
  list,
  label,
  showAdd = false,
  showAddComponent = <></>,
  disabled = false,
}: MultiSelectProps<List>) => {

  // We are not using a useState for this because 
  // the state will already set when the list changes and everything rerenders
  const isAllSelected = selected.length == list.length;
  const ICON_SIZE = 20;

  function removeSelected(item: { item: List, hide?: boolean }, e: FormEvent): void {
    e.stopPropagation();
    setSelected(selected.filter((e) => e.item.id != item.item.id));
  }


  function toggleAll() {
    isAllSelected ? setSelected([]) : setSelected(list);
  }

  return (
    <>
      <div className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'>
        <Listbox
          disabled={disabled}
          value={selected}
          onChange={(value) => setSelected(value)}
          multiple>
          <div className='relative mt-1 '>
            <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
              <div className='flex min-h-[1rem] flex-wrap gap-2'>
                {isAllSelected && <div
                  className='flex items-center gap-2 rounded bg-indigo-100 py-1 px-2'
                  key={"All"}
                  onClick={(e) => e.stopPropagation()}
                >
                  {"All"}
                  {disabled == false && (
                    <AiOutlineCloseCircle
                      size={15}
                      onClick={(e) => {
                        if (disabled) return;
                        toggleAll();
                      }}
                      className='cursor-pointer'
                    />
                  )}
                </div>}
                {!isAllSelected &&
                  <>
                    {selected.map((item) => (
                      <div
                        className='flex items-center gap-2 rounded bg-indigo-100 py-1 px-2'
                        key={item.item.id}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {label(item)}
                        {disabled == false && (
                          <AiOutlineCloseCircle
                            size={15}
                            className='cursor-pointer'
                            onClick={(e) => {
                              if (disabled) return;
                              removeSelected(item, e);
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </>}
              </div>
              <div className='absolute right-1 top-1/2 -translate-y-1/2'>
                <MdOutlineKeyboardArrowDown size={20} className='text-gray-500' />
              </div>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'>
              <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm text-left'>
                <div onClick={() => toggleAll()} className={`flex gap-3 items-center relative cursor-default select-none py-2 pl-10 pr-4 ${isAllSelected ? "bg-indigo-100" : "text-gray-900"}`}>

                  {isAllSelected ? <MdCheckBox className="text-indigo-700" size={ICON_SIZE} /> : <MdCheckBoxOutlineBlank size={ICON_SIZE} />}
                  <span
                    className={`block truncate ${isAllSelected
                      ? "font-medium text-indigo-700"
                      : "font-normal"
                      }`}>
                    {"Select All"}
                  </span>
                </div>
                {list.map((item, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-indigo-100" : "text-gray-900"
                      }`
                    }
                    value={item}>
                    {({ selected }) => (
                      <div className="flex gap-3 items-center">
                        {selected ? <MdCheckBox className="text-indigo-700" size={ICON_SIZE} /> : <MdCheckBoxOutlineBlank size={ICON_SIZE} />}
                        <span
                          className={`block truncate ${selected
                            ? "font-medium text-indigo-700"
                            : "font-normal"
                            }`}>
                          {label(item)}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

    </>
  );
};
