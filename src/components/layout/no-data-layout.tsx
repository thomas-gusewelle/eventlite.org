import { BtnPurple } from "../btn/btnPurple";
import { SectionHeading } from "../headers/SectionHeading";

export const NoDataLayout = ({
  heading,
  text,
  func,
  btnText,
}: {
  heading: string;
  text?: string;
  func: () => void;
  btnText: string;
}) => {
  return (
    <div>
      <SectionHeading>{heading}</SectionHeading>
      <div className='ali mt-10 flex flex-col items-center justify-center gap-3'>
        <p className='w-96 text-center text-2xl md:w-auto'>{text}</p>
        <div className='flex justify-center'>
          <BtnPurple onClick={func}>{btnText}</BtnPurple>
        </div>
      </div>
    </div>
  );
};
