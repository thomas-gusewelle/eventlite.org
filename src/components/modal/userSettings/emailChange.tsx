
import { Dispatch, SetStateAction, useContext } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { AlertContext } from "../../../providers/alertProvider"
import { UserContext } from "../../../providers/userProvider"
import { api } from "../../../server/utils/api"
import { BtnNeutral } from "../../btn/btnNeutral"
import { BtnPurple } from "../../btn/btnPurple"
import { EmailInput } from "../../form/emailInput"
import { BottomButtons } from "../bottomButtons"
import { Modal } from "../modal"
import { ModalBody } from "../modalBody"
import { ModalTitle } from "../modalTitle"

export const EmailChange = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const user = useContext(UserContext)
  const context = api.useContext()
  const { setError, setSuccess } = useContext(AlertContext)
  const changeEmailMutation = api.userSettings.updateEmail.useMutation()
  const methods = useForm<{ email: string, confirmEmail: string }>()
  const submit = methods.handleSubmit((data) => {
    if (data.email == user?.email) {
      setOpen(false)
      return
    }
    if (data.email != data.confirmEmail) {
      methods.setError("confirmEmail", { type: "custom", message: "Emails do not match" })
      return
    }
    changeEmailMutation.mutate({ email: data.email, confirmEmail: data.confirmEmail }, {
      onError(err) {
        setOpen(false)
        setError({ state: true, message: err.message })
      },
      onSuccess() {
        context.user.getUser.invalidate();
        setOpen(false)
        setSuccess({ state: true, message: "Email Changed Successfully" })
      }
    })
  })
  return (
    <FormProvider {...methods}>
      <form onSubmit={submit}>
        <Modal open={open} setOpen={setOpen}>
          <ModalBody>
            <ModalTitle text={"Change email address"} />
            <div className='py-3'>
              <EmailInput />
              <EmailInput isConfirm />
            </div>
          </ModalBody>
          <BottomButtons>
            <BtnPurple onClick={submit} isLoading={changeEmailMutation.isLoading}>Save</BtnPurple>
            <BtnNeutral func={() => {
              setOpen(false)
            }}>Cancel</BtnNeutral>
          </BottomButtons>
        </Modal>
      </form>
    </FormProvider>
  )
}
