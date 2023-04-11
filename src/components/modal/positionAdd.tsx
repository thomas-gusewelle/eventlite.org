import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../server/utils/api"
import { BtnCancel } from "../btn/btnCancel";
import { BtnPurple } from "../btn/btnPurple";
import { BottomButtons } from "./bottomButtons";
import { Modal } from "./modal";
import { ModalBody } from "./modalBody";
import { ModalTitle } from "./modalTitle";

export const PositionAddModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const utils = api.useContext();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<{ name: string }>();

  const addPosition = api.role.addRole.useMutation();

  const submit = handleSubmit((data) => {
    addPosition.mutate(data.name, {
      onSuccess() {
        utils.role.getRolesByOrganization.refetch(undefined, { type: "active" });
        setOpen(false);
      },
    });
  });

  useEffect(() => {
    if (open) {
      setFocus("name", { shouldSelect: true });
    }
  }, [open, setFocus]);
  return (
    <Modal open={open} setOpen={setOpen}>
      <>
        <form onSubmit={submit}>
          <ModalBody>
            <ModalTitle text={"Add Role"} />
            <div className='mt-3'>
              <label
                htmlFor='name'
                className='block text-left text-sm font-medium text-gray-700'>
                Role Name
              </label>
              <input
                type='text'
                id='name'
                {...register("name", { required: true, minLength: 3 })}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
              {errors.name && (
                <span className='text-red-500'>Role name is required</span>
              )}
            </div>
          </ModalBody>
          <BottomButtons>
            <BtnPurple isLoading={addPosition.isLoading} onClick={() => submit()}>
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
