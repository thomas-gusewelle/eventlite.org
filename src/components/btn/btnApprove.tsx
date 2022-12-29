export const BtnApprove = ({ func }: { func: () => void }) => {
  return (
    <button
      onClick={func}
      className='bg-green-200 py-3 text-green-600 focus:ring-green-700'>
      Approve
    </button>
  );
};
