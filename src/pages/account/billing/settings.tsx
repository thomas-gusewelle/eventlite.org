import { Suspense } from "react";
import { CircularProgress } from "../../../components/circularProgress";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { PaymentMethod } from "../../../components/stripe/paymentMethod";
import { PlanPayment } from "../../../components/stripe/plan";

const BillingSettings =  () => {

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
          <>
            <SectionHeading>Billing Information</SectionHeading>
            <PaymentMethod/>
            <PlanPayment/>
          </>
        </section>
      </Suspense>
    </BillingLayout>
  );
};

BillingSettings.getLayout = sidebar;
export default BillingSettings;
