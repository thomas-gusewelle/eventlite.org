import { Availability, User } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { PaginateData } from "../../types/paginate";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { BtnAdd } from "../components/btn/btnAdd";
import { BtnPurple } from "../components/btn/btnPurple";
import { CircularProgress } from "../components/circularProgress";
import { longDate } from "../components/dateTime/dates";
import { NewSingleSelect } from "../components/form/singleSelect";
import { SectionHeading } from "../components/headers/SectionHeading";
import { NoDataLayout } from "../components/layout/no-data-layout";
import { PaginationBar } from "../components/layout/pagination-bar";
import { sidebar } from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";
import { AvaililityModal } from "../components/modal/availibilityModal";
import { AlertContext } from "../providers/alertProvider";
import { UserContext } from "../providers/userProvider";
import { fullName } from "../utils/fullName";
import { paginate } from "../utils/paginate";
import { trpc } from "../utils/trpc";

const AvailabilityPage = () => {
  const alertContext = useContext(AlertContext);
  const [limit, setLimit] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [dates, setDates] = useState<Availability[]>([]);
  const [pagiantedData, setpagiantedData] =
    useState<PaginateData<Availability[]>>();
  const [pageNum, setPageNum] = useState(1);
  const user = useContext(UserContext);
  const [userSelected, setUserSelected] = useState<User>(user!);
  const [peopleList, setPeopleList] = useState<{ item: User; label: string }[]>(
    []
  );

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
      getUserAvailibilityQuery.refetch();
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an error deleting this date. Message: ${err.message}`,
      });
    },
  });

  const getUsersQuery = trpc.useQuery(["user.getUsersByOrganization"], {
    enabled: !!(user?.status == "ADMIN"),
    onSuccess(data) {
      setPeopleList(
        data?.map((user) => ({
          item: user,
          label: fullName(user.firstName, user.lastName) ?? "",
        })) ?? []
      );
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `There was an error fetching the users. Message: ${err.message}`,
      });
      getUsersQuery.refetch();
    },
  });

  const getUserAvailibilityQuery = trpc.useQuery(
    ["avalibility.getUserAvalibilityByID", userSelected.id],
    {
      onSuccess(data) {
        setDates(
          data?.sort((a, b) => a.date.getTime() - b.date.getTime()) ?? []
        );
      },
      onError(err) {
        alertContext.setError({
          state: true,
          message: `There was an error fetching the user availibility. Message: ${err.message}`,
        });
        getUserAvailibilityQuery.refetch();
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

  if (pagiantedData.data.length <= 0 && user?.status != "ADMIN") {
    return (
      <>
        <AvaililityModal
          userId={userSelected.id}
          open={modalOpen}
          setOpen={setModalOpen}
          exisitingDates={dates}
          setExisitingDates={setDates}
        />

        <NoDataLayout
          heading={"Unavailable Dates"}
          func={() => setModalOpen(true)}
          btnText={"Add Unavailable Dates"}
        />
      </>
    );
  }

  if (pagiantedData.data.length <= 0 && user?.status == "ADMIN") {
    return (
      <>
        <AvaililityModal
          userId={userSelected.id}
          open={modalOpen}
          setOpen={setModalOpen}
          exisitingDates={dates}
          setExisitingDates={setDates}
        />
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
                label={(item) => fullName(item.firstName, item.lastName)}
              />
            </div>
          )}
        </div>
        <div className='mb-8 hidden justify-between md:flex'>
          <SectionHeading>Unavailable Dates</SectionHeading>
          <div className='flex gap-4'>
            {user?.status == "ADMIN" && (
              <div className='min-w-[10rem]'>
                <NewSingleSelect
                  selected={userSelected}
                  setSelected={setUserSelected}
                  list={peopleList}
                  label={(item) => fullName(item.firstName, item.lastName)}
                />
              </div>
            )}
            <BtnAdd onClick={() => setModalOpen(true)} />
            {/* <LimitSelect selected={limit} setSelected={setLimit} /> */}
          </div>
        </div>
        <div className='flex justify-center'>
          <BtnPurple func={() => setModalOpen(true)}>
            Add Unavailable Dates
          </BtnPurple>
        </div>
      </>
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
              label={(item) => fullName(item.firstName, item.lastName)}
            />
          </div>
        )}
      </div>
      <div className='mb-8 hidden justify-between md:flex'>
        <SectionHeading>Unavailable Dates</SectionHeading>
        <div className='flex gap-4'>
          {user?.status == "ADMIN" && (
            <div className='min-w-[10rem]'>
              <NewSingleSelect
                selected={userSelected}
                setSelected={setUserSelected}
                list={peopleList}
                label={(item) => fullName(item.firstName, item.lastName)}
              />
            </div>
          )}
          <BtnAdd onClick={() => setModalOpen(true)} />
          {/* <LimitSelect selected={limit} setSelected={setLimit} /> */}
        </div>
      </div>

      <AvaililityModal
        userId={userSelected.id}
        open={modalOpen}
        setOpen={setModalOpen}
        exisitingDates={dates}
        setExisitingDates={setDates}
      />
      <>
        {getUserAvailibilityQuery.isLoading ? (
          <div className='flex justify-center'>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className='w-full'>
              <table className='w-full table-auto text-left'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagiantedData.data.map((date, index) => {
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
                          {longDate(date.date)}
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
        )}
      </>
    </>
  );
};

AvailabilityPage.getLayout = sidebar;

export default AvailabilityPage;
