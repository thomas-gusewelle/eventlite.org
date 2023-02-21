import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { BtnCancel } from "../btn/btnCancel";
import { BtnPurple } from "../btn/btnPurple";
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
  const utils = trpc.useContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const addLocation = trpc.useMutation("locations.createLocation");

  const submit = handleSubmit((data) => {
    addLocation.mutate(data.name, {
      onSuccess() {
        utils.refetchQueries(["locations.getLocationsByOrg"], { active: true });
        setOpen(false);
      },
    });
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
            <BtnPurple type='submit' isLoading={addLocation.isLoading}>
              Save
            </BtnPurple>
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
