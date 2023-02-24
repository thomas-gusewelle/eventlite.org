import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { classNames } from "../../utils/classnames";
import { BtnNeutral } from "../btn/btnNeutral";
import { BtnPurple } from "../btn/btnPurple";
import { Modal } from "../modal/modal";
import { LottiePlayer } from "../marketing-site/component/lottiePlayer";
import submitLottie from "./check-tick.json";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// export const Feedback = ({ isScroll }: { isScroll: boolean }) => {
//   const [open, setOpen] = useState(true);
//   return (
//     <div
//       className={`${
//         isScroll ? "sticky" : "absolute"
//       } bottom-2 right-0 mr-2 flex origin-bottom-right cursor-pointer justify-end`}>
//       {open ? (
//         <FeedbackTabs setOpen={setOpen} />
//       ) : (
//         <div
//           onClick={() => setOpen(true)}
//           className='rounded-lg bg-gray-800 p-3 shadow'>
//           <MdQuestionAnswer size={20} className='text-gray-50' />
//         </div>
//       )}
//     </div>
//   );
// };

export const FeedbackTabs = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isSubmited, setIsSubmited] = useState(false);
  const supabase = useSupabaseClient();
  const [elementHeight, setElementHeight] = useState(0);
  const reportMutation = trpc.useMutation("feedback.submitReport");
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<{ text: string; picture: FileList }>();
  const [selected, setSelected] = useState<"FEEDBACK" | "BUG" | "OTHER">("BUG");
  // Sets focus on paragraph entry
  setFocus("text");

  // gets height of form and sets lottie player to that height
  useEffect(() => {
    const formEl = document.getElementById("form");
    if (formEl) {
      setElementHeight(formEl.clientHeight);
    }
  }, []);

  const submit = handleSubmit(async (data) => {
    console.log(data);
    const pic = data.picture[0];
    if (pic) {
      const upload = await supabase.storage
        .from("feedback")
        .upload(`beta/${pic.name}`, pic);
      reportMutation.mutate(
        {
          type: selected,
          text: data.text,
          route: router.asPath,
          picUrl: upload.data?.path,
        },
        { onSuccess: () => setIsSubmited(true) }
      );
    } else {
      reportMutation.mutate(
        {
          type: selected,
          text: data.text,
          route: router.asPath,
        },
        { onSuccess: () => setIsSubmited(true) }
      );
    }
  });

  // timeout to close form after submitted
  useEffect(() => {
    if (isSubmited) {
      setTimeout(() => {
        setOpen(false);
      }, 2500);
    }
  }, [isSubmited, setOpen]);

  return (
    <Modal open={open} setOpen={setOpen}>
      {isSubmited ? (
        <div
          style={{ height: elementHeight }}
          className='flex h-full min-w-[90vw] items-center justify-center overflow-hidden rounded-lg  px-3 py-3 shadow sm:min-w-[24rem]'>
          <motion.div
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className='h-full'>
            <Lottie
              animationData={submitLottie}
              loop={0}
              style={{ height: elementHeight }}
            />
            {/* <LottiePlayer
              animationData={submitLottie}
              loop={0}
              divClasses={`h-[${elementHeight}px] flex justify-center items-center`}
            /> */}
          </motion.div>
        </div>
      ) : (
        <form
          id='form'
          onSubmit={submit}
          className='min-w-[90vw] max-w-[90vw] rounded-lg px-3  py-3 shadow sm:min-w-[24rem]'>
          <div className='mb-3 flex justify-start space-x-1 rounded-xl bg-gray-200 p-1'>
            <div
              onClick={() => {
                setSelected("BUG");
              }}
              className={classNames(
                "w-full cursor-pointer rounded-lg px-3 py-1 text-center text-sm font-medium leading-5",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                selected == "BUG"
                  ? "bg-white text-indigo-700 shadow"
                  : " bg-white/[.05] text-gray-700 hover:bg-white/[0.12] hover:text-gray-500"
              )}>
              Bug
            </div>
            <div
              onClick={() => {
                setSelected("FEEDBACK");
              }}
              className={classNames(
                "w-full cursor-pointer rounded-lg px-3 py-1 text-center text-sm font-medium leading-5",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                selected == "FEEDBACK"
                  ? "bg-white text-indigo-700 shadow"
                  : " bg-white/[.05] text-gray-700 hover:bg-white/[0.12] hover:text-gray-500"
              )}>
              Feedback
            </div>
            <div
              onClick={() => {
                setSelected("OTHER");
              }}
              className={classNames(
                "w-full cursor-pointer rounded-lg px-3 py-1  text-center text-sm font-medium leading-5",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                selected == "OTHER"
                  ? "bg-white text-indigo-700 shadow"
                  : " bg-white/[.05] text-gray-700 hover:bg-white/[0.12] hover:text-gray-500"
              )}>
              Other
            </div>
          </div>
          <textarea
            autoFocus
            {...register("text", { required: "Description required" })}
            className={`min-h-[12rem] w-full rounded-lg border-gray-300  bg-gray-100 focus:border-indigo-700 focus:ring-indigo-700 ${
              errors.text &&
              "border-2 border-red-500 focus:border-red-500 focus:ring-red-500"
            }`}></textarea>
          <div className='mt-3 mb-6 grid gap-1'>
            <label>Screenshot Upload (not required)</label>
            <input
              {...register("picture")}
              className='file:cursor-pointer file:rounded-lg file:border-none file:bg-indigo-600 file:px-3 file:py-1 file:text-white'
              type={"file"}
              accept='image/png image/jpeg image/heic '></input>
          </div>
          <div className='mt-3 flex justify-center gap-3'>
            <BtnNeutral fullWidth func={() => setOpen(false)}>
              Cancel
            </BtnNeutral>
            <BtnPurple type='submit' fullWidth>
              Submit
            </BtnPurple>
          </div>
        </form>
      )}
    </Modal>
  );
};
