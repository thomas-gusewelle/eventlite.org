import { useContext, useEffect, useState } from "react";
import { sidebar } from "../components/layout/sidebar";
import { PicNameRow } from "../components/profile/PicNameRow";
import { trpc } from "../utils/trpc";
import { SectionHeading } from "../components/headers/SectionHeading";
import { CircularProgress } from "../components/circularProgress";
import { InviteLink, Role, User } from "@prisma/client";
import { TableDropdown } from "../components/menus/tableDropdown";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { PaginationBar } from "../components/layout/pagination-bar";
import { paginate } from "../utils/paginate";
import { PaginateData } from "../../types/paginate";
import { AlertContext } from "../providers/alertProvider";
import { NoDataLayout } from "../components/layout/no-data-layout";
import { useRouter } from "next/router";
import { UserContext } from "../providers/userProvider";
import { BtnAdd } from "../components/btn/btnAdd";

const PeoplePage = () => {
  const { setError, setSuccess } = useContext(AlertContext);
  const router = useRouter();
  const user = useContext(UserContext);
  const [peopleList, setPeopleList] =
    useState<(User & { roles: Role[]; InviteLink: InviteLink | null })[]>();
  const [peopleUnPageList, setPeopleUnPageList] =
    useState<(User & { roles: Role[]; InviteLink: InviteLink | null })[]>();
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, setPaginatedData] = useState<
    PaginateData<
      (User & {
        roles: Role[];
        InviteLink: InviteLink | null;
      })[]
    >
  >();
  const people = trpc.useQuery(["user.getUsersByOrganization"], {
    onSuccess: (data) => {
      if (data) {
        // sorts users by status with inactive at the end
        data = data.sort((a, b) => {
          if (
            (a.status == "ADMIN" || a.status == "USER") &&
            b.status == "INACTIVE"
          ) {
            return -1;
          } else if (
            (b.status == "ADMIN" || b.status == "USER") &&
            a.status == "INACTIVE"
          ) {
            return 1;
          } else {
            return 0;
          }
        });
        setPeopleUnPageList(data);
      }
    },
  });
  const adminCount = trpc.useQuery(["user.getAmdminCount"]);
  const createInvite = trpc.useMutation(
    "createAccount.createInviteLinkWithID",
    {
      onError(error, variables, context) {
        setError({
          state: true,
          message: `Error creating invite code. ${error.message}`,
        });
      },
    }
  );
  const sendResetPassword = trpc.useMutation(
    "createAccount.generateResetPassword",
    {
      onError(error, variables, context) {
        setError({
          state: true,
          message: `Error sending reset password link. Message: ${error.message}`,
        });
      },
    }
  );
  const deleteUser = trpc.useMutation("user.deleteUserByID", {
    onError: (error) => {
      setError({
        message: `Sorry. There was an issue deleting the user. Message: ${error}`,
        state: true,
      });
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
      setError({
        message: "Error. You must have at least one admin account.",
        state: true,
      });
      return;
    }
    deleteUser.mutate({ id: person.id, hasLogin: person.hasLogin });
  };

  const filter = (e: string) => {
    if (e.length > 0) {
      const key = e.toLowerCase();
      const filter = people.data?.filter((person) => {
        return (
          person.firstName?.toLowerCase().includes(key) ||
          person.lastName?.toLowerCase().includes(key) ||
          person.email?.toLowerCase().includes(key) ||
          person.roles.some((role) => role.name.toLowerCase().includes(key))
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
          {user?.status == "ADMIN" && (
            <BtnAdd onClick={() => router.push("/people/adduser")} />
          )}
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

          {user?.status === "ADMIN" && (
            <BtnAdd onClick={() => router.push("/people/adduser")} />
          )}
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
                  name: person.InviteLink ? "Resend Invite" : "Invite user",
                  function: () => createInvite.mutate({ userId: person.id }),
                  show: !person.hasLogin && user?.status == "ADMIN",
                },
                {
                  name: "View Profile",
                  href: `/people/view/${person.id}`,
                },
                {
                  name: "Reset Password",
                  function: () =>
                    sendResetPassword.mutate(
                      { email: person.email.trim() },
                      {
                        onSuccess() {
                          setSuccess({
                            state: true,
                            message: "Password Reset Email Sent",
                          });
                        },
                      }
                    ),
                  show: user?.status == "ADMIN" && person.hasLogin,
                },
                {
                  name: "Edit",
                  href: `/people/edit/${person.id}`,
                  show: user?.status == "ADMIN" || person.id == user?.id,
                },
                {
                  name: "Delete",
                  function: () => onDelete(person),
                  show: user?.status == "ADMIN",
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
