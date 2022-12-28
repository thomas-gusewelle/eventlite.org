import { Locations } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PaginateData } from "../../types/paginate";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { ErrorAlert } from "../components/alerts/errorAlert";
import { BtnAdd } from "../components/btn/btnAdd";
import { BtnCancel } from "../components/btn/btnCancel";
import { BtnSave } from "../components/btn/btnSave";
import { CircularProgress } from "../components/circularProgress";
import { SearchBar } from "../components/form/SearchBar";
import { SectionHeading } from "../components/headers/SectionHeading";
import { NoDataLayout } from "../components/layout/no-data-layout";
import { PaginationBar } from "../components/layout/pagination-bar";
import { sidebar, SidebarLayout } from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";
import { BottomButtons } from "../components/modal/bottomButtons";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";
import { AlertContext } from "../providers/alertProvider";
import { paginate } from "../utils/paginate";
import { trpc } from "../utils/trpc";

const LocationsPage = () => {
  const alertContext = useContext(AlertContext);
  const [locationList, setLocationList] = useState<Locations[]>();
  const [locationPaginated, setlocationPaginated] = useState<Locations[]>();
  const [pagiantedData, setpagiantedData] =
    useState<PaginateData<Locations[]>>();
  const [pageNum, setPageNum] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
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
      alertContext.setError({
        message: `Error fetching locations. Message: ${err.message}`,
        state: true,
      });
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
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an error editing your location. Please try again. ${err.message}`,
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
      alertContext.setError({
        state: true,
        message: `There was an error editing your location. Please try again. Message: ${error.message}`,
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
      alertContext.setError({
        state: true,
        message: `There was an error deleting your location. Please try again. Message: ${error.message}`,
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

  if (locations.isLoading || pagiantedData == undefined) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  if (locations.data?.length == 0) {
    return (
      <>
        <NoDataLayout
          heading='Locations'
          btnText='Add Location'
          func={() => setEditOpen(true)}
        />
        <Modal open={editOpen} setOpen={setEditOpen}>
          <>
            <form onSubmit={submit}>
              <ModalBody>
                <ModalTitle
                  text={editId == null ? "Add Location" : "Edit Location"}
                />
                <div className='mt-2'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'>
                    Location Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    {...register("name", { required: true, minLength: 3 })}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  />
                  {errors.name && (
                    <span className='text-red-500'>
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
      </>
    );
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
              <div className='mt-2'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'>
                  Location Name
                </label>
                <input
                  type='text'
                  id='name'
                  {...register("name", { required: true, minLength: 3 })}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                />
                {errors.name && (
                  <span className='text-red-500'>
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
      <>
        {/* MD Top Bar */}
        <div className='mb-8 grid grid-cols-2 gap-4 md:hidden'>
          <SectionHeading>Locations</SectionHeading>
          <div className='flex justify-end'>
            <BtnAdd
              onClick={() => {
                reset({ name: "" });
                setEditId(null);
                setEditOpen(true);
              }}
            />
          </div>
          <div className='col-span-2'>
            <input
              onChange={(e) => filter(e.target.value)}
              className='w-full rounded-xl border border-gray-100 bg-gray-100 py-2 pl-4 text-sm text-gray-500 focus:border-indigo-700 focus:outline-none'
              type='text'
              placeholder='Search'
            />
          </div>
        </div>

        {/* Desktop Top Bar */}
        <div className='mb-8 hidden justify-between md:flex'>
          <SectionHeading>Locations</SectionHeading>
          <div className='flex gap-4'>
            <input
              onChange={(e) => filter(e.target.value)}
              className='w-full rounded-xl border border-gray-100 bg-gray-100 py-2 pl-4 text-sm text-gray-500 focus:border-indigo-700 focus:outline-none'
              type='text'
              placeholder='Search'
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

        <div className='w-full'>
          <table className='w-full table-auto text-left'>
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
                  <tr key={index} className='border-t last:border-b'>
                    <td className='py-4 text-base leading-4 text-gray-800 md:text-xl'>
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
      </>
    </>
  );
};

LocationsPage.getLayout = sidebar;

export default LocationsPage;
