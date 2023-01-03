const StepCounter = ({ signUpState }: { signUpState: number }) => {
  return (
    <div className='mx-auto mb-4 flex items-center justify-center'>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          signUpState === 1
            ? "bg-green-500 text-white"
            : "bg-white text-stone-800"
        }`}>
        <span>1</span>
      </div>
      <div className='mx-2 h-1 w-12 bg-white'></div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          signUpState === 2
            ? "bg-green-500 text-white"
            : "bg-white text-stone-800"
        }`}>
        <span>2</span>
      </div>
      <div className='mx-2 h-1 w-12 bg-white'></div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          signUpState === 3
            ? "bg-green-500 text-white"
            : "bg-white text-stone-800"
        }`}>
        <span>3</span>
      </div>
    </div>
  );
};

export default StepCounter;
