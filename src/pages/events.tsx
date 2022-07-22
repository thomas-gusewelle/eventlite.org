import { FormEvent } from "react";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";
import { AddDropdownMenu } from "../components/menus/addDropdown";

const filter = (e: string) => {};

const EventsPage = () => {
	const addOptions: TableOptionsDropdown = [
		{ name: "New Event", href: "/events/addevent" },
		{ name: "From Template", href: "#" },
	];
	return (
		<>
			{/* MD Top Bar */}
			<div className="md:hidden grid grid-cols-2 mb-8 gap-4">
				<SectionHeading>Events</SectionHeading>
				<div className="flex justify-end">
					<AddDropdownMenu options={addOptions} />
				</div>
				<div className="col-span-2">
					<input
						onChange={(e) => filter(e.target.value)}
						className="border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2"
						type="text"
						placeholder="Search"
					/>
				</div>
			</div>

			{/* Desktop Top Bar */}
			<div className="hidden md:flex justify-between mb-8">
				<SectionHeading>Events</SectionHeading>
				<div className="flex gap-4">
					<input
						onChange={(e) => filter(e.target.value)}
						className="border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2"
						type="text"
						placeholder="Search"
					/>
					{/* <SearchBar /> */}
					<AddDropdownMenu options={addOptions} />
				</div>
			</div>
		</>
	);
};

EventsPage.getLayout = sidebar;

export default EventsPage;
