import { GetServerSidePropsContext } from "next";
import { sidebar } from "../../../components/layout/sidebar";

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  return {
    redirect: {
      destination: "/account/billing/history",
      permanent: false,
    },
  };
};

const BillingIndex = () => {
  return <></>;
};

BillingIndex.getLayout = sidebar;
export default BillingIndex;
