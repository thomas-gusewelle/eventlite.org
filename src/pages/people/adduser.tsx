import { sidebar } from "../../components/layout/sidebar";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { FormProvider, useForm } from "react-hook-form";
import { MultiSelect } from "../../components/form/multiSelect";
import { useContext, useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import { Role, UserStatus } from "@prisma/client";
import { CircularProgress } from "../../components/circularProgress";
import { AlertContext } from "../../providers/alertProvider";
import { PhoneInput } from "../../components/form/phoneInput";
import { FirstNameInput } from "../../components/form/firstNameInput";
import { LastNameInput } from "../../components/form/lastNameInput";
import { EmailInput } from "../../components/form/emailInput";
import { UserStatusInputSelector } from "../../components/form/userStatusInputSelector";
import { removeDashes } from "../../utils/formatPhoneNumber";
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
  const methods = useForm();

  const [roleList, setRoleList] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const roles = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      console.log(data);
      if (data) {
        setRoleList(data);
      }
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

  const submit = methods.handleSubmit((data) => {
    data["roles"] = selectedRoles;
    console.log(data);

    // return;
    addUser.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: removeDashes(data.phone),
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
      <FormProvider {...methods}>
        <div className='mb-8'>
          <SectionHeading>Add User</SectionHeading>
        </div>
        <form onSubmit={submit} className='shadow'>
          <div className='mb-6 grid grid-cols-6 gap-6 px-6'>
            <div className='col-span-6 sm:col-span-3'>
              <FirstNameInput />
            </div>

            <div className='col-span-6 sm:col-span-3'>
              <LastNameInput />
            </div>
            <div className='col-span-6 sm:col-span-4'>
              <EmailInput />
            </div>
            <div className='col-span-6 sm:col-span-4'>
              <PhoneInput />
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
              <UserStatusInputSelector userRoles={userRoles} />
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
      </FormProvider>
    </>
  );
};

AddUser.getLayout = sidebar;

export default AddUser;
