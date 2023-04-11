
import { EmailAddress } from "@sendgrid/helpers/classes"
import { Dispatch, SetStateAction } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BtnCancel } from "../../btn/btnCancel"
import { BtnSave } from "../../btn/btnSave"
import { EmailInput } from "../../form/emailInput"
import { BottomButtons } from "../bottomButtons"
import { Modal } from "../modal"
import { ModalBody } from "../modalBody"
import { ModalTitle } from "../modalTitle"

export const EmailChange = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const methods = useForm<{ email: String, confirmEmail: String }>()
  return (
    <form>
      <FormProvider {...methods}>
        <Modal open={open} setOpen={setOpen}>
          <ModalBody>
            <ModalTitle text={"Change email address"} />
            <div className='py-3'>
              <EmailInput />
            </div>
          </ModalBody>
          <BottomButtons>
            <BtnSave />
            <BtnCancel />
          </BottomButtons>
        </Modal>
      </FormProvider>
    </form>
  )
}
