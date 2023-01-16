import Link from "next/link";

const StepCounter = ({
  signUpState,
  totalNum,
}: {
  signUpState: number;
  totalNum: number;
}) => {
  let loop = [];
  for (let i = 1; i <= totalNum; i++) {
    loop.push(i);
  }

  return (
    <>
      <div className='mx-auto mb-6 flex items-center justify-center'>
        {loop.map((item) => (
          <>
            <div
              key={item}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                signUpState === item
                  ? "border-[3px] bg-indigo-700 text-white"
                  : "bg-white text-stone-800"
              }`}>
              <span>{item}</span>
            </div>
            {item != totalNum && <div className='mx-2 h-1 w-12 bg-white'></div>}
          </>
        ))}
      </div>
    </>
  );
};

export default StepCounter;
