import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { api } from "../../../server/utils/api";
import { CircularProgress } from "../../../components/circularProgress";
import { MdDownload } from "react-icons/md";
import { shortDate } from "../../../components/dateTime/dates";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatStripeDollar } from "../../../utils/formatDollar";

// TODO: Test the forward and backwards pagination
const BillingHistory = ({
  cursor,
  limit,
  forward,
}: {
  cursor: string | undefined;
  limit: number | undefined;
  forward: boolean;
}) => {
  const invoicesQuery = api.stripe.getInvoices.useQuery({
    cursor,
    limit,
    forward,
  });
  const router = useRouter();

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
                  <span>{formatStripeDollar(person.total/100)}</span>
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
      <div className=" flex justify-between">
        {cursor != undefined && (
          <button
            onClick={() => {
              router.push(
                `/account/billing/history?cursor=${cursor}&forward="false"`
              );
            }}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            Prev Page
          </button>
        )}
        {invoicesQuery.data?.has_more && (
          <button
            onClick={() => {
              router.push(
                `/account/billing/history?cursor=${cursor}&forward="true"`
              );
            }}
            className="ml-auto inline-flex items-center rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            Next Page
          </button>
        )}
      </div>
    </BillingLayout>
  );
};

const BillingHistoryPage = () => {
  const router = useRouter();
  const { cursor, limit, forward } = router.query;
  if (
    typeof cursor != "string" ||
    Array.isArray(limit) ||
    Array.isArray(forward)
  ) {
    return <></>;
  }

  // False if undefined or not "true"
  const forwardBool =
    forward == undefined
      ? false
      : forward.toLowerCase() === "true"
      ? true
      : false;

  return (
    // Cursor must be undefined or a string becasue of the Stripe api.
    // You can not pass an empty string to the API
    // for starting_after or ending_before
    <BillingHistory
      cursor={cursor == "" ? undefined : cursor}
      limit={limit ? parseInt(limit) : undefined}
      forward={forwardBool}
    />
  );
};

BillingHistoryPage.getLayout = sidebar;
export default BillingHistoryPage;
