import { sidebar } from "../../components/layout/sidebar";
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
import { UserFormValues } from "../../../types/userFormValues";
import { BtnPurpleDropdown } from "../../components/btn/btnPurpleDropdown";
const AddUser = ({ redirect }: { redirect: string | undefined }) => {
  const router = useRouter();
  const { setError } = useContext(AlertContext);
  // used to track if user is adding or deleting characters from phone #
  const invite = useRef(false);
  const methods = useForm<UserFormValues>();

  const [roleList, setRoleList] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const roles = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      if (data) {
        setRoleList(data);
      }
    },
    onError(err) {
      setError({
        state: true,
        message: `Error fetching user roles: Message: ${err.message}`,
      });
      roles.refetch();
    },
  });
  const userRoles: UserStatus[] = ["USER", "INACTIVE", "ADMIN"];
  const addUser = trpc.useMutation(["user.addUser"], {
    onError(error, variables, context) {
      setError({
        state: true,
        message: `Error adding user. Please try again.`,
      });
    },
  });
  const inviteUser = trpc.useMutation("createAccount.createInviteLinkWithID", {
    onError(error, variables, context) {
      setError({
        state: true,
        message: `Failed to create invite code. Message: ${error.message}`,
      });
    },
  });

  const submit = methods.handleSubmit((data) => {
    data["roles"] = selectedRoles;

    addUser.mutate(
      {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email,
        phone: removeDashes(data.phoneNumber ?? ""),
        role: data.roles,
        status: data.status,
      },
      {
        onSuccess(data, variables, context) {
          // if user clicked creae and invite then send the invite link
          if (invite.current == true && data) {
            inviteUser.mutate(
              { userId: data.id },
              {
                onSuccess: () =>
                  redirect ? router.push(redirect) : router.push("/people"),
              }
            );
          } else {
            redirect ? router.push(redirect) : router.push("/people");
          }
        },
      }
    );
  });

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
          <div className='flex justify-end bg-gray-50 px-4 py-3 text-right sm:px-6'>
            <BtnPurpleDropdown
              btnFunction={() => {
                console.log("146");
                invite.current = true;
                submit();
              }}
              options={[
                {
                  name: "Create",
                  function: () => {
                    invite.current = false;
                    submit();
                  },
                },
                {
                  name: "Create and Invite",
                  function: () => {
                    invite.current = true;
                    submit();
                  },
                },
              ]}>
              Create and Invite
            </BtnPurpleDropdown>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

const AddUserPage = () => {
  const router = useRouter();
  const { redirect } = router.query;

  if (Array.isArray(redirect)) {
    return <div>Error with redirect link</div>;
  }

  return <AddUser redirect={redirect} />;
};

AddUserPage.getLayout = sidebar;

export default AddUserPage;
