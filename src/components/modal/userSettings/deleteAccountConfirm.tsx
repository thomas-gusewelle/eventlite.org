import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnRed } from "../../btn/btnRed";
import { BottomButtons } from "../bottomButtons";
import { Modal } from "../modal";
import { ModalBody } from "../modalBody";
import { ModalTitle } from "../modalTitle";

export const DeleteAccountConfirm = ({ open, setOpen, submit, isLoading }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, submit: () => void, isLoading: boolean }) => {
  const methods = useForm<{ deleteAccount: string }>()
  const preSubmit = methods.handleSubmit((data) => {
    console.log(data.deleteAccount)
    if (data.deleteAccount != "DELETE-ACCOUNT") {
      methods.setError("deleteAccount", { message: "Text must match DELETE-ACCOUNT." })
      return
    }
    submit()
  })
  return (

    <Modal open={open} setOpen={setOpen}>
      <ModalBody>
        <ModalTitle text={"Are you sure?"} />
        <div className='py-3'>
          <p>To delete your account please copy type the text <strong>DELETE-ACCOUNT</strong> in to the box. Note that this is permanent and your account cannot be restored.</p>
          <form>
            <label className="form-label">DELETE-ACCOUNT</label>
            <input {...methods.register("deleteAccount",)} type={"text"} className="input-field"></input>
            {methods.formState.errors.deleteAccount && (
              <span className='text-red-500'>{methods.formState.errors.deleteAccount.message}</span>
            )}
          </form>
        </div>
      </ModalBody>
      <BottomButtons>
        <BtnRed onClick={preSubmit} isLoading={isLoading}>Delete</BtnRed>
        <BtnNeutral func={() => {
          setOpen(false)
        }}>Cancel</BtnNeutral>
      </BottomButtons>
    </Modal>
  )
}
