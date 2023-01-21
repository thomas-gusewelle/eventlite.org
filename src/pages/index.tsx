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
import { useState } from "react";
import { TableDropdown } from "../components/menus/tableDropdown";
import { TableOptionsDropdown } from "../../types/tableMenuOptions";
import { MdAccountCircle } from "react-icons/md";

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
        className='container mx-auto grid px-8 lg:grid-cols-2'>
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
          {/* <Tab.Group>
            <Tab.List className='flex space-x-1 rounded-xl bg-neutral-200/50 p-1'>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-600",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white shadow"
                      : "text-neutral-300 hover:bg-white/[0.12] hover:text-white"
                  )
                }>
                Events
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-600",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white shadow"
                      : "text-neutral-400 hover:bg-white/[0.12] hover:text-white"
                  )
                }>
                People
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-600",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white shadow"
                      : "text-neutral-400 hover:bg-white/[0.12] hover:text-white"
                  )
                }>
                Availability
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <EventsTab />
              </Tab.Panel>
              <Tab.Panel>
                <PoepleTab />
              </Tab.Panel>
              <Tab.Panel>
                <AvailabilityTab />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group> */}
        </div>
      </section>
      <section className=' mt-6 grid bg-indigo-700 px-8 py-6'>
        {/* Panel 1 */}
        <div className='container mx-auto grid text-white sm:grid-cols-2'>
          <div>
            <h2 className='text-3xl font-bold'>
              Keep everyone in the <span className='text-indigo-700'>loop</span>
            </h2>
            <p className='mt-3 text-neutral-100'>
              Getting your guests onto your show is as easy as sending them a
              link. No more leaked join codes - you can see who&apos;s joining
              by their Twitch username.
            </p>
            <div className='mt-6 flex items-start gap-3'>
              <MdAccountCircle size={iconSize} className='text-indigo-600' />
              <div>
                <h3 className='text-xl font-bold'>
                  High definition by default
                </h3>
                <p>
                  HD isn&apos;t optional for our creators. We support up to
                  1080p at 60fps for every caller (if you have the bandwidth for
                  it).
                </p>
              </div>
            </div>
            <div className='mt-6 flex items-start gap-3'>
              <MdAccountCircle size={iconSize} className='text-indigo-600' />
              <div>
                <h3 className='text-xl font-bold'>
                  High definition by default
                </h3>
                <p>
                  HD isn&apos;t optional for our creators. We support up to
                  1080p at 60fps for every caller (if you have the bandwidth for
                  it).
                </p>
              </div>
            </div>
          </div>
          <EventsTab />
        </div>
      </section>
      {/* Panel 2 */}
      <section>
        <div className='mt-9'>
          <h2 className='text-3xl font-bold'>
            Keep everyone in the <span className='text-indigo-700'>loop</span>
          </h2>
          <p className='mt-3 text-neutral-800'>
            Getting your guests onto your show is as easy as sending them a
            link. No more leaked join codes - you can see who&apos;s joining by
            their Twitch username.
          </p>
          <div className='mt-6 flex items-start gap-3'>
            <MdAccountCircle size={iconSize} className='text-indigo-600' />
            <div>
              <h3 className='text-xl font-bold'>High definition by default</h3>
              <p>
                HD isn&apos;t optional for our creators. We support up to 1080p
                at 60fps for every caller (if you have the bandwidth for it).
              </p>
            </div>
          </div>
          <div className='mt-6 flex items-start gap-3'>
            <MdAccountCircle size={iconSize} className='text-indigo-600' />
            <div>
              <h3 className='text-xl font-bold'>High definition by default</h3>
              <p>
                HD isn&apos;t optional for our creators. We support up to 1080p
                at 60fps for every caller (if you have the bandwidth for it).
              </p>
            </div>
          </div>
          <PoepleTab />
        </div>
        {/* Panel 3 */}
        <div className='mt-9'>
          <h2 className='text-3xl font-bold'>
            Keep everyone in the <span className='text-indigo-700'>loop</span>
          </h2>
          <p className='mt-3 text-neutral-800'>
            Getting your guests onto your show is as easy as sending them a
            link. No more leaked join codes - you can see who&apos;s joining by
            their Twitch username.
          </p>
          <div className='mt-6 flex items-start gap-3'>
            <MdAccountCircle size={iconSize} className='text-indigo-600' />
            <div>
              <h3 className='text-xl font-bold'>High definition by default</h3>
              <p>
                HD isn&apos;t optional for our creators. We support up to 1080p
                at 60fps for every caller (if you have the bandwidth for it).
              </p>
            </div>
          </div>
          <div className='mt-6 flex items-start gap-3'>
            <MdAccountCircle size={iconSize} className='text-indigo-600' />
            <div>
              <h3 className='text-xl font-bold'>High definition by default</h3>
              <p>
                HD isn&apos;t optional for our creators. We support up to 1080p
                at 60fps for every caller (if you have the bandwidth for it).
              </p>
            </div>
          </div>
          {/* <AvailabilityTab /> */}
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
  return (
    <div className='flex flex-col border-gray-300 pt-4'>
      <div
        className={`rounded-t-lg pt-2 ${
          eventUserResponse == null ? "" : "rounded-b-lg border-b"
        } round border-t border-r border-l shadow`}>
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
                firstName: "Betty",
                lastName: "Green",
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
              Role: { name: "Audio" },
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
              Role: { name: "Audio" },
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
            return (
              <div
                className='grid grid-cols-[1fr_1.5fr] items-center border-t last:border-b last:pb-0'
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
          <div className='grid w-full overflow-hidden rounded-lg'>
            <BtnApprove
              func={() => {
                setEventUserResponse(true);
              }}
            />
          </div>
          <div className='grid w-full overflow-hidden rounded-xl'>
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
  const numOccurances = Math.floor(Math.random() * 5) + 2;
  let array: { date: Date }[] = [];
  for (let i = 1; i <= numOccurances; i++) {
    const randomFuture = Math.floor(Math.random() * 10) * 7;
    const date = new Date();
    date.setDate(randomFuture);
    const newDate = new Date(date.setDate(date.getDate() - date.getDay()));
    array.push({ date: newDate });
  }
  const [dates, setDates] = useState(
    array.sort((a, b) => a.date.getTime() - b.date.getTime())
  );
  return (
    <div className='mt-4 w-full'>
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
