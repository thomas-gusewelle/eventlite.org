import { Dialog } from "@headlessui/react";

export const ModalTitle: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Dialog.Title
      as='h3'
      className='text-lg leading-6 font-medium text-gray-900'>
      {text}
    </Dialog.Title>
  );
};
