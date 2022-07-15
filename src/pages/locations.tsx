import { BtnAdd } from "../components/btn/btnAdd";
import { SearchBar } from "../components/form/SearchBar";
import { SectionHeading } from "../components/headers/SectionHeading";
import SidebarLayout from "../components/layout/sidebar";
import { trpc } from "../utils/trpc";

const LocationsPage = () => {
  const locations = trpc.useQuery(["locations.getLocationsByOrg"]);

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
    </SidebarLayout>
  );
};

export default LocationsPage;
