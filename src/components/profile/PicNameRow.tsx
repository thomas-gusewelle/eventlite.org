import { User } from ".prisma/client";
import { UserSettings } from "@prisma/client";
import { fullName } from "../../utils/fullName";
import { Avatar, AvatarSmall } from "./avatar";

export const PicNameRow: React.FC<{
  user: User | null;
}> = ({ user }) => {
  if (user == null) {
    return null;
  }
  return (
    <div className='flex items-center'>
      <Avatar user={user} />
      <p className='ml-2 text-base leading-4 text-gray-800 md:text-xl'>
        {fullName(user.firstName, user.lastName)}
        {/* {user.firstName} */}
      </p>
    </div>
  );
};

export const PicNameRowSmall: React.FC<{ user: User | undefined | null }> = ({
  user,
}) => {
  if (user == undefined || user == null) {
    return null;
  }
  return (
    <div className='flex items-center'>
      <AvatarSmall user={user} />
      <p className=' md:text-l ml-2 leading-4 text-gray-800'>
        {fullName(user.firstName, user.lastName)}
        {/* {user.firstName} */}
      </p>
    </div>
  );
};
