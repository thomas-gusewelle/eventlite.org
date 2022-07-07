import { User } from ".prisma/client";
import { Avatar } from "./avatar";

export const PicNameRow: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className='flex items-center'>
      <Avatar user={user} />
      <p className='md:text-xl text-gray-800 text-base leading-4 ml-2'>
        {user.name}
      </p>
    </div>
  );
};
