import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
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

type FormData = {
  password: string, passwordConfirm: string
}

export const PasswordChange = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const methods = useForm<FormData>()
  const { setError, setSuccess } = useContext((AlertContext))
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)
  const changePasswordMutation = api.userSettings.changePassword.useMutation()

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

  const preSubmit = methods.handleSubmit((data) => {
    if (data.password != data.passwordConfirm) {
      methods.setError("passwordConfirm", { message: "Passwords do not match" })
      return
    }
    setShowConfirm(true)
  })

  const submit = () => {
    if (formData == null) {
      setError({ state: true, message: "Error changing password." })
      return
    }
    changePasswordMutation.mutate({ password: formData.password, confirmPassword: formData.passwordConfirm }, {
      onError(err) {
        setError({ state: true, message: err.message })
        setOpen(false)
      },
      onSuccess() {
        setSuccess({ state: true, message: "Password changed successfully" })
        setOpen(false)
      }
    })
  }


  if (showConfirm == true) {
    return (
      <Modal open={open} setOpen={setOpen}>
        <ModalBody>
          <ModalTitle text={"Are you sure?"} />
          <div className='py-3'>
            <p>Are you sure you want to change your account&apos;s password?</p>
          </div>
        </ModalBody>
        <BottomButtons>
          <BtnPurple type="submit" onClick={submit} isLoading={changePasswordMutation.isLoading}>Confirm</BtnPurple>
          <BtnNeutral func={() => {
            setShowConfirm(false)
            setOpen(false)
          }}>Cancel</BtnNeutral>
        </BottomButtons>
      </Modal>
    )
  }
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
            <BtnPurple onClick={preSubmit}>Save</BtnPurple>
            <BtnNeutral func={() => {
              setOpen(false)
            }}>Cancel</BtnNeutral>
          </BottomButtons>
        </Modal>
      </form>
    </FormProvider>
  )
}
