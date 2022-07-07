import { User } from "@prisma/client";
import Image from "next/future/image";

export const Avatar: React.FC<{ user: User }> = ({ user }) => {
  const findInitials = () => {
    if (!user.name) return;

    const nameSplit = user.name
      .split(" ")
      .map((i) => i[0])
      .join("");
    return nameSplit;
  };

  return (
    <>
      {user.image ? (
        <Image
          className='rounded-full h-10 w-10 object-cover'
          src={user.image}
          alt={"avatar"}></Image>
      ) : (
        // <img
        //   className='rounded-full h-10 w-10 object-cover'
        //   src={user.image || ""}
        //   alt=''
        // />
        <div className=' flex justify-center items-center rounded-full h-10 w-10 bg-indigo-600 text-white font-bold'>
          {findInitials()}
        </div>
      )}
    </>
  );
};
