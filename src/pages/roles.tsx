import { Role } from "@prisma/client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { ErrorAlert } from "../components/alerts/errorAlert";
import { BtnAdd } from "../components/btn/btnAdd";
import { BtnCancel } from "../components/btn/btnCancel";
import { BtnSave } from "../components/btn/btnSave";
import { SectionHeading } from "../components/headers/SectionHeading";
import SidebarLayout from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";
import { BottomButtons } from "../components/modal/bottomButtons";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";
import { trpc } from "../utils/trpc";

const Roles = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [roleList, setRoleList] = useState<Role[]>();
  const [error, setError] = useState({ state: false, message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const roles = trpc.useQuery(["role.getRolesByOrganization"], {
    onSuccess(data) {
      setRoleList(data);
    },
  });

  const addRole = trpc.useMutation("role.addRole", {
    onSuccess(data, variables, context) {
      if (roleList && data) {
        setRoleList([...roleList, data]);
        setEditOpen(false);
      }
    },
    onError() {
      setError({
        state: true,
        message: "There was an error adding your role. Please try again.",
      });
      setEditOpen(false);
    },
  });

  const editRole = trpc.useMutation("role.editRoleById", {
    onMutate(data) {
      if (editId != null && roleList) {
        let index = roleList?.findIndex((role) => role.id == data.id);

        if (index >= 0) {
          roleList[index]!.name = data.name;
        }
        setEditOpen(false);
      }
    },
    onError(error, variables, context) {
      setError({
        state: true,
        message: "There was an error editing your location. Please try again.",
      });
      roles.refetch();
    },
  });

  const deleteRole = trpc.useMutation("role.deleteRoleById", {
    onMutate(data) {
      setRoleList(roleList?.filter((role) => role.id != data));
    },
    onError() {
      setError({
        state: true,
        message: "There was an error deleting the role. Please try again",
      });
      setRoleList(roles.data);
      roles.refetch();
    },
  });

  const submit = handleSubmit((data) => {
    if (editId == null) {
      addRole.mutate(data.name);
    }
    if (editId != null) {
      editRole.mutate({
        id: editId,
        name: data.name,
      });
    }
  });

  const filter = (e: string) => {
    if (e.length > 0) {
      let key = e.toLowerCase();
      const filter = roles.data?.filter((role) => {
        return role.name?.toLowerCase().includes(key);
      });
      setRoleList(filter);
    } else {
      setRoleList(roles.data);
    }
  };
  return (
    <>
      <Modal open={editOpen} setOpen={setEditOpen}>
        <>
          <form onSubmit={submit}>
            <ModalBody>
              <ModalTitle text={editId == null ? "Add Role" : "Edit Role"} />
              <div className='mt-2'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'>
                  Role Name
                </label>
                <input
                  type='text'
                  id='name'
                  {...register("name", { required: true, minLength: 3 })}
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
                {errors.name && (
                  <span className='text-red-500'>
                    Location Name is Required
                  </span>
                )}
              </div>
            </ModalBody>
            <BottomButtons>
              <BtnSave type={"submit"} />
              <BtnCancel
                onClick={() => {
                  setEditOpen(false);
                }}
              />
            </BottomButtons>
          </form>
        </>
      </Modal>
      <SidebarLayout>
        {error.state && <ErrorAlert setState={setError} error={error} />}
        {/* MD Top Bar */}
        <div className='md:hidden grid grid-cols-2 mb-8 gap-4'>
          <SectionHeading>Locations</SectionHeading>
          <div className='flex justify-end'>
            <BtnAdd
              onClick={() => {
                reset({ name: "" });
                setEditId(null);
                setEditOpen(true);
              }}
            />
          </div>
          <div className='col-span-2'>
            <input
              onChange={(e) => filter(e.target.value)}
              className='border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2'
              type='text'
              placeholder='Search'
            />
          </div>
        </div>

        {/* Desktop Top Bar */}
        <div className='hidden md:flex justify-between mb-8'>
          <SectionHeading>Locations</SectionHeading>
          <div className='flex gap-4'>
            <input
              onChange={(e) => filter(e.target.value)}
              className='border border-gray-100 focus:outline-none focus:border-indigo-700 rounded-xl w-full text-sm text-gray-500 bg-gray-100 pl-4 py-2'
              type='text'
              placeholder='Search'
            />
            {/* <SearchBar /> */}
            <BtnAdd
              onClick={() => {
                reset({ name: "" });
                setEditId(null);
                setEditOpen(true);
              }}
            />
          </div>
        </div>

        <div className='w-full'>
          <table className='w-full table-auto text-left'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roleList?.map((role, index) => {
                const options: TableOptionsDropdown = [
                  {
                    name: "Edit",
                    function: () => {
                      reset(role);
                      setEditId(role.id);
                      setEditOpen(true);
                    },
                  },
                  {
                    name: "Delete",
                    function: () => {
                      deleteRole.mutate(role.id);
                    },
                  },
                ];

                return (
                  <tr key={index} className='border-t last:border-b'>
                    <td className='py-4 md:text-xl text-gray-800 text-base leading-4'>
                      {role.name}
                    </td>
                    <td>
                      <TableDropdown options={options} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SidebarLayout>
    </>
  );
};

export default Roles;
