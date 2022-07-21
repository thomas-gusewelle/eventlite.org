import { Locations } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PaginateData } from "../../types/paginate";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { ErrorAlert } from "../components/alerts/errorAlert";
import { BtnAdd } from "../components/btn/btnAdd";
import { BtnCancel } from "../components/btn/btnCancel";
import { BtnSave } from "../components/btn/btnSave";
import { SearchBar } from "../components/form/SearchBar";
import { SectionHeading } from "../components/headers/SectionHeading";
import { PaginationBar } from "../components/layout/pagination-bar";
import SidebarLayout from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";
import { BottomButtons } from "../components/modal/bottomButtons";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";
import { paginate } from "../utils/paginate";
import { trpc } from "../utils/trpc";

const LocationsPage = () => {
	const [locationList, setLocationList] = useState<Locations[]>();
	const [locationPaginated, setlocationPaginated] = useState<Locations[]>();
	const [pagiantedData, setpagiantedData] =
		useState<PaginateData<Locations[]>>();
	const [pageNum, setPageNum] = useState(1);
	const [editOpen, setEditOpen] = useState(false);
	const [errorAlert, setErrorAlert] = useState({ state: false, message: "" });
	const [editId, setEditId] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const locations = trpc.useQuery(["locations.getLocationsByOrg"], {
		onSuccess(data) {
			setLocationList(data);
		},
		onError(err) {
			alert(err.message);
		},
	});

	const addLocation = trpc.useMutation("locations.createLocation", {
		onSuccess(data, variables, context) {
			if (locationList && data) {
				const newData = [...locationList, data];
				setLocationList(newData);
				setEditOpen(false);
				locations.refetch();
			}
		},
		onError() {
			setErrorAlert({
				state: true,
				message: "There was an error editing your location. Please try again.",
			});
		},
	});

	const editLocation = trpc.useMutation("locations.editLocationByID", {
		onMutate(data) {
			if (editId != null && locationList) {
				let index = locationList?.findIndex((loc) => loc.id == data.id);

				if (index >= 0) {
					locationList[index]!.name = data.name;
				}
				setEditOpen(false);
			}
		},
		onError(error, variables, context) {
			setErrorAlert({
				state: true,
				message: "There was an error editing your location. Please try again.",
			});
			locations.refetch();
		},
		onSuccess() {
			locations.refetch();
		},
	});

	const deleteLocation = trpc.useMutation("locations.deletebyId", {
		onMutate(data) {
			const newData = locationList?.filter((location) => location.id != data);
			setLocationList(newData);
		},
		onSuccess(data) {
			locations.refetch();
		},
		onError(error, variables, context) {
			setErrorAlert({
				state: true,
				message: "There was an error deleting your location. Please try again.",
			});
			locations.refetch();
		},
	});

	useEffect(() => {
		if (locationList != undefined) {
			const _paginated = paginate(locationList, pageNum);
			setpagiantedData(_paginated);
			setlocationPaginated(_paginated.data);
		}
	}, [locationList, pageNum]);

	const submit = handleSubmit((data) => {
		if (editId == null) {
			addLocation.mutate(data.name);
		}
		if (editId != null) {
			editLocation.mutate({
				id: editId,
				name: data.name,
			});
		}
	});

	const filter = (e: string) => {
		if (e.length > 0) {
			let key = e.toLowerCase();
			const filter = locations.data?.filter((loc) => {
				return loc.name?.toLowerCase().includes(key);
			});
			setPageNum(1);
			setLocationList(filter);
		} else {
			setLocationList(locations.data);
		}
	};

	if (pagiantedData == undefined) {
		return <div></div>;
	}

	return (
		<>
			<Modal open={editOpen} setOpen={setEditOpen}>
				<>
					<form onSubmit={submit}>
						<ModalBody>
							<ModalTitle
								text={editId == null ? "Add Location" : "Edit Location"}
							/>
							<div className="mt-2">
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700">
									Location Name
								</label>
								<input
									type="text"
									id="name"
									{...register("name", { required: true, minLength: 3 })}
									className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
								/>
								{errors.name && (
									<span className="text-red-500">
										Location Name is Required
									</span>
								)}
							</div>
						</ModalBody>
						<BottomButtons>
							<BtnSave type={"submit"} />
							<BtnCancel
								onClick={() => {
									setEditOpen(false);
								}}
							/>
						</BottomButtons>
					</form>
				</>
			</Modal>
			<SidebarLayout>
				{errorAlert.state && (
					<ErrorAlert setState={setErrorAlert} error={errorAlert} />
				)}
				{/* MD Top Bar */}
				<div className="md:hidden grid grid-cols-2 mb-8 gap-4">
					<SectionHeading>Locations</SectionHeading>
					<div className="flex justify-end">
						<BtnAdd
							onClick={() => {
								reset({ name: "" });
								setEditId(null);
								setEditOpen(true);
							}}
						/>
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
					<SectionHeading>Locations</SectionHeading>
					<div className="flex gap-4">
						<input
							onChange={(e) => filter(e.target.value)}
							className="border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2"
							type="text"
							placeholder="Search"
						/>
						{/* <SearchBar /> */}
						<BtnAdd
							onClick={() => {
								reset({ name: "" });
								setEditId(null);
								setEditOpen(true);
							}}
						/>
					</div>
				</div>

				<div className="w-full">
					<table className="w-full table-auto text-left">
						<thead>
							<tr>
								<th>Name</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{locationPaginated?.map((loc, index) => {
								const options: TableOptionsDropdown = [
									{
										name: "Edit",
										function: () => {
											reset(loc);
											setEditId(loc.id);
											setEditOpen(true);
										},
									},
									{
										name: "Delete",
										function: () => {
											deleteLocation.mutate(loc.id);
										},
									},
								];

								return (
									<tr key={index} className="border-t last:border-b">
										<td className="py-4 md:text-xl text-gray-800 text-base leading-4">
											{loc.name}
										</td>
										<td>
											<TableDropdown options={options} />
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<PaginationBar
					setPageNum={setPageNum}
					pageNum={pageNum}
					paginateData={pagiantedData}
				/>
			</SidebarLayout>
		</>
	);
};

export default LocationsPage;
