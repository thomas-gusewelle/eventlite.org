export const BottomButtons: React.FC<{ children: any }> = ({ children }) => {
  return (
    <div className='flex flex-row-reverse gap-3 bg-gray-50 px-4 py-3 sm:px-6'>
      {children}
    </div>
  );
};
