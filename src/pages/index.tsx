import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { navbar } from "../components/marketing-site/layout/navbar";
import { BtnPurple } from "../components/btn/btnPurple";
import { BtnNeutral } from "../components/btn/btnNeutral";
import { Tab } from "@headlessui/react";
import { classNames } from "../utils/classnames";
import { shortDate } from "../components/dateTime/dates";
import { shortTime } from "../components/dateTime/times";
import { PicNameRowSmall } from "../components/profile/PicNameRow";
import { UserStatus } from "@prisma/client";
import { BtnApprove } from "../components/btn/btnApprove";
import { BtnDeny } from "../components/btn/btnDeny";
import { useState } from "react";
import { TableDropdown } from "../components/menus/tableDropdown";

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
  const [eventUserResponse, setEventUserResponse] = useState<boolean | null>(
    null
  );
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

        <div className='mt-6'>
          <Tab.Group>
            <Tab.List className='flex space-x-1 rounded-xl bg-neutral-600/50 p-1'>
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
                      : "text-neutral-300 hover:bg-white/[0.12] hover:text-white"
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
                      : "text-neutral-300 hover:bg-white/[0.12] hover:text-white"
                  )
                }>
                Availability
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
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
                    <div className='grid grid-cols-2 overflow-hidden rounded-b-lg border-b border-r border-l'>
                      <BtnApprove
                        func={() => {
                          setEventUserResponse(true);
                        }}
                      />
                      <BtnDeny
                        func={() => {
                          setEventUserResponse(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </Tab.Panel>
              <Tab.Panel>Content 2</Tab.Panel>
              <Tab.Panel>Content 3</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </>
  );
};

Home.getLayout = navbar;

export default Home;
