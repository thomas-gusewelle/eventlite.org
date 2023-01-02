import { UserStatus } from ".prisma/client";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { UserContext } from "../../providers/userProvider";

// component to select user status {ADMIN | USER | MANAGER}
export const UserStatusInputSelector: React.FC<{ userRoles: UserStatus[] }> = ({
  userRoles,
}) => {
  const user = useContext(UserContext);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <label
        htmlFor='country'
        className='block text-sm font-medium text-gray-700'>
        Role
      </label>
      <select
        id='role'
        {...register("status")}
        disabled={user?.status != "ADMIN"}
        className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'>
        {userRoles?.map((role) => (
          <option key={role}>{role}</option>
        ))}
      </select>
    </>
  );
};
