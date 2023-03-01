import { Dispatch, ReactNode, SetStateAction } from "react";
import { BtnDelete } from "../btn/btnDelete";
import { BtnNeutral } from "../btn/btnNeutral";
import { BottomButtons } from "./bottomButtons";
import { Modal } from "./modal";
import { ModalBody } from "./modalBody";
import { ModalTitle } from "./modalTitle";

export const AreYouSureModal = ({
  onConfirm,
  onCancel,
  title,
  setOpen,
  open,
  children,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) => {
  return (
    <Modal open setOpen={setOpen}>
      <ModalBody>
        <ModalTitle text={title} />
        {children}
      </ModalBody>

      <BottomButtons>
        <BtnDelete onClick={onConfirm}></BtnDelete>
        <BtnNeutral func={onCancel}>Cancel</BtnNeutral>
      </BottomButtons>
    </Modal>
  );
};
