import { Locations } from "@prisma/client";
import { useState } from "react";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { BtnAdd } from "../components/btn/btnAdd";
import { SearchBar } from "../components/form/SearchBar";
import { SectionHeading } from "../components/headers/SectionHeading";
import SidebarLayout from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";
import { trpc } from "../utils/trpc";

const LocationsPage = () => {
  const [locationList, setLocationList] = useState<Locations[]>();

  const locations = trpc.useQuery(["locations.getLocationsByOrg"], {
    onSuccess(data) {
      setLocationList(data);
    },
    onError(err) {
      alert(err.message);
    },
  });

  const onDelete = (location: Locations) => {};

  return (
    <SidebarLayout>
      {/* MD Top Bar */}
      <div className='md:hidden grid grid-cols-2 mb-8 gap-4'>
        <SectionHeading>Locations</SectionHeading>
        <div className='flex justify-end'>
          <BtnAdd />
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
          <BtnAdd />
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
                  href: `/people/edit/${loc.id}`,
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
  );
};

export default LocationsPage;
