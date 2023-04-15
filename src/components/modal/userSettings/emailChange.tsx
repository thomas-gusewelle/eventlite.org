
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
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

type FormData = { email: string, confirmEmail: string }

export const EmailChange = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const user = useContext(UserContext)
  const context = api.useContext()
  const { setError, setSuccess } = useContext(AlertContext)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)
  const changeEmailMutation = api.userSettings.updateEmail.useMutation()
  const methods = useForm<FormData>()

  // event listener for enter key
  useEffect(() => {
    function handleEnter(event: KeyboardEvent) {
      if (event.key == "Enter") {
        console.log(event)
        event.preventDefault()
        if (showConfirm == false) {
          preSubmit()
        }
        else {
          submit()
        }
      }
    }
    document.addEventListener("keypress", handleEnter)
    return () => {
      document.removeEventListener("keypress", handleEnter)
      setFormData(null)
    }
  }, [showConfirm])

  // preSubmit handles checking for errors and then showing confirm screen
  const preSubmit = methods.handleSubmit((data) => {

    if (data.email == user?.email) {
      setOpen(false)
      return
    }
    if (data.email != data.confirmEmail) {
      methods.setError("confirmEmail", { type: "custom", message: "Emails do not match" })
      return
    }
    setFormData(data)
    setShowConfirm(true)
  })

  //handles submitting actual data
  const submit = () => {
    if (formData == null) {
      setError({ state: true, message: "Error changing email" })
      setOpen(false)
      return
    }
    changeEmailMutation.mutate({ email: formData.email, confirmEmail: formData.confirmEmail }, {
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
  }
  if (showConfirm == false) {
    return (
      <FormProvider {...methods}>
        <form onSubmit={preSubmit}>
          <Modal open={open} setOpen={setOpen}>
            <ModalBody>
              <ModalTitle text={"Change email address"} />
              <div className='py-3'>
                <EmailInput />
                <EmailInput isConfirm />
              </div>
            </ModalBody>
            <BottomButtons>
              <BtnPurple type="submit" onClick={preSubmit}>Save</BtnPurple>
              <BtnNeutral func={() => {
                setOpen(false)
              }}>Cancel</BtnNeutral>
            </BottomButtons>
          </Modal>
        </form>
      </FormProvider>
    )
  }
  if (showConfirm == true) {
    return (
      <Modal open={open} setOpen={setOpen}>
        <ModalBody>
          <ModalTitle text={"Are you sure?"} />
          <div className='py-3'>
            <p>Are you sure you want to change your account's email address to {formData?.email}?</p>
          </div>
        </ModalBody>
        <BottomButtons>
          <BtnPurple type="submit" onClick={submit} isLoading={changeEmailMutation.isLoading}>Confirm</BtnPurple>
          <BtnNeutral func={() => {
            setOpen(false)
          }}>Cancel</BtnNeutral>
        </BottomButtons>
      </Modal>
    )
  }
}
