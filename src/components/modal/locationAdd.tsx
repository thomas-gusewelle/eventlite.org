import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { BtnCancel } from "../btn/btnCancel";
import { BtnSave } from "../btn/btnSave";
import { BottomButtons } from "./bottomButtons";
import { Modal } from "./modal";
import { ModalBody } from "./modalBody";
import { ModalTitle } from "./modalTitle";

export const LocationAddModel = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = handleSubmit((data) => {
    console.log(data);
  });
  return (
    <Modal open={open} setOpen={setOpen}>
      <>
        <form onSubmit={submit}>
          <ModalBody>
            <ModalTitle text={"Add Location"} />
            <div className='mt-2'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'>
                Location Name
              </label>
              <input
                type='text'
                id='name'
                {...register("name", { required: true, minLength: 3 })}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
              {errors.name && (
                <span className='text-red-500'>Location Name is Required</span>
              )}
            </div>
          </ModalBody>
          <BottomButtons>
            <BtnSave type={"submit"} />
            <BtnCancel
              onClick={() => {
                setOpen(false);
              }}
            />
          </BottomButtons>
        </form>
      </>
    </Modal>
  );
};
