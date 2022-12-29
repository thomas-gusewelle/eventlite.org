export const BtnDeny = ({ func }: { func: () => void }) => {
  return (
    <button onClick={func} className='bg-red-200 py-3 text-red-600'>
      Deny
    </button>
  );
};
