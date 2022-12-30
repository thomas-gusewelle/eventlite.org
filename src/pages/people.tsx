import { useContext, useEffect, useState } from "react";
import { sidebar } from "../components/layout/sidebar";
import { PicNameRow } from "../components/profile/PicNameRow";
import { trpc } from "../utils/trpc";
import { AddDropdownMenu } from "../components/menus/addDropdown";
import { SectionHeading } from "../components/headers/SectionHeading";
import { CircularProgress } from "../components/circularProgress";
import { Role, User } from "@prisma/client";
import { TableDropdown } from "../components/menus/tableDropdown";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { PaginationBar } from "../components/layout/pagination-bar";
import { paginate } from "../utils/paginate";
import { PaginateData } from "../../types/paginate";
import { AlertContext } from "../providers/alertProvider";
import { NoDataLayout } from "../components/layout/no-data-layout";
import { useRouter } from "next/router";
import { UserContext } from "../providers/userProvider";

const PeoplePage = () => {
  const alertContext = useContext(AlertContext);
  const router = useRouter();
  const user = useContext(UserContext);
  const [peopleList, setPeopleList] = useState<(User & { roles: Role[] })[]>();
  const [peopleUnPageList, setPeopleUnPageList] =
    useState<(User & { roles: Role[] })[]>();
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, setPaginatedData] = useState<
    PaginateData<
      (User & {
        roles: Role[];
      })[]
    >
  >();
  const people = trpc.useQuery(["user.getUsersByOrganization"], {
    onSuccess: (data) => {
      if (data) {
        setPeopleUnPageList(data);
      }
    },
  });
  const adminCount = trpc.useQuery(["user.getAmdminCount"]);
  const deleteUser = trpc.useMutation("user.deleteUserByID", {
    onError: (error) => {
      alertContext.setError({
        message: `Sorry. There was an issue deleting the user. Message: ${error}`,
        state: true,
      });
      console.log(error);
    },
    onSuccess: () => {
      people.refetch();
    },
  });

  const onDelete = (person: User) => {
    console.log("getting Called");
    if (adminCount.isLoading) return;
    if (adminCount.error) return;
    if (adminCount.data == undefined) return;

    if (adminCount.data <= 1 && person.status == "ADMIN") {
      alertContext.setError({
        message: "Error. You must have at least one admin account.",
        state: true,
      });
      return;
    }
    deleteUser.mutate(person.id);
  };

  const filter = (e: string) => {
    if (e.length > 0) {
      let key = e.toLowerCase();
      const filter = people.data?.filter((person) => {
        return (
          person.firstName?.toLowerCase().includes(key) ||
          person.lastName?.toLowerCase().includes(key) ||
          person.email?.toLowerCase().includes(key)
        );
      });
      if (filter) {
        setPageNum(1);
        setPeopleUnPageList(filter);
      }
    } else {
      if (people.data) {
        setPeopleUnPageList(people.data);
      }
    }
  };

  useEffect(() => {
    if (peopleUnPageList) {
      const paginated = paginate(peopleUnPageList, pageNum);
      setPaginatedData(paginated);
      setPeopleList(paginated.data);
    }
  }, [pageNum, peopleUnPageList]);

  const addOptions: TableOptionsDropdown = [
    { name: "Add User", href: "/people/adduser" },
    { name: "Invite User", href: "#" },
  ];

  if (people.error) {
    return <div>{people.error.message}</div>;
  }

  if (
    people.isLoading ||
    peopleList == undefined ||
    paginatedData == undefined
  ) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  if (people.data?.length == 0) {
    return (
      <NoDataLayout
        heading='Users'
        btnText='Add User'
        func={() => router.push("/people/adduser")}
      />
    );
  }

  return (
    <>
      {/* MD Top Bar */}
      <div className='mb-8 grid grid-cols-2 gap-4 md:hidden'>
        <SectionHeading>Users</SectionHeading>
        <div className='flex justify-end'>
          <AddDropdownMenu options={addOptions} />
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
        <SectionHeading>Users</SectionHeading>
        <div className='flex gap-4'>
          <input
            onChange={(e) => filter(e.target.value)}
            className='w-full rounded-xl border border-gray-100 bg-gray-100 py-2 pl-4 text-sm text-gray-500 focus:border-indigo-700 focus:outline-none'
            type='text'
            placeholder='Search'
          />
          {/* <SearchBar /> */}
          <AddDropdownMenu options={addOptions} />
        </div>
      </div>

      <div className='w-full '>
        <table className='w-full table-auto text-left'>
          <thead>
            <tr>
              <th>Name</th>
              <th className='hidden md:table-cell'>Email</th>
              <th>Role</th>
              <th className='hidden md:table-cell'>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {peopleList.map((person, index) => {
              const options: TableOptionsDropdown = [
                {
                  name: "View Profile",
                  href: `/people/edit/${person.id}`,
                },
                {
                  name: "Edit",
                  href: `/people/edit/${person.id}`,
                  show: user?.status == "ADMIN" || user?.status == "MANAGER",
                },
                {
                  name: "Delete",
                  function: () => onDelete(person),
                  show: user?.status == "ADMIN" || user?.status == "MANAGER",
                },
              ];

              return (
                <tr key={index} className='border-t last:border-b'>
                  <td className='py-4'>
                    <PicNameRow user={person} />
                  </td>
                  <td className='hidden md:table-cell'>{person.email}</td>
                  <td>
                    <div className='my-1 flex flex-wrap items-center justify-start gap-1'>
                      {person.roles.map((role, index) => (
                        <div
                          key={index}
                          className='rounded-xl bg-indigo-200 px-2 text-center'>
                          {role.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='hidden md:table-cell'>{person.status}</td>

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
        paginateData={paginatedData}
      />
    </>
  );
};

PeoplePage.getLayout = sidebar;

export default PeoplePage;
