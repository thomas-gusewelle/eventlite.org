import { UserStatus } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { TableOptionsDropdown } from "../../../../types/tableMenuOptions";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { BtnPurple } from "../../btn/btnPurple";
import { SectionHeading } from "../../headers/SectionHeading";
import { TableDropdown } from "../../menus/tableDropdown";
import { BottomButtons } from "../../modal/bottomButtons";
import { Modal } from "../../modal/modal";
import { ModalBody } from "../../modal/modalBody";
import { PicNameRow } from "../../profile/PicNameRow";

type User = {
  firstName: string;
  lastName: string;
  id: string;
  status: UserStatus;
  email: string;
  emailVerified: null;
  phoneNumber: null;
  image: null;
  organizationId: null;
  hasLogin: boolean;
  userSettingsId: null;
  roles: {
    name: string;
  }[];
};

export const PoepleTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<User>();
  const [people, setPeople] = useState<User[]>([
    {
      firstName: "Betty",
      lastName: "Green",
      id: "bgreen@email.com",
      status: "USER" as UserStatus,
      email: "bgreen@email.com",
      emailVerified: null,
      phoneNumber: null,
      image: null,
      organizationId: null,
      hasLogin: false,
      userSettingsId: null,
      roles: [{ name: "Audio" }],
    },
    {
      firstName: "John",
      lastName: "Manning",
      id: "jmanning@email.com",
      status: "USER" as UserStatus,
      email: "jmanning@email.com",
      emailVerified: null,
      phoneNumber: null,
      image: null,
      organizationId: null,
      hasLogin: false,
      userSettingsId: null,
      roles: [{ name: "Audio" }, { name: "Video" }],
    },
    {
      firstName: "Kathy",
      lastName: "Lee",
      id: "klee@email.com",
      status: "USER" as UserStatus,
      email: "klee@email.com",
      emailVerified: null,
      phoneNumber: null,
      image: null,
      organizationId: null,
      hasLogin: false,
      userSettingsId: null,
      roles: [
        { name: "Slides" },
        { name: "Producer" },
        { name: "Audio" },
        { name: "Video" },
      ],
    },
  ]);
  return (
    <>
      {selectedPerson != undefined && (
        <ViewProfile user={selectedPerson} open={isOpen} setOpen={setIsOpen} />
      )}
      <div className='mt-4 w-full'>
        <table className='w-full table-auto text-left'>
          <thead>
            <tr>
              <th>Name</th>
              <th className='hidden md:table-cell'>Email</th>
              <th>Role</th>
              <th className='hidden md:table-cell'>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, index) => {
              const options: TableOptionsDropdown = [
                {
                  name: "View Profile",
                  function: () => {
                    setSelectedPerson(person);
                    setIsOpen(true);
                  },
                },

                {
                  name: "Delete",
                  function: () =>
                    setPeople(people.filter((item) => item.id != person.id)),
                  show: people.length > 1,
                },
              ];

              return (
                <tr key={index} className='border-t last:border-b'>
                  <td className='py-4'>
                    <PicNameRow user={person} />
                  </td>
                  <td className='hidden md:table-cell'>{person.email}</td>
                  <td>
                    <div className='my-1 flex flex-wrap items-center justify-start gap-1'>
                      {person.roles.map((role, index) => (
                        <div
                          key={index}
                          className='rounded-xl bg-indigo-200 px-2 text-center'>
                          {role.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='hidden md:table-cell'>{person.status}</td>

                  <td>
                    <TableDropdown options={options} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const ViewProfile = ({
  user,
  open,
  setOpen,
}: {
  user: User;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className='min-w-[90vw] p-6'>
        <div className='mb-8'>
          <SectionHeading>View Profile</SectionHeading>
        </div>
        <section className=' shadow'>
          <div className='mb-6 grid grid-cols-6 gap-6 px-6 py-3'>
            <div className='col-span-6 sm:col-span-3'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                First name
              </label>
              <span>{user.firstName}</span>
            </div>
            <div className='col-span-6 sm:col-span-3'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Last name
              </label>
              <span className='mt-1'>{user.lastName}</span>
            </div>
            <div className='col-span-6 sm:col-span-4'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Email
              </label>
              <span className='mt-1'>{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className='col-span-6 sm:col-span-4'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Phone
                </label>
                <span className='mt-1'>
                  {formatPhoneNumber(user.phoneNumber ?? "")}
                </span>
              </div>
            )}
            <div className='col-span-6 sm:col-span-4'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Role(s)
              </label>
              <div className='flex flex-wrap gap-2'>
                {user.roles.map((role) => (
                  <div
                    key={role.name}
                    className='flex items-center gap-2 rounded bg-indigo-100 py-1 px-2'>
                    {role.name}
                  </div>
                ))}
              </div>
            </div>
            <div className='col-span-6 sm:col-span-4'>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Status
              </label>
              <span className='mt-1'>{user.status}</span>
            </div>
          </div>
        </section>
      </div>
      <BottomButtons>
        <BtnPurple func={() => setOpen(false)}>Close</BtnPurple>
      </BottomButtons>
    </Modal>
  );
};
