import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";
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
  const utils = trpc.useContext();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<{ name: string }>();

  const addPosition = trpc.useMutation("role.addRole");

  const submit = handleSubmit((data) => {
    addPosition.mutate(data.name, {
      onSuccess() {
        utils.refetchQueries(["role.getRolesByOrganization"], { active: true });
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
            <ModalTitle text={"Add Position"} />
            <div className='mt-3'>
              <label
                htmlFor='name'
                className='block text-left text-sm font-medium text-gray-700'>
                Position Name
              </label>
              <input
                type='text'
                id='name'
                {...register("name", { required: true, minLength: 3 })}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
              {errors.name && (
                <span className='text-red-500'>Position name is required</span>
              )}
            </div>
          </ModalBody>
          <BottomButtons>
            <BtnPurple isLoading={addPosition.isLoading} func={() => submit()}>
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
