import { Locations } from "@prisma/client";
import { useState } from "react";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { BtnAdd } from "../components/btn/btnAdd";
import { SearchBar } from "../components/form/SearchBar";
import { SectionHeading } from "../components/headers/SectionHeading";
import SidebarLayout from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";
import { BottomButtons } from "../components/modal/bottomButtons";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";
import { trpc } from "../utils/trpc";

const LocationsPage = () => {
  const [locationList, setLocationList] = useState<Locations[]>();
  const [editOpen, setEditOpen] = useState(false);

  const locations = trpc.useQuery(["locations.getLocationsByOrg"], {
    onSuccess(data) {
      setLocationList(data);
    },
    onError(err) {
      alert(err.message);
    },
  });

  const close = () => {
    console.log("close");
    setEditOpen(false);
  };

  const onDelete = (location: Locations) => {};

  return (
    <>
      <Modal open={editOpen} setOpen={setEditOpen}>
        <>
          <ModalBody>
            <ModalTitle text='Add Location' />
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed. This action cannot be undone.
              </p>
            </div>
          </ModalBody>
          <BottomButtons onClick={() => setEditOpen(false)} />
        </>
      </Modal>
      <SidebarLayout>
        {/* MD Top Bar */}
        <div className='md:hidden grid grid-cols-2 mb-8 gap-4'>
          <SectionHeading>Locations</SectionHeading>
          <div className='flex justify-end'>
            <BtnAdd onClick={() => setEditOpen(true)} />
          </div>
          <div className='col-span-2'>
            <SearchBar />
          </div>
        </div>

        {/* Desktop Top Bar */}
        <div className='hidden md:flex justify-between mb-8'>
          <SectionHeading>Locations</SectionHeading>
          <div className='flex gap-4'>
            <input
              // onChange={(e) => filter(e.target.value)}
              className='border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2'
              type='text'
              placeholder='Search'
            />
            {/* <SearchBar /> */}
            <BtnAdd onClick={() => setEditOpen(true)} />
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
              {locationList?.map((loc, index) => {
                const options: TableOptionsDropdown = [
                  {
                    name: "Edit",
                    function: () => setEditOpen(true),
                  },
                  { name: "Delete", function: () => onDelete(loc) },
                ];

                return (
                  <tr key={index} className='border-t last:border-b'>
                    <td className='py-4 md:text-xl text-gray-800 text-base leading-4'>
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
      </SidebarLayout>
    </>
  );
};

export default LocationsPage;
