import { Suspense } from "react";
import { BtnPurple } from "../../../components/btn/btnPurple";
import { CircularProgress } from "../../../components/circularProgress";
import { Divider } from "../../../components/divider";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { SectionSubHeading } from "../../../components/headers/SectionSubHeading";
import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { PaymentMethod } from "../../../components/stripe/paymentMethod";
import { PlanPayment as PlanPaymentSection } from "../../../components/stripe/plan";

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
        <PlanPaymentSection />
        <Divider />
        <section className="flex gap-12 py-3">
          <SectionHeading>Card Details</SectionHeading>
          <PaymentMethod />
        </section>
        <Divider />
        <section className="flex gap-12 py-3">
          <div>
            <SectionHeading>Contact Details</SectionHeading>
            <SectionSubHeading>
              Where should invoices be sent?
            </SectionSubHeading>
          </div>
        </section>
      </Suspense>
    </BillingLayout>
  );
};

BillingSettings.getLayout = sidebar;
export default BillingSettings;
