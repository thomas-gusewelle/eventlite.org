import { BillingLayout } from "../../../components/layout/billing/layout"
import { sidebar } from "../../../components/layout/sidebar"

const BillingHistoryPage = () => {
  return <BillingLayout><div>Hello History</div></BillingLayout>
}

BillingHistoryPage.getLayout = sidebar
export default BillingHistoryPage
