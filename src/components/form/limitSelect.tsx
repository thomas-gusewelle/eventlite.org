import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

//this requies data to have an id and name property
export const LimitSelect: React.FC<{
	defaultNum?: number;
	selected: number;
	setSelected: Dispatch<SetStateAction<number>>;
}> = ({ defaultNum = 4, selected, setSelected }) => {
	const limitSelector = [1, 2, 3, 4, 6, 8, 10, 15, 20, 50];

	useEffect(() => {
		console.log("this is the selected: ", selected);
	}, [selected]);

	return (
		<div className=" block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
			<Listbox
				value={selected ?? defaultNum}
				onChange={(value) => setSelected(value)}>
				<div className="relative mt-1 ">
					<Listbox.Button className="relative h-full w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
						<div className="flex min-h-[1.5rem] flex-wrap">{selected}</div>
						<div className="absolute right-1 top-1/2 -translate-y-1/2">
							<MdOutlineKeyboardArrowDown size={20} className="text-gray-500" />
						</div>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{limitSelector.map((item, index) => {
								return (
									<Listbox.Option
										key={index}
										className={({ active }) =>
											`relative flex cursor-default select-none items-center py-2 pl-4 ${
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
													{item}
												</span>
											</>
										)}
									</Listbox.Option>
								);
							})}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};
