import { Availability, User } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

import { PaginateData } from "../../types/paginate";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { BtnAdd } from "../components/btn/btnAdd";
import { CircularProgress } from "../components/circularProgress";
import { LimitSelect } from "../components/form/limitSelect";
import { NewSingleSelect, SingleSelect } from "../components/form/singleSelect";
import { SectionHeading } from "../components/headers/SectionHeading";
import { PaginationBar } from "../components/layout/pagination-bar";
import { sidebar } from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";

import { AvaililityModal } from "../components/modal/availibilityModal";
import { UserContext } from "../providers/userProvider";
import { fullName } from "../utils/fullName";
import { paginate } from "../utils/paginate";
import { trpc } from "../utils/trpc";

const AvailabilityPage = () => {
  const [limit, setLimit] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [dates, setDates] = useState<Availability[]>([]);
  const [pagiantedData, setpagiantedData] =
    useState<PaginateData<Availability[]>>();
  const [pageNum, setPageNum] = useState(1);
  const user = useContext(UserContext);
  const [userSelected, setUserSelected] = useState<{
    item: User;
    label: string;
  }>({ item: user!, label: fullName(user?.firstName, user?.lastName) ?? "" });
  const [peopleList, setPeopleList] = useState<{ item: User; label: string }[]>(
    []
  );

  // const getDatesQuery = trpc.useQuery(["avalibility.getUserAvalibility"], {
  //   onSuccess(data) {
  //     setDates(data ?? []);
  //   },
  // });

  useEffect(() => {
    if (dates != undefined) {
      const _paginated = paginate(dates, pageNum);
      setpagiantedData(_paginated);
      // setlocationPaginated(_paginated.data);
    }
  }, [dates, pageNum]);

  const deleteDateMutation = trpc.useMutation("avalibility.deleteDate", {
    onSuccess(data) {
      setDates(dates.filter((item) => item.id != data?.id));
      // getDatesQuery.refetch();
    },
  });

  const getUsersQuery = trpc.useQuery(["user.getUsersByOrganization"], {
    enabled: !!(user?.status == "ADMIN"),
    onSuccess(data) {
      console.log("this is the data, ", data);
      setPeopleList(
        data?.map((user) => ({
          item: user,
          label: fullName(user.firstName, user.lastName) ?? "",
        })) ?? []
      );
    },
  });

  const getUserAvailibilityQuery = trpc.useQuery(
    ["avalibility.getUserAvalibilityByID", userSelected.item.id],
    {
      onSuccess(data) {
        setDates(data ?? []);
      },
    }
  );

  if (
    pagiantedData == undefined ||
    getUsersQuery.isLoading ||
    getUserAvailibilityQuery.isLoading
  ) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <div className='mb-8 grid grid-cols-2 gap-4 md:hidden'>
        <SectionHeading>Unavaliable Dates</SectionHeading>
        <div className='flex justify-end'>
          <BtnAdd onClick={() => setModalOpen(true)} />
          {/* <LimitSelect selected={limit} setSelected={setLimit} /> */}
        </div>
        {user?.status == "ADMIN" && (
          <div className='col-span-2'>
            <NewSingleSelect
              selected={userSelected}
              setSelected={setUserSelected}
              list={peopleList}
            />
          </div>
        )}
      </div>
      <div className='mb-8 hidden justify-between md:flex'>
        <SectionHeading>Unavailable Dates</SectionHeading>
        <div>
          <BtnAdd onClick={() => setModalOpen(true)} />
          <LimitSelect selected={limit} setSelected={setLimit} />
        </div>
      </div>

      <AvaililityModal
        open={modalOpen}
        setOpen={setModalOpen}
        exisitingDates={dates}
        setExisitingDates={setDates}
      />
      <div className='w-full'>
        <table className='w-full table-auto text-left'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dates?.map((date, index) => {
              const options: TableOptionsDropdown = [
                {
                  name: "Delete",
                  function: () => {
                    deleteDateMutation.mutate(date.id);
                  },
                },
              ];

              return (
                <tr key={index} className='border-t last:border-b'>
                  <td className='py-4 text-base leading-4 text-gray-800 md:text-xl'>
                    {Intl.DateTimeFormat("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(date.date)}
                  </td>
                  <td className=''>
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
  );
};

AvailabilityPage.getLayout = sidebar;

export default AvailabilityPage;
