import { Suspense } from "react";
import { CircularProgress } from "../../../components/circularProgress";
import { Divider } from "../../../components/divider";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { PaymentMethod } from "../../../components/stripe/paymentMethod";
import { PlanPayment } from "../../../components/stripe/plan";

const BillingSettings = () => {
  return (
    <BillingLayout>
      <Suspense
        fallback={
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        }
      >
        <section>
          <SectionHeading>Plan Details</SectionHeading>
          <PlanPayment />
        </section>
        <Divider/>
        <section className="flex py-3 gap-12">
          <SectionHeading>Card Details</SectionHeading>
          <PaymentMethod />
        </section>
      </Suspense>
    </BillingLayout>
  );
};

BillingSettings.getLayout = sidebar;
export default BillingSettings;
