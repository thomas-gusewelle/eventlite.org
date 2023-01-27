import { User } from "@prisma/client";
import Image from "next/image";

export const Avatar: React.FC<{ user: User }> = ({ user }) => {
  const findInitials = () => {
    if (!user.firstName || !user.lastName) return;
    const initials = [user.firstName, user.lastName];
    const nameSplit = initials
      .map((i) => i[0])
      .join("")
      .toLocaleUpperCase();
    return nameSplit;
  };

  if (user == undefined || user == null) {
    return <div></div>;
  }

  return (
    <>
      {user.image ? (
        <Image
          className='rounded-full aspect-square object-cover'
          src={user.image}
          alt={"avatar"}></Image>
      ) : (
        // <img
        //   className='rounded-full h-10 w-10 object-cover'
        //   src={user.image || ""}
        //   alt=''
        // />
        <div className=' flex justify-center items-center rounded-full aspect-square h-10 w-10 bg-indigo-600 text-white font-bold'>
          {findInitials()}
        </div>
      )}
    </>
  );
};

export const AvatarSmall: React.FC<{ user: User }> = ({ user }) => {
  const findInitials = () => {
    if (!user.firstName || !user.lastName) return;
    const initials = [user.firstName, user.lastName];
    const nameSplit = initials
      .map((i) => i[0])
      .join("")
      .toLocaleUpperCase();
    return nameSplit;
  };

  if (user == undefined || user == null) {
    return <div></div>;
  }

  return (
    <>
      {user.image ? (
        <Image
          className='rounded-full aspect-square object-cover'
          src={user.image}
          alt={"avatar"}></Image>
      ) : (
        // <img
        //   className='rounded-full h-10 w-10 object-cover'
        //   src={user.image || ""}
        //   alt=''
        // />
        <div className=' flex justify-center items-center rounded-full aspect-square w-8 h-8 bg-indigo-600 text-white font-semibold'>
          {findInitials()}
        </div>
      )}
    </>
  );
};
