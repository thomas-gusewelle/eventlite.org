import { useState } from "react";
import { useForm } from "react-hook-form";
import { SingleSelect } from "./singleSelect";

type selection = { id: string; name: string };

export const RecurringOptions: React.FC<{
	selection: selection;
}> = ({ selection }) => {
	if (selection == undefined) {
		return <div></div>;
	}

	switch (selection.id) {
		case "D":
			return <DailyOptions selection={selection} />;
			break;
		default:
			return <div></div>;
	}
};

const DailyOptions: React.FC<{ selection: selection }> = ({ selection }) => {
	const [occuranceType, setOccuranceType] = useState<selection>({
		id: "Num",
		name: "Ending After",
	});

	return (
		<div className="grid grid-cols-6 gap-6">
			<div className="col-span-6">
				<SingleSelect
					selected={occuranceType}
					setSelected={setOccuranceType}
					list={[
						{ id: "Num", name: "Ending After" },
						{ id: "Date", name: "Ending On" },
					]}
				/>
			</div>
			{occuranceType.id == "Num" && (
				<div className="col-span-6">
					<label className="text-gray-700">Occurances</label>
					<input
						required
						type={"number"}
						max={52}
						className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
					/>
				</div>
			)}
			{occuranceType.id == "Date" && <div></div>}
		</div>
	);
};
