import { sidebar } from "../../components/layout/sidebar";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { useForm } from "react-hook-form";
import { MultiSelect } from "../../components/form/multiSelect";
import { useContext, useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { Role, UserStatus } from "@prisma/client";
import { CircularProgress } from "../../components/circularProgress";
import { AlertContext } from "../../providers/alertProvider";
const AddUser = () => {
  const router = useRouter();
  const alertContext = useContext(AlertContext);
  const user = useUser();
  // used to track if user is adding or deleting characters from phone #
  const phoneLength = useRef<number>(0);
  const [phoneFieldDirection, setPhoneFieldDirection] = useState<{
    length: number;
    direction: "ADD" | "SUBTRACT";
  }>({ length: 0, direction: "ADD" });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [roleList, setRoleList] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const roles = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      setRoleList(data as any);
    },
    onError(err) {
      alertContext.setError({
        state: true,
        message: `Error fetching user roles: Message: ${err.message}`,
      });
      roles.refetch();
    },
  });
  const userRoles: UserStatus[] = ["USER", "MANAGER", "ADMIN"];
  const addUser = trpc.useMutation(["user.addUser"], {
    onSuccess: () => router.push("/people"),
    onError(error, variables, context) {
      alertContext.setError({
        state: true,
        message: `Error adding user. Please try again.`,
      });
    },
  });

  const submit = handleSubmit((data) => {
    data["roles"] = selectedRoles;
    console.log(data);
    return;
    addUser.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.roles,
      status: data.status,
    });
  });

  if (!user) {
    router.push("/signin");
    return <div></div>;
  }

  if (roles.isLoading) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className='mb-8'>
        <SectionHeading>Add User</SectionHeading>
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
          <div className='col-span-6 sm:col-span-4'>
            <label
              htmlFor='email-address'
              className='block text-sm font-medium text-gray-700'>
              Phone
            </label>
            <input
              type='tel'
              {...register("phone", {
                validate: {
                  length: (value: string) => {
                    return value.replace("-", "").length == 10;
                  },
                },
                onChange: (e) => {
                  const eLength = e.target.value.length;
                  if (eLength == 12) return;
                  let add = true;
                  if (eLength > phoneLength.current) {
                    add = true;
                    phoneLength.current = eLength;
                  } else {
                    add = false;
                    phoneLength.current = eLength;
                  }

                  if (add) {
                    if (
                      e.target.value.length == 3 ||
                      e.target.value.length == 7
                    ) {
                      e.target.value = e.target.value.concat("-");
                    }
                  }
                },
              })}
              maxLength={12}
              id='phone'
              autoComplete='phone'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            {errors.phone && (
              <span className='text-red-500'>
                Please enter a valid phone number with no hyphens.
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

AddUser.getLayout = sidebar;

export default AddUser;
