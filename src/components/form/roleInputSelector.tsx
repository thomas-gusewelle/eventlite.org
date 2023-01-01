import { Role } from ".prisma/client";
import { useFormContext } from "react-hook-form";

export const RoleInputSelector: React.FC<{ userRoles: Role[] }> = ({
  userRoles,
}) => {
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
        className='mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'>
        {userRoles?.map((role) => (
          <option key={role.id}>{role.name}</option>
        ))}
      </select>
    </>
  );
};
