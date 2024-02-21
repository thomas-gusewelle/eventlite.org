import { SectionHeading } from "../../../components/headers/SectionHeading";
import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";

const BillingSettings = () => {
  return (
    <BillingLayout>
      <section>
        {/*TODO: get default payment info and display to user*/}
        <SectionHeading>Billing Information</SectionHeading>
      </section>
    </BillingLayout>
  );
};

BillingSettings.getLayout = sidebar;
export default BillingSettings;
