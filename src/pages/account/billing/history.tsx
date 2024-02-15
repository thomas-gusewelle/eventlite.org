import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { api } from "../../../server/utils/api";
import { CircularProgress } from "../../../components/circularProgress";
import { MdDownload } from "react-icons/md";
import { shortDate } from "../../../components/dateTime/dates";
import Link from "next/link";

const BillingHistoryPage = () => {
  const invoicesQuery = api.stripe.getAllInvoices.useQuery({});

  if (invoicesQuery.isLoading) {
    return (
      <BillingLayout>
        <div className="flex items-center justify-center">
          <CircularProgress />
        </div>
      </BillingLayout>
    );
  }

  return (
    <BillingLayout>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {/*            {peopleList.map((person, index) => {
              const options: TableOptionsDropdown = [
                {
                  name: person.InviteLink ? "Resend Invite" : "Invite user",
                  function: () => createInvite.mutate({ userId: person.id }),
                  show: !person.hasLogin && user?.status == "ADMIN",
                },
                {
                  name: "View Profile",
                  href: `/people/view/${person.id}`,
                },
                {
                  name: "Reset Password",
                  function: () =>
                    sendResetPassword.mutate(
                      { email: person.email.trim() },
                      {
                        onSuccess() {
                          setSuccess({
                            state: true,
                            message: "Password Reset Email Sent",
                          });
                        },
                      }
                    ),
                  show: user?.status == "ADMIN" && person.hasLogin,
                },
                {
                  name: "Edit",
                  href: `/people/edit/${person.id}`,
                  show: user?.status == "ADMIN" || person.id == user?.id,
                },
                {
                  name: "Delete",
                  function: () => onDelete(person),
                  show: user?.status == "ADMIN",
                },
              ];
*/}

          {invoicesQuery.data?.data.map((person, index) => {
            console.log(person);
            const paidAt = person.status_transitions.paid_at;
            return (
              <tr key={index} className="border-t last:border-b">
                <td className="py-4">
                  {paidAt ? shortDate(new Date(paidAt * 1000)) : null}
                </td>
                <td>{person.status}</td>
                <td>
                  <span>${person.total}</span>
                </td>
                <td>
                  {person.invoice_pdf && (
                    <Link href={person.invoice_pdf} target={"_blank"}>
                      <MdDownload />
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </BillingLayout>
  );
};

BillingHistoryPage.getLayout = sidebar;
export default BillingHistoryPage;
