import { Dispatch, SetStateAction, useState } from "react";
import { MdQuestionAnswer } from "react-icons/md";
import { classNames } from "../../utils/classnames";
import { BtnNeutral } from "../btn/btnNeutral";
import { BtnPurple } from "../btn/btnPurple";

export const Feedback = ({ isScroll }: { isScroll: boolean }) => {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`${
        isScroll ? "sticky" : "absolute"
      } bottom-2 right-0 mr-2 flex origin-bottom-right cursor-pointer justify-end`}>
      {open ? (
        <FeedbackTabs setOpen={setOpen} />
      ) : (
        <div
          onClick={() => setOpen(true)}
          className='rounded-lg bg-neutral-200 p-3 shadow'>
          <MdQuestionAnswer size={20} className='text-neutral-900' />
        </div>
      )}
    </div>
  );
};

const FeedbackTabs = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selected, setSelected] = useState(1);
  return (
    <div className='rounded-lg border border-gray-200 bg-white px-3 py-3 shadow'>
      <div className='mb-3 flex justify-start space-x-1 rounded-xl bg-gray-100 p-1 sm:w-fit'>
        <div
          onClick={() => {
            setSelected(1);
          }}
          className={classNames(
            "w-full rounded-lg px-3 py-1 text-sm font-medium leading-5 sm:w-auto",
            "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
            selected == 1
              ? "bg-white text-indigo-700 shadow"
              : " text-gray-600 hover:bg-white/[0.12] hover:text-white"
          )}>
          Feedback
        </div>
        <div
          onClick={() => {
            setSelected(2);
          }}
          className={classNames(
            "w-full rounded-lg px-3 py-1 text-sm font-medium leading-5 sm:w-auto",
            "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
            selected == 2
              ? "bg-white text-indigo-700 shadow"
              : " text-gray-600 hover:bg-white/[0.12] hover:text-white"
          )}>
          Bug
        </div>
        <div
          onClick={() => {
            setSelected(3);
          }}
          className={classNames(
            "w-full rounded-lg px-3 py-1 text-sm font-medium leading-5 sm:w-auto",
            "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
            selected == 3
              ? "bg-white text-indigo-700 shadow"
              : " text-gray-600 hover:bg-white/[0.12] hover:text-white"
          )}>
          Other
        </div>
      </div>
      <textarea></textarea>
      <div className='flex justify-end gap-3'>
        <BtnNeutral func={() => setOpen(false)}>Cancel</BtnNeutral>
        <BtnPurple>Submit</BtnPurple>
      </div>
    </div>
  );
};
