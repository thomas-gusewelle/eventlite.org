import { Dispatch, SetStateAction } from "react";
import { BtnCancel } from "../btn/btnCancel";

import { BtnSave } from "../btn/btnSave";
import { BottomButtons } from "./bottomButtons";
import { Modal } from "./modal";
import { ModalBody } from "./modalBody";
import { ModalTitle } from "./modalTitle";

export const EmailChangeModal = ({
  open,
  setOpen,
  saveOnClick,
  cancelOnClick,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  saveOnClick: () => void;
  cancelOnClick: () => void;
}) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalBody>
        <ModalTitle text={"Email Change Notice"} />
        <div className='py-3'>
          <p>
            Changing your email will not change the email used for login. If you
            would like to change this email please do so in your profile
            settings.
          </p>
        </div>
      </ModalBody>
      <BottomButtons>
        <BtnSave onClick={saveOnClick} />
        <BtnCancel onClick={cancelOnClick} />
      </BottomButtons>
    </Modal>
  );
};
