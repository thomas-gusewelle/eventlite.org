import { Dispatch, SetStateAction, useContext } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { AlertContext } from "../../../providers/alertProvider"
import { api } from "../../../server/utils/api"
import { BtnNeutral } from "../../btn/btnNeutral"
import { BtnPurple } from "../../btn/btnPurple"
import { PasswordField } from "../../form/password"
import { BottomButtons } from "../bottomButtons"
import { Modal } from "../modal"
import { ModalBody } from "../modalBody"
import { ModalTitle } from "../modalTitle"

export const PasswordChange = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const methods = useForm<{
    password: string, passwordConfirm: string
  }>()
  const { setError, setSuccess } = useContext((AlertContext))
  const changePasswordMutation = api.userSettings.changePassword.useMutation()
  const submit = methods.handleSubmit((data) => {
    if (data.password != data.passwordConfirm) {
      methods.setError("passwordConfirm", { message: "Passwords do not match" })
      return
    }

    changePasswordMutation.mutate({ password: data.password, confirmPassword: data.passwordConfirm }, {
      onError(err) {
        setError({ state: true, message: err.message })
        setOpen(false)
      },
      onSuccess() {
        setSuccess({ state: true, message: "Password changed successfully" })
        setOpen(false)
      }
    })

  })
  return (
    <FormProvider {...methods}>
      <form>
        <Modal open={open} setOpen={setOpen}>
          <ModalBody>
            <ModalTitle text={"Change email address"} />
            <div className='py-3'>
              <PasswordField />
              <PasswordField isConfirm />
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
