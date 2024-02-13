import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";

const BillingSettings = () => {
  return (
    <BillingLayout>
      <div>Hello Billing Settings</div>
    </BillingLayout>
  );
};

BillingSettings.getLayout = sidebar;
export default BillingSettings;
