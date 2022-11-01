import { Role } from "@prisma/client";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PaginateData } from "../../types/paginate";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { ErrorAlert } from "../components/alerts/errorAlert";
import { BtnAdd } from "../components/btn/btnAdd";
import { BtnCancel } from "../components/btn/btnCancel";
import { BtnSave } from "../components/btn/btnSave";
import { CircularProgress } from "../components/circularProgress";
import { SectionHeading } from "../components/headers/SectionHeading";
import { PaginationBar } from "../components/layout/pagination-bar";
import { sidebar, SidebarLayout } from "../components/layout/sidebar";
import { TableDropdown } from "../components/menus/tableDropdown";
import { BottomButtons } from "../components/modal/bottomButtons";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";
import { AlertContext } from "../providers/alertProvider";
import { paginate } from "../utils/paginate";
import { trpc } from "../utils/trpc";

const Roles = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [roleList, setRoleList] = useState<Role[]>();
  const [rolePaginated, setRolePaginated] = useState<Role[]>();
  const [pageNum, setPageNum] = useState(1);
  const [paginatedData, setpagiantedData] = useState<PaginateData<Role[]>>();
  const alertContext = useContext(AlertContext);
  // const [error, setError] = useState({ state: false, message: "" });

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
        roles.refetch();
      }
    },
    onError() {
      alertContext.setError({
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
      alertContext.setError({
        state: true,
        message: "There was an error editing your location. Please try again.",
      });

      roles.refetch();
    },
    onSuccess() {
      roles.refetch();
    },
  });

  const deleteRole = trpc.useMutation("role.deleteRoleById", {
    onMutate(data) {
      setRoleList(roleList?.filter((role) => role.id != data));
    },
    onError() {
      alertContext.setError({
        state: true,
        message: "There was an error deleting the role. Please try again",
      });
      setRoleList(roles.data);
      roles.refetch();
    },
    onSettled() {
      roles.refetch();
    },
  });

  useEffect(() => {
    if (roleList != undefined) {
      const _paginated = paginate(roleList, pageNum);
      setpagiantedData(_paginated);
      setRolePaginated(_paginated.data);
    }
  }, [pageNum, roleList]);

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
      setPageNum(1);

      setRoleList(filter);
    } else {
      setRoleList(roles.data);
    }
  };

  if (
    roles.isLoading ||
    rolePaginated == undefined ||
    paginatedData == undefined
  ) {
    return (
      <div className='flex justify-center'>
        <CircularProgress />
      </div>
    );
  }

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
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
      <>
        {/* MD Top Bar */}
        <div className='mb-8 grid grid-cols-2 gap-4 md:hidden'>
          <SectionHeading>Roles</SectionHeading>
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
              className='w-full rounded-xl border border-gray-100 bg-gray-100 py-2 pl-4 text-sm text-gray-500 focus:border-indigo-700 focus:outline-none'
              type='text'
              placeholder='Search'
            />
          </div>
        </div>

        {/* Desktop Top Bar */}
        <div className='mb-8 hidden justify-between md:flex'>
          <SectionHeading>Locations</SectionHeading>
          <div className='flex gap-4'>
            <input
              onChange={(e) => filter(e.target.value)}
              className='w-full rounded-xl border border-gray-100 bg-gray-100 py-2 pl-4 text-sm text-gray-500 focus:border-indigo-700 focus:outline-none'
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
              {rolePaginated?.map((role, index) => {
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
                    <td className='py-4 text-base leading-4 text-gray-800 md:text-xl'>
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
        <PaginationBar
          setPageNum={setPageNum}
          pageNum={pageNum}
          paginateData={paginatedData}
        />
      </>
    </>
  );
};

Roles.getLayout = sidebar;

export default Roles;
