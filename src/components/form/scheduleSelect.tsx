import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";

//this requies data to have an id and name property
export const ScheduleSelect: React.FC<{
	selected: any;
	setSelected: Dispatch<SetStateAction<any>>;
	list: { name: string | null; show: boolean }[];
}> = ({ selected, setSelected, list }) => {
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
		<div className="block w-full border-t border-gray-200 first:border-t-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ">
			<Combobox
				value={selected}
				onChange={(value) => {
					setSelected(value);
				}}>
				<div className="relative flex">
					<div onClick={() => setSelected()}>
						<TiDeleteOutline className="text-red-200" size={20} />
					</div>
					<Combobox.Button>
						<Combobox.Input
							className={`relative h-full w-full cursor-default border-none py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm
                            ${selected.userResponce == null && "bg-gray-100"}
                            ${selected.userResponce == true && "bg-green-200"}
                            ${selected.userResponce == false && "bg-red-200"}`}
							displayValue={(item: any) => item.name || ""}
							onChange={(event) => setQuery(event.target.value)}>
							{/* <div className="flex h-full min-h-[1.5rem] flex-wrap items-center">
							{selected.name || ""}
						</div> */}
						</Combobox.Input>
					</Combobox.Button>

					<Combobox.Button>
						<div className="absolute right-1 top-1/2 -translate-y-1/2">
							<MdOutlineKeyboardArrowDown size={20} className="text-gray-500" />
						</div>
					</Combobox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{filteredPeople.length == 0 && query != "" ? (
								<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Nothing found.
								</div>
							) : (
								filteredPeople.map((item, index) => {
									if (item.show != false) {
										return (
											<Combobox.Option
												key={index}
												className={({ active }) =>
													`relative cursor-default select-none py-2 pl-10 pr-4 ${
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
								})
							)}
						</Combobox.Options>
					</Transition>
				</div>
			</Combobox>
		</div>
	);
};
