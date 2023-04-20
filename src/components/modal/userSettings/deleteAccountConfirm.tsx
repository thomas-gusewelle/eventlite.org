import { Dispatch, SetStateAction } from "react";
import { BtnNeutral } from "../../btn/btnNeutral";
import { BtnRed } from "../../btn/btnRed";
import { BottomButtons } from "../bottomButtons";
import { Modal } from "../modal";
import { ModalBody } from "../modalBody";
import { ModalTitle } from "../modalTitle";

export const DeleteAccountConfirm = ({ open, setOpen, submit, isLoading }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, submit: () => void, isLoading: boolean }) => {
  return (

    <Modal open={open} setOpen={setOpen}>
      <ModalBody>
        <ModalTitle text={"Are you sure?"} />
        <div className='py-3'>
          <p>Are you sure you want to change your account's password?</p>
        </div>
      </ModalBody>
      <BottomButtons>
        <BtnRed onClick={submit} isLoading={isLoading}>Delete</BtnRed>
        <BtnNeutral func={() => {
          setOpen(false)
        }}>Cancel</BtnNeutral>
      </BottomButtons>
    </Modal>
  )
}
