import { sidebar } from "../../../components/layout/sidebar";
import { useRouter } from "next/router";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { FormProvider, useForm } from "react-hook-form";
import {
  MultiSelect,
  NewMultiSelect,
} from "../../../components/form/multiSelect";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../server/utils/api";
import { Role, UserStatus } from "@prisma/client";
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
import { UserContext } from "../../../providers/userProvider";
import { BtnPurple } from "../../../components/btn/btnPurple";

const EditUser: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const user = useContext(UserContext);
  const methods = useForm<UserFormValues>();
  const utils = api.useContext();
  const [emailEditModal, setEmailEditModal] = useState(false);
  const [formData, setFormData] = useState<UserFormValues | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const alertContext = useContext(AlertContext);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const roles = api.role.getRolesByOrganization.useQuery(undefined);
  useEffect(() => {
    if (roles.isSuccess) {
      setRoleList(roles.data ?? []);
    } else if (roles.isError) {
      alertContext.setError({
        state: true,
        message: `Error fetching user roles. Message: ${roles.error.message}`,
      });
      roles.refetch();
    }
  });
  const userRoles: UserStatus[] = ["USER", "INACTIVE", "ADMIN"];
  const editUser = api.user.updateUserByID.useMutation({
    onError(error, variables, context) {
      alertContext.setError({
        state: false,
        message: `Error saving user edits. Message: ${error.message}`,
      });
    },
  });
  const userQuery = api.user.getUserByID.useQuery(id);

  useEffect(() => {
    if (userQuery.isSuccess && isLoading) {
      if (userQuery.data != null) {
        userQuery.data.phoneNumber = formatPhoneNumber(
          userQuery.data.phoneNumber ?? ""
        );
        methods.reset(userQuery.data);
        setSelectedRoles(userQuery.data?.roles);
        setIsLoading(false);
      }
    } else if (userQuery.isError) {
      alertContext.setError({
        state: true,
        message: `Error fetching user. Message: ${userQuery.error.message}`,
      });
      userQuery.refetch();
    }
  }, [alertContext, methods, userQuery]);

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
      <div className="flex justify-center">
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
        <div className="mb-8">
          <SectionHeading>Edit User</SectionHeading>
        </div>
        <form onSubmit={preSubmit} className="shadow">
          <div className="mb-6 grid grid-cols-6 gap-6 px-6">
            <div className="col-span-6 sm:col-span-3">
              <FirstNameInput />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <LastNameInput />
            </div>
            <div className="col-span-6 sm:col-span-4">
              <EmailInput />
            </div>
            <div className="col-span-6 sm:col-span-4">
              <PhoneInput />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Positions
              </label>
              <NewMultiSelect
                selected={selectedRoles}
                setSelected={setSelectedRoles}
                list={roleList.map((item) => ({ item: item, hide: false }))}
                label={(item) => item.name}
              />
            </div>
            <div className="hidden sm:col-span-3 sm:block"></div>
            <div className="sm:ropw col-span-6 sm:col-span-3">
              <UserStatusInputSelector userRoles={userRoles} />
            </div>
          </div>
          <div className="flex justify-end gap-3 bg-gray-50 px-4 py-3 text-right sm:px-6">
            <BtnCancel onClick={() => router.back()} />
            <BtnPurple isLoading={editUser.isPending} type="submit">
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
