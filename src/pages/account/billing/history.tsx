import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { api } from "../../../server/utils/api";
import { CircularProgress } from "../../../components/circularProgress";
import { MdDownload } from "react-icons/md";
import { shortDate } from "../../../components/dateTime/dates";
import Link from "next/link";

const BillingHistory = () => {
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
          {invoicesQuery.data?.data.map((person, index) => {
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

      <div className="mx-6 flex justify-between">
        <button
          onClick={() => {}}
          className="inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
        >
          Prev Page
        </button>

        <button
          onClick={() => {}}
          className="ml-auto inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
        >
          Next Page
        </button>
      </div>
    </BillingLayout>
  );
};


const BillingHistoryPage = () => {
  return <BillingHistory/>
}

BillingHistoryPage.getLayout = sidebar;
export default BillingHistoryPage;
