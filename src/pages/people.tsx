import { useSession } from "next-auth/react";

import SidebarLayout from "../components/layout/sidebar";
import { PicNameRow } from "../components/profile/PicNameRow";
import { trpc } from "../utils/trpc";

const PeoplePage = () => {
  const people = trpc.useQuery(["user.getUsersByOrganization"]);
  console.log("This is the poeple", people);

  if (people.isLoading) {
    return <div></div>;
  }

  return (
    <SidebarLayout>
      <div>
        {people.data?.map((person, index) => (
          <PicNameRow key={index} user={person}></PicNameRow>
        ))}
      </div>
    </SidebarLayout>
  );
};

export default PeoplePage;
