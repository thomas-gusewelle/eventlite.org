import { Dispatch, SetStateAction, useContext } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { AlertContext } from "../../../providers/alertProvider"
import { api } from "../../../server/utils/api"
import { BtnNeutral } from "../../btn/btnNeutral"
import { BtnPurple } from "../../btn/btnPurple"
import { EmailInput } from "../../form/emailInput"
import { BottomButtons } from "../bottomButtons"
import { Modal } from "../modal"
import { ModalBody } from "../modalBody"
import { ModalTitle } from "../modalTitle"

export const PasswordChange = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const methods = useForm<{ password: string, confirmPassword: string }>()
  const { setError, setSuccess } = useContext((AlertContext))
  const changePasswordMutation = api.userSettings.changePassword.useMutation()
  const submit = methods.handleSubmit((data) => {
    if (data.password != data.confirmPassword) {
      methods.setError("confirmPassword", { message: "Passwords do not match" })
      return
    }

  })
  return (
    <FormProvider {...methods}>
      <form>

        <Modal open={open} setOpen={setOpen}>
          <ModalBody>
            <ModalTitle text={"Change email address"} />
            <div className='py-3'>
              <EmailInput />
              <EmailInput isConfirm />
            </div>
          </ModalBody>
          <BottomButtons>
            <BtnPurple onClick={submit} isLoading={changePasswordMutation.isLoading}>Save</BtnPurple>
            <BtnNeutral func={() => {
              setOpen(false)
            }}>Cancel</BtnNeutral>
          </BottomButtons>
        </Modal>
      </form>
    </FormProvider>
  )
}
