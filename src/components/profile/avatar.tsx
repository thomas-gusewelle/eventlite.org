import { User, UserSettings } from "@prisma/client";
import Image from "next/image";

export const Avatar: React.FC<{
  user:
    | (User & {
        UserSettings: UserSettings | null;
      })
    | null
    | undefined;
}> = ({ user }) => {
  if (user == undefined || user == null) {
    return null;
  }

  const findInitials = () => {
    if (!user.firstName || !user.lastName) return;
    const initials = [user.firstName, user.lastName];
    const nameSplit = initials
      .map((i) => i[0])
      .join("")
      .toLocaleUpperCase();
    return nameSplit;
  };

  return (
    <>
      {user.image ? (
        <Image
          className='aspect-square rounded-full object-cover'
          src={user.image}
          alt={"avatar"}></Image>
      ) : (
        // <img
        //   className='rounded-full h-10 w-10 object-cover'
        //   src={user.image || ""}
        //   alt=''
        // />
        <div className=' flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white'>
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
          className='aspect-square rounded-full object-cover'
          src={user.image}
          alt={"avatar"}></Image>
      ) : (
        // <img
        //   className='rounded-full h-10 w-10 object-cover'
        //   src={user.image || ""}
        //   alt=''
        // />
        <div className=' flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'>
          {findInitials()}
        </div>
      )}
    </>
  );
};
