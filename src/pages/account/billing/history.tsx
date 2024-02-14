import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { api } from "../../../server/utils/api";
import { CircularProgress } from "../../../components/circularProgress";

const BillingHistoryPage = () => {

  const invoicesQuery = api.stripe.getAllInvoices.useQuery({});

  if (invoicesQuery.isLoading) {
  return <BillingLayout>
      <div className="flex items-center justify-center"><CircularProgress/></div>
    </BillingLayout>
  }

  return (
    <BillingLayout>
      {invoicesQuery?.data?.data?.map(d => 
      <div>{d.id}</div>)}
    </BillingLayout>
  );
};

BillingHistoryPage.getLayout = sidebar;
export default BillingHistoryPage;
