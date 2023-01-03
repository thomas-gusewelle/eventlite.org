import { Dispatch, SetStateAction } from "react";
import { CardHeader } from "../components/cardHeader";

export const CreateOrganization = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <>
      <CardHeader>Create Organization</CardHeader>
    </>
  );
};
