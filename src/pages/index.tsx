import { getUser } from "@supabase/auth-helpers-nextjs";
import { navbar } from "../components/marketing-site/layout/navbar";
import { BtnPurple } from "../components/btn/btnPurple";
import { Tab } from "@headlessui/react";
import { classNames } from "../utils/classnames";
import Image from "next/future/image";
import { longDate, shortDate } from "../components/dateTime/dates";
import { shortTime } from "../components/dateTime/times";
import { PicNameRow, PicNameRowSmall } from "../components/profile/PicNameRow";
import { UserStatus } from "@prisma/client";
import { BtnApprove } from "../components/btn/btnApprove";
import { BtnDeny } from "../components/btn/btnDeny";
import { useEffect, useRef, useState } from "react";
import { TableDropdown } from "../components/menus/tableDropdown";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import {
  MdAccountCircle,
  MdSchedule,
  MdOutlineFilterAlt,
} from "react-icons/md";
import { RiPagesFill } from "react-icons/ri";

export async function getServerSideProps(context: any) {
  const user = await getUser(context);

  if (user.user && !user.error) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }
  return {
    props: {},
  };
}

const eventData = {};

const Home = () => {
  const iconSize = 50;

  return (
    <>
      <section
        id='hero-section'
        className='container mx-auto grid px-3 lg:grid-cols-2'>
        <div>
          <div id='hero-text-container' className='mt-6  text-4xl font-bold'>
            <h1>Volunteer scheduling</h1>
            <h1 className='text-indigo-600'>organized and simple</h1>
          </div>
          <p className='my-3 md:text-center'>
            Higher quality, lower latency, creator focused video calls. Ping is
            the best way to bring your guests into OBS.
          </p>

          <BtnPurple fullWidth={true}>Join the Beta Now</BtnPurple>
        </div>

        <div className='mt-6 shadow'>
          <Image alt='' src={"/images/hero-image.jpg"} className='w-full' />
        </div>
      </section>
      <section className=' mt-9 bg-gray-100 py-9 text-gray-900'>
        {/* Panel 1 */}
        <div className='container mx-auto grid px-3 md:grid-cols-2'>
          <div className='mb-3'>
            <h2 className='text-3xl font-extrabold'>
              Keep everyone
              <span className='text-indigo-700'> in the loop</span>
            </h2>
            <p className='mt-1 text-gray-500'>
              No more hoping your volunteers read their emails or keeping track
              of the schedule with a spreadsheet. Simply create an event and
              schedule your volunteers keeping everyone in the loop.
            </p>
            <div className=' mt-6 flex items-start gap-3'>
              <div>
                <MdSchedule size={iconSize} className='text-indigo-700' />
              </div>
              <div>
                <h3 className='text-xl font-bold'>
                  Instant scheduling by default
                </h3>
                <p className='text-gray-500'>
                  Your volunteers see their schedule the moment you schedule
                  them. Allowing them to easy approve any new scheduled events.
                </p>
              </div>
            </div>
            <div className='mt-6 flex items-start gap-3'>
              <div>
                <RiPagesFill size={iconSize} className='text-indigo-700' />
              </div>
              <div>
                <h3 className='text-xl font-bold'>Everyone on the same page</h3>
                <p className='text-gray-500'>
                  Your entire team can see your events, ensuring that everyone
                  is on the same page.
                </p>
              </div>
            </div>
          </div>
          <EventsTab />
        </div>
      </section>
      {/* Panel 2 */}
      <section className=' mt-6 px-8 py-6'>
        <div className='container mx-auto grid md:grid-cols-2'>
          <div>
            <h2 className='text-3xl font-extrabold'>
              Centered on <span className='text-indigo-700'>people</span>
            </h2>
            <p className='mt-3 text-neutral-800'>
              People are at the core of what we do. With EventLite we make
              managing your team as simple and easy as possible.
            </p>
            <div className='mt-6 flex items-start gap-3'>
              <div>
                <MdOutlineFilterAlt
                  size={iconSize}
                  className='text-indigo-600'
                />
              </div>
              <div>
                <h3 className='text-xl font-bold'>
                  Smart filtering made simple
                </h3>
                <p>
                  Finding who you need shouldn&apos;t be hard. We make searching
                  for people as simple as possible.
                </p>
              </div>
            </div>
            <div className='mt-6 flex items-start gap-3'>
              <div>
                <MdAccountCircle size={iconSize} className='text-indigo-600' />
              </div>
              <div>
                <h3 className='text-xl font-bold'>Easily manage roles</h3>
                <p>
                  Managing volunteer roles should be easy. Simly select the
                  roles and never have to think about it again.
                </p>
              </div>
            </div>
          </div>
          <PoepleTab />
        </div>
      </section>
      {/* Panel 3 */}
      <section className=' mt-6 bg-indigo-700 px-8 py-9 text-white'>
        <div className=''>
          <h2 className='text-3xl font-bold'>
            Scheduling <span className='text-indigo-200'>without the fear</span>
          </h2>
          <p className='mt-3 text-indigo-200'>
            Keep tracking of availability can be a chore. EventLite allows your
            volunteers to set their availability without you having to worry.
          </p>
          <div className='mt-6 flex items-start gap-3'>
            <div>
              <MdAccountCircle size={iconSize} className='text-indigo-600' />
            </div>
            <div>
              <h3 className='text-xl font-bold'>High definition by default</h3>
              <p>
                HD isn&apos;t optional for our creators. We support up to 1080p
                at 60fps for every caller (if you have the bandwidth for it).
              </p>
            </div>
          </div>
          <div className='mt-6 flex items-start gap-3'>
            <div>
              <MdAccountCircle size={iconSize} className='text-indigo-600' />
            </div>
            <div>
              <h3 className='text-xl font-bold'>High definition by default</h3>
              <p>
                HD isn&apos;t optional for our creators. We support up to 1080p
                at 60fps for every caller (if you have the bandwidth for it).
              </p>
            </div>
          </div>
          <AvailabilityTab />
        </div>
      </section>
    </>
  );
};

