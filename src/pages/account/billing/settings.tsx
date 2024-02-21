import { Suspense } from "react";
import { CircularProgress } from "../../../components/circularProgress";
import { SectionHeading } from "../../../components/headers/SectionHeading";
import { BillingLayout } from "../../../components/layout/billing/layout";
import { sidebar } from "../../../components/layout/sidebar";
import { PaymentMethod } from "../../../components/stripe/paymentMethod";
import { api } from "../../../server/utils/api";

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
            {/*TODO: get default payment info and display to user*/}
            <SectionHeading>Billing Information</SectionHeading>
            <PaymentMethod/>
          </>
        </section>
      </Suspense>
    </BillingLayout>
  );
};

BillingSettings.getLayout = sidebar;
export default BillingSettings;
