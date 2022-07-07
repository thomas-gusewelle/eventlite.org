export const BtnNeutral: React.FC<{ children: any }> = ({ children }) => {
  return (
    <button className='flex items-center justify-center bg-gray-100 px-3 py-[.1rem] rounded-lg hover:bg-gray-200 transition-all 200ms ease-in-out'>
      {children}
    </button>
  );
};
