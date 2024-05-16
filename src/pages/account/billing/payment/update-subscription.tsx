import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { sidebar } from "../../../../components/layout/sidebar";

export const getServerSideProps = (context: GetServerSidePropsContext) =>  {
const {setup_intent, price_id} = context.params
  //get setupIntent

  //set customer default to payment method
  //make sure to also set customer.invoice_setting.default_payment_method
}

const UpdateSubscriptionPage = () => {

}

UpdateSubscriptionPage.getLayout = sidebar;
export default UpdateSubscriptionPage;