Home.getLayout = navbar;

export default Home;

const EventsTab = () => {
  const [eventUserResponse, setEventUserResponse] = useState<boolean | null>(
    null
  );
  const [name, setName] = useState("Your Name");

  return (
    <div className='relative flex flex-col border-gray-300 pt-4'>
      <div className='absolute -right-10 top-3 rotate-[10deg] rounded-lg bg-indigo-200 px-4 py-2 text-black'>
        Approve your schedule
      </div>
      <div
        className={`round overflow-hidden rounded-lg border bg-white pt-2 text-black shadow`}>
        <div className='mb-4 flex flex-col px-3'>
          <div className='flex justify-between'>
            <h3 className='text-xl font-bold'>Event Name</h3>
            {eventUserResponse != null && (
              <TableDropdown
                options={[
                  {
                    name: "Undo",
                    function: () => setEventUserResponse(null),
                  },
                ]}
              />
            )}
          </div>

          <span className='text-lg font-medium'>Location Name</span>
          <span>{shortDate(new Date())}</span>
          <span>{shortTime(new Date())}</span>
        </div>
        <div className=''>
          {[
            {
              id: 1,
              Role: { name: "Audio" },
              User: {
                firstName: "Your",
                lastName: "Name",
                id: "",
                status: "USER" as UserStatus,
                email: "",
                emailVerified: null,
                phoneNumber: null,
                image: null,
                organizationId: null,
                hasLogin: false,
                userSettingsId: null,
              },
              userResponse: eventUserResponse,
            },
            {
              id: 2,
              Role: { name: "Video" },
              User: {
                firstName: "John",
                lastName: "Manning",
                id: "",
                status: "USER" as UserStatus,
                email: "",
                emailVerified: null,
                phoneNumber: null,
                image: null,
                organizationId: null,
                hasLogin: false,
                userSettingsId: null,
              },
              userResponse: false,
            },
            {
              id: 3,
              Role: { name: "Slides" },
              User: {
                firstName: "Kathy",
                lastName: "Lee",
                id: "",
                status: "USER" as UserStatus,
                email: "",
                emailVerified: null,
                phoneNumber: null,
                image: null,
                organizationId: null,
                hasLogin: false,
                userSettingsId: null,
              },
              userResponse: true,
            },
          ].map((position) => {
            // TODO: implement input field for entering name
            if (position.id == 1) {
              return (
                <div
                  className='grid grid-cols-[1fr_1.5fr] items-center border-t last:pb-0'
                  key={position.id}>
                  <span className='py-3 px-3 font-medium'>
                    {position.Role.name}
                  </span>
                  {position.User ? (
                    <div
                      className={`flex h-full py-1 px-3 text-center ${
                        position.userResponse == null && "bg-gray-100"
                      }
            ${position.userResponse == true && "bg-green-200"}
            ${position.userResponse == false && "bg-red-200"}
  `}>
                      {/* <PicNameRowSmall user={position?.User} /> */}
                      <div className='flex items-center'>
                        <div className=' flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'>
                          {name
                            .split(" ")
                            .map((i) => i[0])
                            .join("")
                            .toLocaleUpperCase()}
                        </div>
                        {/* <input
                          className='wrap ml-2 flex-wrap overflow-visible bg-gray-100'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        /> */}
                        {/* TODO: make this work better. On blur is sort of a fix. I would love to have an input that wraps like the div does */}
                        <div
                          onBlur={(e) => {
                            console.log(e);
                            setName(e.currentTarget.textContent ?? "");
                          }}
                          className='ml-2'
                          contentEditable
                          suppressContentEditableWarning>
                          {name}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='flex h-full items-center justify-center bg-gray-100 py-3 px-6 text-center leading-4'></div>
                  )}
                </div>
              );
            }
            return (
              <div
                className='grid grid-cols-[1fr_1.5fr] items-center border-t last:pb-0'
                key={position.id}>
                <span className='py-3 px-3 font-medium'>
                  {position.Role.name}
                </span>
                {position.User ? (
                  <div
                    className={`flex h-full py-1 px-3 text-center ${
                      position.userResponse == null && "bg-gray-100"
                    }
              ${position.userResponse == true && "bg-green-200"}
              ${position.userResponse == false && "bg-red-200"}
    `}>
                    <PicNameRowSmall user={position?.User} />
                  </div>
                ) : (
                  <div className='flex h-full items-center justify-center bg-gray-100 py-3 px-6 text-center leading-4'></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {eventUserResponse == null && (
        <div className='mt-3 grid grid-cols-2 gap-3 overflow-hidden'>
          <div className='grid w-full overflow-hidden rounded-lg shadow'>
            <BtnApprove
              func={() => {
                setEventUserResponse(true);
              }}
            />
          </div>
          <div className='grid w-full overflow-hidden rounded-xl shadow'>
            <BtnDeny
              func={() => {
                setEventUserResponse(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const PoepleTab = () => {
  return (
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
          {[
            {
              firstName: "Betty",
              lastName: "Green",
              id: "bgreen@email.com",
              status: "USER" as UserStatus,
              email: "",
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
              email: "",
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
              email: "",
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
          ].map((person, index) => {
            const options: TableOptionsDropdown = [
              {
                name: "View Profile",
                function: () => {},
              },

              {
                name: "Edit",
                function: () => {},
              },
              {
                name: "Delete",
                function: () => {},
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
  );
};

const AvailabilityTab = () => {
  const [dates, setDates] = useState<
    {
      date: Date;
    }[]
  >([]);
  useEffect(() => {
    const numOccurances = Math.floor(Math.random() * 2) + 3;
    let array: { date: Date }[] = [];
    for (let i = 1; i <= numOccurances; i++) {
      const randomFuture = Math.floor(Math.random() * 10) * 7;
      const date = new Date();
      date.setDate(randomFuture);
      const newDate = new Date(date.setDate(date.getDate() - date.getDay()));
      array.push({ date: newDate });
    }
    setDates(array.sort((a, b) => a.date.getTime() - b.date.getTime()));
  }, []);

  return (
    <div className='mt-6 w-full rounded-lg bg-white px-3 py-3 text-black shadow'>
      <table className='w-full table-auto text-left'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((date, index) => {
            const options: TableOptionsDropdown = [
              {
                name: "Delete",
                function: () => {
                  if (dates.length > 1) {
                    setDates(
                      dates.filter(
                        (item) => item.date.getTime() != date.date.getTime()
                      )
                    );
                  }
                },
              },
            ];

            return (
              <tr key={index} className='border-t last:border-b'>
                <td className='py-4 text-base leading-4 text-gray-800 md:text-xl'>
                  {longDate(date.date)}
                </td>
                <td className=''>
                  {dates.length > 1 && <TableDropdown options={options} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
