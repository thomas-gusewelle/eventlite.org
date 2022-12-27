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
        <h3 className='w-96 text-center text-2xl md:w-auto'>{text}</h3>
        <div className='flex justify-center'>
          <BtnPurple func={func}>{btnText}</BtnPurple>
        </div>
      </div>
    </div>
  );
};
