import { sidebar } from "../../../components/layout/sidebar";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { FormProvider, useForm } from "react-hook-form";
import { MultiSelect } from "../../../components/form/multiSelect";
import { useContext, useRef, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { UserStatus } from "@prisma/client";
import { CircularProgress } from "../../../components/circularProgress";
import { AlertContext } from "../../../providers/alertProvider";
import { FirstNameInput } from "../../../components/form/firstNameInput";
import { LastNameInput } from "../../../components/form/lastNameInput";
import { EmailInput } from "../../../components/form/emailInput";
import { UserStatusInputSelector } from "../../../components/form/userStatusInputSelector";
import { PhoneInput } from "../../../components/form/phoneInput";
import {
  formatPhoneNumber,
  removeDashes,
} from "../../../utils/formatPhoneNumber";
import { UserFormValues } from "../../../../types/userFormValues";
import { BtnCancel } from "../../../components/btn/btnCancel";
import { EmailChangeModal } from "../../../components/modal/emailChangeConfirm";
import { BtnSave } from "../../../components/btn/btnSave";
import { UserContext } from "../../../providers/userProvider";
import { BtnPurple } from "../../../components/btn/btnPurple";

const EditUser: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const user = useContext(UserContext);
  const methods = useForm<UserFormValues>();
  const utils = trpc.useContext();
  const [emailEditModal, setEmailEditModal] = useState(false);
  const [formData, setFormData] = useState<UserFormValues | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const alertContext = useContext(AlertContext);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<any[]>([]);
    const roles = trpc.role.getRolesByOrganization.useQuery(undefined, {
        enabled: !!(user?.status == "ADMIN"),
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
  const userRoles: UserStatus[] = ["USER", "INACTIVE", "ADMIN"];
  const editUser = trpc.user.updateUserById.useMutation({
    onError(error, variables, context) {
      alertContext.setError({
        state: false,
        message: `Error saving user edits. Message: ${error.message}`,
      });
    },
  });
    const userQuery = trpc.user.getUserById.useQuery(id, {
        onSuccess(data) {
            if (data != null) {
                data.phoneNumber = formatPhoneNumber(data.phoneNumber ?? "");
                methods.reset(data);
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

  // Checks to see if email has changed since loading.
  // If so there is a confirmation that this does not change the login email
  const preSubmit = methods.handleSubmit((data) => {
    setFormData(data);
    if (data.email != userQuery.data?.email) {
      setEmailEditModal(true);
    } else {
      submit(data);
    }
  });

  const submit = (data: UserFormValues) => {
    data["roles"] = selectedRoles;

    editUser.mutate(
      {
        id: id,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email,
        phone: removeDashes(data.phoneNumber ?? ""),
        role: data.roles,
        status: data.status,
      },
      {
        onSuccess() {
          utils.user.getUsersByOrganization.invalidate();
          router.push("/people");
        },
      }
    );
  };

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
      {emailEditModal && (
        <EmailChangeModal
          open={emailEditModal}
          setOpen={setEmailEditModal}
          cancelOnClick={() => setEmailEditModal(false)}
          saveOnClick={() => {
            if (formData == null) return;
            submit(formData);
            setEmailEditModal(false);
          }}
        />
      )}
      <FormProvider {...methods}>
        <div className='mb-8'>
          <SectionHeading>Edit User</SectionHeading>
        </div>
        <form onSubmit={preSubmit} className='shadow'>
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
                disabled={user.status != "ADMIN"}
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
          <div className='flex justify-end gap-3 bg-gray-50 px-4 py-3 text-right sm:px-6'>
            <BtnCancel onClick={() => router.back()} />
            <BtnPurple isLoading={editUser.isLoading} type='submit'>
              Save
            </BtnPurple>
          </div>
        </form>
      </FormProvider>
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
