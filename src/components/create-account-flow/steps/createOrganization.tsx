import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { CardHeader } from "../components/cardHeader";

export const CreateOrganization = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <CardHeader>Create Organization</CardHeader>
      <section>
        <div className='mt-3'>
          <label className='form-label'>Organization Name</label>
        </div>
        <input type='text' className='input-field' {...register("orgName")} />
      </section>
    </>
  );
};
