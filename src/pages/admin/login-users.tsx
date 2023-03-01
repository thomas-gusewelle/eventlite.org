import { SectionHeading } from "../../components/headers/SectionHeading";
import { AdminLayout } from "../../components/layout/admin";
import { sidebar } from "../../components/layout/sidebar";
import { TableDropdown } from "../../components/menus/tableDropdown";
import { trpc } from "../../utils/trpc";

const LoginUsers = () => {
  const getUsers = trpc.useQuery(["admin.getLoginUsers"]);
  const resetPassword = trpc.useMutation("createAccount.generateResetPassword");

  return (
    <AdminLayout>
      <SectionHeading>Beta Requests</SectionHeading>
      <table className='mt-6 w-full table-auto text-left'>
        <thead>
          <tr>
            <th className='hidden md:table-cell'>ID</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {getUsers.data?.data.users.map((user) => (
            <tr className='border-t last:border-b' key={user.id}>
              <td className='hidden md:table-cell'>{user.id}</td>
              <td className='py-4'>{user.email}</td>

              <td>
                <TableDropdown
                  options={[
                    {
                      name: "Reset password",
                      function: () => {
                        if (user.email) {
                          resetPassword.mutate({ email: user.email });
                        }
                      },
                      show: user.email != undefined,
                    },
                    // {
                    //   name: "Delete",
                    //   function: () => {
                    //     deleteRef.current = req.id;
                    //     setDeleteConfirm(true);
                    //   },
                    // },
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
