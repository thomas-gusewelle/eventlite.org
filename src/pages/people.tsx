import { Menu, Transition } from "@headlessui/react";
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
import SidebarLayout from "../components/layout/sidebar";
import { PicNameRow } from "../components/profile/PicNameRow";
import { trpc } from "../utils/trpc";
import { BiChevronDown } from "react-icons/bi";
import { AddUserMenu } from "../components/menus/addUser";
import { SectionHeading } from "../components/headers/SectionHeading";
import { SearchBar } from "../components/form/SearchBar";
import Link from "next/link";
import { CircularProgress } from "../components/circularProgress";
import { Role, User } from "@prisma/client";
import { classNames } from "../utils/classnames";
import { TableDropdown } from "../components/menus/tableDropdown";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { PaginationBar } from "../components/layout/pagination-bar";
import { paginate } from "../utils/paginate";
import { off } from "process";

const PeoplePage = () => {
  const [peopleList, setPeopleList] = useState<(User & { roles: Role[] })[]>();
  const [pageNum, setPageNum] = useState(1);
  const people = trpc.useQuery(["user.getUsersByOrganization"], {
    onSuccess: (data) => {
      if (data) {
        const pagianted = paginate(data, pageNum, 10);
        console.log(pagianted);
        setPeopleList(pagianted.data);
      }
    },
  });
  const adminCount = trpc.useQuery(["user.getAmdminCount"]);
  const deleteUser = trpc.useMutation("user.deleteUserByID", {
    onError: (error) => {
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
      alert("You must have at least one admin user");
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
        const paginated = paginate(filter, 1, 10);
        setPeopleList(paginated.data);
      }
    } else {
      if (people.data) {
        const paginated = paginate(people.data, pageNum, 10);
        setPeopleList(paginated.data);
      }
    }
  };

  useEffect(() => {
    if (people.data) {
      const paginated = paginate(people.data, pageNum, 10);
      setPeopleList(paginated.data);
    }
  }, [pageNum]);

  if (people.error) {
    return (
      <SidebarLayout>
        <div>{people.error.message}</div>;
      </SidebarLayout>
    );
  }

  if (people.isLoading || peopleList == undefined) {
    return (
      <SidebarLayout>
        <div className='flex justify-center'>
          <CircularProgress />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      {/* MD Top Bar */}
      <div className='md:hidden grid grid-cols-2 mb-8 gap-4'>
        <SectionHeading>Users</SectionHeading>
        <div className='flex justify-end'>
          <AddUserMenu />
        </div>
        <div className='col-span-2'>
          <input
            onChange={(e) => filter(e.target.value)}
            className='border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2'
            type='text'
            placeholder='Search'
          />
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className='hidden md:flex justify-between mb-8'>
        <SectionHeading>Users</SectionHeading>
        <div className='flex gap-4'>
          <input
            onChange={(e) => filter(e.target.value)}
            className='border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2'
            type='text'
            placeholder='Search'
          />
          {/* <SearchBar /> */}
          <AddUserMenu />
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
                },
                { name: "Delete", function: () => onDelete(person) },
              ];

              return (
                <tr key={index} className='border-t last:border-b'>
                  <td className='py-4'>
                    <PicNameRow user={person} />
                  </td>
                  <td className='hidden md:table-cell'>{person.email}</td>
                  <td>
                    <div className='flex flex-wrap gap-1 items-center justify-start my-1'>
                      {person.roles.map((role, index) => (
                        <div
                          key={index}
                          className='px-2 bg-indigo-200 rounded-xl text-center'>
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
      <PaginationBar setPageNum={setPageNum} />
    </SidebarLayout>
  );
};

export default PeoplePage;
