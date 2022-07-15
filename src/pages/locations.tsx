import SidebarLayout from "../components/layout/sidebar";
import { trpc } from "../utils/trpc";

const LocationsPage = () => {
  const locations = trpc.useQuery(["locations.getLocationsByOrg"]);

  return (
    <SidebarLayout>
      <div>{locations.data?.map((location) => location.name)}</div>
    </SidebarLayout>
  );
};

export default LocationsPage;
