import { sidebar } from "../../../components/layout/sidebar";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { useForm } from "react-hook-form";
import { MultiSelect } from "../../../components/form/multiSelect";
import { useContext, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { UserStatus } from "@prisma/client";
import { CircularProgress } from "../../../components/circularProgress";
import { AlertContext } from "../../../providers/alertProvider";

const EditUser: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const user = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isLoading, setIsLoading] = useState(true);
  const alertContext = useContext(AlertContext);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
  const roles = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      setRoleList(data as any);
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `Error fetching user roles. Message: ${err.message}`,
      });
      roles.refetch();
    },
  });
  const userRoles: UserStatus[] = ["USER", "MANAGER", "ADMIN"];
  const editUser = trpc.useMutation("user.updateUserByID", {
    onError(error, variables, context) {
      alertContext.setError({
        state: false,
        message: `Error saving user edits. Message: ${error.message}`,
      });
    },
  });
  const userQuery = trpc.useQuery(["user.getUserByID", id], {
    onSuccess(data) {
      if (data != null) {
        reset(data);
        setSelectedRoles(data?.roles);
        setIsLoading(false);
      }
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `Error fetching user. Message: ${err.message}`,
      });
      userQuery.refetch();
    },
    refetchOnWindowFocus: false,
  });

  const submit = handleSubmit((data) => {
    data["roles"] = selectedRoles;
    console.log(data);

    editUser.mutate({
      id: id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.roles,
      status: data.status,
    });
    router.push("/people");
  });

  if (!user) {
    router.push("/signin");
    return <div></div>;
  }

  if (isLoading) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className='mb-8'>
        <SectionHeading>Edit User</SectionHeading>
      </div>
      <form onSubmit={submit} className='shadow'>
        <div className='mb-6 grid grid-cols-6 gap-6 px-6'>
          <div className='col-span-6 sm:col-span-3'>
            <label
              htmlFor='first-name'
              className='block text-sm font-medium text-gray-700'>
              First name
            </label>
            <input
              type='text'
              id='firstName'
              {...register("firstName", { required: true, minLength: 3 })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            {errors.firstName && (
              <span className='text-red-500'>First Name is Required</span>
            )}
          </div>

          <div className='col-span-6 sm:col-span-3'>
            <label
              htmlFor='last-name'
              className='block text-sm font-medium text-gray-700'>
              Last name
            </label>
            <input
              type='text'
              {...register("lastName", { required: true })}
              id='last-name'
              autoComplete='family-name'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            {errors.lastName && (
              <span className='text-red-500'>Last Name is Required</span>
            )}
          </div>
          <div className='col-span-6 sm:col-span-4'>
            <label
              htmlFor='email-address'
              className='block text-sm font-medium text-gray-700'>
              Email address
            </label>
            <input
              type='text'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please enter a valid email",
                },
              })}
              id='email'
              autoComplete='email'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            {errors.email && (
              <span className='text-red-500'>
                {errors.email.message as any}
              </span>
            )}
          </div>
          <div className='col-span-6 sm:col-span-3'>
            <label className='block text-sm font-medium text-gray-700'>
              Positions
            </label>
            <MultiSelect
              selected={selectedRoles}
              setSelected={setSelectedRoles}
              list={roleList}
              setList={setRoleList}></MultiSelect>
          </div>
          <div className='hidden sm:col-span-3 sm:block'></div>
          <div className='sm:ropw col-span-6 sm:col-span-3'>
            <label
              htmlFor='country'
              className='block text-sm font-medium text-gray-700'>
              Role
            </label>
            <select
              id='role'
              {...register("status")}
              autoComplete='country-name'
              className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'>
              {userRoles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
        <div className='bg-gray-50 px-4 py-3 text-right sm:px-6'>
          <button
            type='submit'
            className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            Save
          </button>
        </div>
      </form>
    </>
  );
};

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") {
    return <div>No Id Provided</div>;
  }

  return <EditUser id={id} />;
};

EditUserPage.getLayout = sidebar;

export default EditUserPage;
