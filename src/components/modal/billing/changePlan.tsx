import { Dispatch, SetStateAction } from "react"
import { Modal } from "../modal"

export const ChangePlanModal = ({open, setOpen}: {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) => {
  return <Modal open={open} setOpen={setOpen}>hehe</Modal>
}
