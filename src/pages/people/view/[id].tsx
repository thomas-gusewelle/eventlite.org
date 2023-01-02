import { useRouter } from "next/router";
import { useContext } from "react";
import { CircularProgress } from "../../../components/circularProgress";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { sidebar } from "../../../components/layout/sidebar";
import { UserContext } from "../../../providers/userProvider";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { trpc } from "../../../utils/trpc";

const ViewProfile = ({ id }: { id: string }) => {
  const user = useContext(UserContext);
  const router = useRouter();
  const userQuery = trpc.useQuery(["user.getUserByID", id]);

  if (userQuery.isLoading) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <div className='mb-8'>
        <SectionHeading>View Profile</SectionHeading>
      </div>
      <section className=' shadow'>
        <div className='mb-6 grid grid-cols-6 gap-6 px-6 py-3'>
          <div className='col-span-6 sm:col-span-3'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              First name
            </label>
            <span>{userQuery.data?.firstName}</span>
          </div>
          <div className='col-span-6 sm:col-span-3'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Last name
            </label>
            <span className='mt-1'>{userQuery.data?.lastName}</span>
          </div>
          <div className='col-span-6 sm:col-span-4'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Email
            </label>
            <span className='mt-1'>{userQuery.data?.email}</span>
          </div>
          {userQuery.data?.phoneNumber && (
            <div className='col-span-6 sm:col-span-4'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Phone
              </label>
              <span className='mt-1'>
                {formatPhoneNumber(userQuery.data?.phoneNumber ?? "")}
              </span>
            </div>
          )}
          <div className='col-span-6 sm:col-span-4'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Role(s)
            </label>
            <div className='flex flex-wrap gap-2'>
              {userQuery.data?.roles.map((role) => (
                <div
                  key={role.id}
                  className='flex items-center gap-2 rounded bg-indigo-100 py-1 px-2'>
                  {role.name}
                </div>
              ))}
            </div>
          </div>
          <div className='col-span-6 sm:col-span-4'>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Status
            </label>
            <span className='mt-1'>{userQuery.data?.status}</span>
          </div>
        </div>
        {(user?.status == "ADMIN" ||
          user?.status == "MANAGER" ||
          user?.id == id) && (
          <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
            <button
              type='button'
              onClick={() => router.push(`/people/edit/${id}`)}
              className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              Edit
            </button>
          </div>
        )}
      </section>
    </>
  );
};

const ViewProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") {
    return <div>No Id Provided</div>;
  }

  return <ViewProfile id={id} />;
};

ViewProfilePage.getLayout = sidebar;

export default ViewProfilePage;
