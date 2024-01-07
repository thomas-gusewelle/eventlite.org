import { GetServerSidePropsContext } from "next";
import { useContext } from "react";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { AdminLayout } from "../../components/layout/admin";
import { sidebar } from "../../components/layout/sidebar";
import { TableDropdown } from "../../components/menus/tableDropdown";
import { AlertContext } from "../../providers/alertProvider";
import { api } from "../../server/utils/api";
import { createClient } from "../../utils/supabase/server";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);
  const user = await supabase.auth.getUser();
  if (user.data.user?.email != "tgusewelle@eventlite.org") {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }
  return {
    props: {},
  };
}

const LoginUsers = () => {
  const { setError } = useContext(AlertContext);
  const getUsers = api.admin.getLoginUsers.useQuery();
  const resetPassword = api.createAccount.generateResetPassword.useMutation();
  const resendVerification = api.createAccount.resendConfirm.useMutation();
  const deleteLogin = api.admin.deleteLoginUser.useMutation();

  return (
    <AdminLayout>
      <SectionHeading>Login Users</SectionHeading>
      <table className="mt-6 w-full table-auto text-left">
        <thead>
          <tr>
            <th className="hidden md:table-cell">ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {getUsers.data?.data.users.map((user) => (
            <tr className="border-t last:border-b" key={user.id}>
              <td className="hidden md:table-cell">{user.id}</td>
              <td className="py-4">{user.email}</td>

              <td>
                <TableDropdown
                  options={[
                    {
                      name: "Reset password",
                      function: () => {
                        if (user.email) {
                          resetPassword.mutate(
                            { email: user.email },
                            {
                              onError: (err) =>
                                setError({ state: true, message: err.message }),
                            }
                          );
                        }
                      },
                      show: user.email != undefined,
                    },
                    {
                      name: "Resend Verification",
                      function: () => {
                        if (user.email) {
                          resendVerification.mutate(
                            { email: user.email },
                            {
                              onError: (err) =>
                                setError({ state: true, message: err.message }),
                            }
                          );
                        }
                      },
                      show: user.confirmed_at == undefined,
                    },
                    {
                      name: "Delete Login",
                      function: () =>
                        deleteLogin.mutate(
                          { id: user.id },
                          {
                            onError: (err) =>
                              setError({ state: true, message: err.message }),
                            onSuccess: () => getUsers.refetch(),
                          }
                        ),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
          <td></td>
        </tbody>
      </table>
    </AdminLayout>
  );
};

LoginUsers.getLayout = sidebar;
export default LoginUsers;
