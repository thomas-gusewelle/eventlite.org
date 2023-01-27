import { Fragment, ReactElement, useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";
import {
  MdSpaceDashboard,
  MdPeopleAlt,
  MdWorkspaces,
  MdEvent,
  MdSchedule,
  MdPermContactCalendar,
} from "react-icons/md";
import { FaChurch } from "react-icons/fa";
import Link from "next/link";
import { IconType } from "react-icons";
import { Avatar } from "../profile/avatar";

import { fullName } from "../../utils/fullName";
import Head from "next/head";
import { UserContext } from "../../providers/userProvider";
import { AlertProvider } from "../../providers/alertProvider";
import { ErrorAlert } from "../alerts/errorAlert";
import { SuccdssAlert } from "../alerts/successAlert";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

import { classNames } from "../../utils/classnames";
import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

type SideLink = {
  name: string;
  href: string;
  show: boolean;
  icon: IconType;
}[];

export const SidebarLayout: React.FC<{ children: any }> = ({ children }) => {
  const [sideLinks, setSideLinks] = useState<SideLink>([]);
  const [show, setShow] = useState(false);
  const windowWidth = useWindowWidth();
  const router = useRouter();
  const user = useContext(UserContext);
  const supaUser = useUser();

  //Push to dashboard if not logged in || TODO: Move this to be server side
  useEffect(() => {
    if (!supaUser.user && !supaUser.isLoading) {
      router.push("/");
    }
  }, [router, supaUser.user, supaUser.isLoading]);

  useEffect(() => {
    if (user != undefined) {
      setSideLinks([
        {
          name: "Dashboard",
          href: "/dashboard",
          show: true,
          icon: MdSpaceDashboard,
        },
        {
          name: "Schedule",
          href: "/schedule?cursor=",
          show: user?.status == "ADMIN",
          icon: MdSchedule,
        },
        { name: "Events", href: "/events", show: true, icon: MdEvent },
        {
          name: "Availability",
          href: "/availability",
          show: true,
          icon: MdPermContactCalendar,
        },
        { name: "People", href: "/people", show: true, icon: MdPeopleAlt },
        {
          name: "Locations",
          href: "/locations",
          show: user?.status == "ADMIN",
          icon: FaChurch,
        },
        {
          name: "Roles",
          href: "/roles",
          show: user?.status == "ADMIN",
          icon: MdWorkspaces,
        },
      ]);
    }
  }, [user]);

  // uses window width to set show to false on tranisiting from mobile to full screen
  useEffect(() => {
    if (windowWidth > 1024) {
      setShow(false);
    }
    if (show) {
      document.body.style.overflow = "hidden";
    }
    if (!show) {
      document.body.style.overflow = "auto";
    }
  }, [show, windowWidth]);

  if (user == undefined || user == null) {
    return <></>;
  }

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <div className='h-full w-full bg-white'>
        <div className='flex-no-wrap flex'>
          {/* Sidebar starts */}
          <div className='absolute hidden max-h-full min-h-screen w-64 bg-gray-100 shadow lg:relative lg:block'>
            <div
              onClick={() => router.push("/dashboard")}
              className='flex h-16 w-full cursor-pointer items-center gap-3 px-4 text-indigo-600'>
              <div className='w-10'>
                <svg
                  fill='currentColor'
                  id='Layer_2'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 950 596.2'>
                  <g id='Layer_1-2'>
                    <path d='m0,317.76c.62,153.03,125.29,278.44,278.45,278.44s278.44-124.9,278.44-278.44v-39.31c0-63.22,51.44-114.66,114.65-114.66s114.67,51.44,114.67,114.66c0,18.09,14.66,32.76,32.75,32.76h98.28c18.09,0,32.75-14.67,32.75-32.76C950,124.91,825.1,0,671.56,0s-278.45,124.91-278.45,278.45v39.31c0,63.23-51.44,114.65-114.65,114.65s-114.66-51.42-114.66-114.65c0-18.09-14.67-32.76-32.76-32.76H32.76c-18.09,0-32.76,14.67-32.76,32.76Z' />
                  </g>
                </svg>
              </div>
              {/* <img src='/images/logo1.svg'></img> */}
              <h1 className='text-2xl font-bold tracking-wide'>
                EventLite.org
              </h1>
            </div>
            <ul className=' py-6'>
              {sideLinks.map((link, index) => {
                if (link.show) {
                  return (
                    <Link key={index} href={link.href as any}>
                      <a onClick={() => setShow(false)}>
                        <li
                          key={index}
                          className={`${
                            router.asPath == link.href
                              ? "text-indigo-700"
                              : "text-gray-500"
                          } cursor-pointer pl-6  pb-4 pt-5 text-sm leading-3 tracking-normal focus:text-indigo-700 focus:outline-none`}>
                          <div className='flex items-center'>
                            <div>
                              <link.icon size={20}></link.icon>
                            </div>
                            <span className='ml-2'>{link.name}</span>
                          </div>
                        </li>
                      </a>
                    </Link>
                  );
                }
              })}
            </ul>
          </div>
          {/*Mobile responsive sidebar*/}
          <div
            className={`
							${
                show
                  ? "absolute z-40 h-full w-full  translate-x-0  transform "
                  : "   absolute z-40 h-full w-full  -translate-x-full transform"
              } 200ms transform ease-out`}
            id='mobile-nav'>
            <div
              className='absolute h-full w-full bg-gray-800 opacity-50 lg:hidden'
              onClick={() => setShow(!show)}
            />
            <div className='absolute z-40 h-full w-72 bg-gray-100 pb-4 shadow transition duration-150 ease-in-out sm:relative md:w-96 lg:hidden'>
              <div className='flex h-full w-full flex-col justify-between'>
                <div>
                  <div className='flex items-center justify-start px-4'>
                    <div className='flex h-16 w-full items-center gap-3 text-indigo-600'>
                      <div className='w-10'>
                        <svg
                          fill='currentColor'
                          id='Layer_2'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 950 596.2'>
                          <g id='Layer_1-2'>
                            <path d='m0,317.76c.62,153.03,125.29,278.44,278.45,278.44s278.44-124.9,278.44-278.44v-39.31c0-63.22,51.44-114.66,114.65-114.66s114.67,51.44,114.67,114.66c0,18.09,14.66,32.76,32.75,32.76h98.28c18.09,0,32.75-14.67,32.75-32.76C950,124.91,825.1,0,671.56,0s-278.45,124.91-278.45,278.45v39.31c0,63.23-51.44,114.65-114.65,114.65s-114.66-51.42-114.66-114.65c0-18.09-14.67-32.76-32.76-32.76H32.76c-18.09,0-32.76,14.67-32.76,32.76Z' />
                          </g>
                        </svg>
                      </div>
                      {/* <img  src='/images/logo1.svg'></img> */}
                      <h1 className='text-2xl font-bold tracking-wide'>
                        EventLite.org
                      </h1>
                      {/* <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={144}
                            height={30}
                            viewBox='0 0 144 30'>
                            <path
                              fill='#5F7DF2'
                              d='M80.544 9.48c1.177 0 2.194.306 3.053.92.86.614 1.513 1.45 1.962 2.507.448 1.058.673 2.247.673 3.568 0 1.303-.233 2.473-.699 3.51-.465 1.037-1.136 1.851-2.012 2.444-.876.592-1.885.888-3.028.888-1.405 0-2.704-.554-3.897-1.663v4.279h2.64v3.072h-9.14v-3.072h2.26V12.78H70.45V9.657h6.145v1.663l.209-.21c1.123-1.087 2.369-1.63 3.74-1.63zm17.675 0c1.176 0 2.194.306 3.053.92.859.614 1.513 1.45 1.961 2.507.449 1.058.673 2.247.673 3.568 0 1.303-.233 2.473-.698 3.51-.466 1.037-1.136 1.851-2.012 2.444-.876.592-1.886.888-3.028.888-1.405 0-2.704-.554-3.898-1.663v4.279h2.64v3.072h-9.14v-3.072h2.26V12.78h-1.904V9.657h6.144v1.663l.21-.21c1.122-1.087 2.368-1.63 3.739-1.63zM24.973 1c1.13 0 2.123.433 2.842 1.133 0 .004 0 .008.034.012 1.54 1.515 1.54 3.962-.034 5.472-.035.029-.069.058-.069.089-.719.65-1.712 1.05-2.773 1.05-.719 0-1.37.061-1.985.184-2.363.474-3.8 1.86-4.28 4.13-.114.489-.18 1.02-.2 1.59l-.003.176.001-.034.002.034c.022.505-.058 1.014-.239 1.495l-.076.182.064-.157c.106-.28.18-.575.217-.881l.008-.084-.026.195c-.286 1.797-1.858 3.188-3.754 3.282l-.204.005h-.103l-.103.002h-.034c-.65.012-1.232.072-1.78.181-2.328.473-3.765 1.863-4.279 4.139-.082.417-.142.863-.163 1.339l-.008.362v.23c0 2.02-1.603 3.681-3.661 3.861L4.16 29l-.48-.01c-.958-.073-1.849-.485-2.499-1.113-1.522-1.464-1.573-3.808-.152-5.33l.152-.154.103-.12c.719-.636 1.677-1.026 2.704-1.026.754 0 1.404-.062 2.02-.184 2.362-.475 3.8-1.86 4.28-4.126.136-.587.17-1.235.17-1.942 0-.991.411-1.896 1.027-2.583.069-.047.137-.097.172-.15.068-.051.102-.104.17-.159.633-.564 1.498-.925 2.408-.978l.229-.007h.034c.068 0 .171.003.274.009.616-.014 1.198-.074 1.746-.18 2.328-.474 3.766-1.863 4.279-4.135.082-.44.142-.912.163-1.418l.008-.385v-.132c0-2.138 1.78-3.872 4.005-3.877zm-.886 10c1.065 0 1.998.408 2.697 1.073.022.011.03.024.042.036l.025.017v.015c1.532 1.524 1.532 3.996 0 5.52-.034.03-.067.06-.067.09-.7.655-1.665 1.056-2.697 1.056-.7 0-1.332.062-1.932.186-2.298.477-3.696 1.873-4.163 4.157-.133.591-.2 1.242-.2 1.95 0 1.036-.399 1.975-1.032 2.674l-.1.084c-.676.679-1.551 1.055-2.441 1.13l-.223.012-.366-.006c-.633-.043-1.3-.254-1.865-.632-.156-.096-.296-.201-.432-.315l-.2-.177v-.012c-.734-.735-1.133-1.72-1.133-2.757 0-2.078 1.656-3.793 3.698-3.899l.198-.005h.133c.666-.007 1.266-.069 1.832-.185 2.265-.476 3.663-1.874 4.163-4.161.08-.442.139-.916.159-1.424l.008-.387v-.136c0-2.153 1.731-3.899 3.896-3.904zm3.882 11.025c1.375 1.367 1.375 3.583 0 4.95s-3.586 1.367-4.96 0c-1.345-1.367-1.345-3.583 0-4.95 1.374-1.367 3.585-1.367 4.96 0zm94.655-12.672c1.405 0 2.628.323 3.669.97 1.041.648 1.843 1.566 2.406 2.756.563 1.189.852 2.57.87 4.145h-9.954l.03.251c.132.906.476 1.633 1.03 2.18.605.596 1.386.895 2.343.895 1.058 0 2.09-.525 3.097-1.574l3.301 1.066-.203.291c-.69.947-1.524 1.67-2.501 2.166-1.075.545-2.349.818-3.821.818-1.473 0-2.774-.277-3.904-.831-1.13-.555-2.006-1.34-2.628-2.355-.622-1.016-.933-2.21-.933-3.58 0-1.354.324-2.582.971-3.682s1.523-1.961 2.628-2.583c1.104-.622 2.304-.933 3.599-.933zm13.955.126c1.202 0 2.314.216 3.339.648v-.47h3.034v3.91h-3.034l-.045-.137c-.317-.848-1.275-1.272-2.875-1.272-1.21 0-1.816.339-1.816 1.016 0 .296.161.516.483.66.321.144.791.262 1.409.355 1.735.22 3.102.536 4.1.946 1 .41 1.697.919 2.095 1.524.398.605.597 1.339.597 2.202 0 1.405-.48 2.5-1.441 3.282-.96.783-2.266 1.174-3.917 1.174-1.608 0-2.7-.321-3.275-.964V23h-3.098v-4.596h3.098l.032.187c.116.547.412.984.888 1.311.53.364 1.183.546 1.962.546.762 0 1.324-.087 1.688-.26.364-.174.546-.476.546-.908 0-.296-.076-.527-.228-.692-.153-.165-.447-.31-.883-.438-.435-.127-1.102-.27-2-.431-1.997-.313-3.433-.82-4.31-1.517-.875-.699-1.313-1.64-1.313-2.825 0-1.21.455-2.162 1.365-2.856.91-.695 2.11-1.042 3.599-1.042zm-69.164.178v10.27h1.98V23h-8.24v-3.072h2.032V12.78h-2.031V9.657h6.259zm-16.85-5.789l.37.005c1.94.05 3.473.494 4.6 1.335 1.198.892 1.797 2.185 1.797 3.878 0 1.168-.273 2.15-.819 2.945-.546.796-1.373 1.443-2.482 1.943l3.085 5.776h2.476V23h-5.827l-4.317-8.366h-2.183v5.116h2.4V23H39.646v-3.25h2.628V7.118h-2.628v-3.25h10.918zm61.329 0v16.06h1.892V23h-8.24v-3.072h2.082v-13h-2.082v-3.06h6.348zm-32.683 9.04c-.812 0-1.462.317-1.949.951-.486.635-.73 1.49-.73 2.565 0 1.007.252 1.847.756 2.52.503.673 1.161 1.01 1.974 1.01.838 0 1.481-.312 1.93-.934.448-.622.672-1.504.672-2.647 0-1.092-.228-1.942-.685-2.552-.457-.61-1.113-.914-1.968-.914zm17.675 0c-.813 0-1.463.317-1.95.951-.486.635-.73 1.49-.73 2.565 0 1.007.253 1.847.756 2.52.504.673 1.162 1.01 1.974 1.01.838 0 1.481-.312 1.93-.934.449-.622.673-1.504.673-2.647 0-1.092-.229-1.942-.686-2.552-.457-.61-1.113-.914-1.967-.914zM14.1 0C16.267 0 18 1.743 18 3.894v.01c0 2.155-1.733 3.903-3.9 3.903-4.166 0-6.3 2.133-6.3 6.293 0 2.103-1.667 3.817-3.734 3.9l-.5-.009c-.933-.075-1.8-.49-2.433-1.121C.4 16.134 0 15.143 0 14.1c0-2.144 1.733-3.903 3.9-3.903 4.166 0 6.3-2.133 6.3-6.294C10.2 1.751 11.934.005 14.1 0zm108.32 12.184c-.76 0-1.372.22-1.834.66-.46.44-.75 1.113-.87 2.018h5.561c-.118-.795-.442-1.44-.97-1.936-.53-.495-1.158-.742-1.886-.742zM49.525 7.118h-2.26v4.444h1.829c2.023 0 3.034-.754 3.034-2.26 0-.728-.233-1.274-.698-1.638-.466-.364-1.1-.546-1.905-.546zm15.821-3.593c.635 0 1.183.231 1.644.692.462.462.692 1.01.692 1.644 0 .677-.23 1.238-.692 1.682-.46.445-1.009.667-1.644.667-.643 0-1.195-.23-1.656-.692-.462-.461-.692-1.013-.692-1.657 0-.634.23-1.182.692-1.644.46-.461 1.013-.692 1.656-.692zM5.991 1.171c1.345 1.563 1.345 4.095 0 5.658-1.374 1.561-3.585 1.561-4.96 0-1.375-1.563-1.375-4.095 0-5.658 1.375-1.561 3.586-1.561 4.96 0z'
                            />
                            <path
                              d='M69 17.0551C69.0331 25.2688 75.7248 32 83.9453 32C92.1861 32 98.8902 25.2959 98.8902 17.0551V14.9453C98.8902 11.5521 101.651 8.79118 105.044 8.79118C108.438 8.79118 111.199 11.5521 111.199 14.9453C111.199 15.9163 111.986 16.7037 112.957 16.7037H118.232C119.203 16.7037 119.99 15.9163 119.99 14.9453C119.99 6.70457 113.286 0 105.045 0C96.8041 0 90.0995 6.70457 90.0995 14.9453V17.0551C90.0995 20.4489 87.3386 23.2088 83.9458 23.2088C80.5526 23.2088 77.7917 20.4489 77.7917 17.0551C77.7917 16.0842 77.0043 15.2968 76.0333 15.2968H70.7583C69.7874 15.2973 69 16.0842 69 17.0551Z'
                              fill=''
                            />
                          </svg> */}
                    </div>
                    <div
                      id='closeSideBar'
                      className='flex h-10 w-10 items-center justify-center'
                      onClick={() => setShow(!show)}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='icon icon-tabler icon-tabler-x'
                        width={20}
                        height={20}
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'>
                        <path stroke='none' d='M0 0h24v24H0z' />
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                      </svg>
                    </div>
                  </div>
                  <ul className=' py-6'>
                    {sideLinks.map((link, index) => {
                      if (link.show) {
                        return (
                          <Link key={index} href={link.href as any}>
                            <a onClick={() => setShow(false)}>
                              <li
                                className={`${
                                  router.asPath == link.href
                                    ? "text-indigo-700"
                                    : "text-gray-600"
                                } cursor-pointer pl-6  pb-4 pt-5 text-sm leading-3 tracking-normal hover:text-indigo-700 focus:text-indigo-700 focus:outline-none`}>
                                <div className='flex items-center'>
                                  <link.icon size={20}></link.icon>

                                  <span className='ml-2 text-base md:text-2xl xl:text-base'>
                                    {link.name}
                                  </span>
                                </div>
                              </li>
                            </a>
                          </Link>
                        );
                      }
                    })}
                  </ul>
                </div>
                <div className='w-full'>
                  <div className='border-t border-gray-300'>
                    <div className='flex w-full items-center justify-between px-6 pt-1'>
                      <div className='flex items-center'>
                        <Avatar user={user} />

                        <p className='ml-2 text-base leading-4 text-gray-800 md:text-xl'>
                          {fullName(user.firstName, user.lastName)}
                        </p>
                      </div>
                      <Menu
                        as='div'
                        className={"relative inline-block text-left"}>
                        <Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'>
                          <BiChevronRight aria-hidden='true' />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-100'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'>
                          <Menu.Items className='absolute right-0 bottom-[150%] z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <div className='py-1'>
                              <Menu.Item key={0}>
                                {({ active }) => (
                                  <button className='w-full text-left'>
                                    <Link href={`/people/view/${user.id}`}>
                                      <a
                                        onClick={() => setShow(false)}
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}>
                                        View Profile
                                      </a>
                                    </Link>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item key={1}>
                                {({ active }) => (
                                  <button className='w-full text-left'>
                                    <Link href={"/api/auth/logout"}>
                                      <a
                                        onClick={() => setShow(false)}
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}>
                                        Sign Out
                                      </a>
                                    </Link>
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Mobile responsive sidebar*/}
          {/* Sidebar ends */}
          <div className='w-full'>
            {/* Navigation starts */}
            <nav className='relative z-10 flex h-16 items-center justify-end bg-white shadow lg:items-stretch lg:justify-between'>
              <div className='hidden w-full pr-6 lg:flex'>
                <div className='hidden w-full lg:flex'>
                  <div className='flex w-full items-center justify-end pl-8'>
                    <div className='relative flex cursor-pointer items-center'>
                      <div className='rounded-full'>
                        <div className='relative'>
                          <Avatar user={user} />
                        </div>
                      </div>
                      <p className='mx-3 text-sm text-gray-800'>
                        {fullName(user.firstName, user.lastName)}
                      </p>
                      <Menu
                        as='div'
                        className={"relative inline-block text-left"}>
                        <Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'>
                          <BiChevronDown aria-hidden='true' />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-100'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'>
                          <Menu.Items className='absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <div className='py-1'>
                              <Menu.Item key={0}>
                                {({ active }) => (
                                  <button className='w-full text-left'>
                                    <Link href={`/people/view/${user.id}`}>
                                      <a
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}>
                                        View Profile
                                      </a>
                                    </Link>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item key={1}>
                                {({ active }) => (
                                  <button className='w-full text-left'>
                                    <Link href={"/api/auth/logout"}>
                                      <a
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm"
                                        )}>
                                        Sign Out
                                      </a>
                                    </Link>
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
              <div className='visible relative mr-8 ml-4 flex w-full items-center justify-between text-gray-600 lg:hidden'>
                <div
                  className='flex cursor-pointer gap-3 text-indigo-600'
                  onClick={() => router.push("/")}>
                  <svg
                    width={40}
                    fill='currentColor'
                    id='Layer_2'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 950 596.2'>
                    <g id='Layer_1-2'>
                      <path d='m0,317.76c.62,153.03,125.29,278.44,278.45,278.44s278.44-124.9,278.44-278.44v-39.31c0-63.22,51.44-114.66,114.65-114.66s114.67,51.44,114.67,114.66c0,18.09,14.66,32.76,32.75,32.76h98.28c18.09,0,32.75-14.67,32.75-32.76C950,124.91,825.1,0,671.56,0s-278.45,124.91-278.45,278.45v39.31c0,63.23-51.44,114.65-114.65,114.65s-114.66-51.42-114.66-114.65c0-18.09-14.67-32.76-32.76-32.76H32.76c-18.09,0-32.76,14.67-32.76,32.76Z' />
                    </g>
                  </svg>

                  <h1 className='text-2xl font-bold tracking-wide'>
                    EventLite.org
                  </h1>
                </div>
                {show ? (
                  " "
                ) : (
                  <>
                    <svg
                      onClick={() => setShow(!show)}
                      aria-label='Main Menu'
                      aria-haspopup='true'
                      xmlns='http://www.w3.org/2000/svg'
                      className='icon icon-tabler icon-tabler-menu cursor-pointer'
                      width={30}
                      height={30}
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <path stroke='none' d='M0 0h24v24H0z' />
                      <line x1={4} y1={8} x2={20} y2={8} />
                      <line x1={4} y1={16} x2={20} y2={16} />
                    </svg>
                  </>
                )}
              </div>
            </nav>
            {/* Navigation ends */}
            {/* Remove class [ h-64 ] when adding a card block */}
            <div className='pb-42 container mx-auto px-4 pt-4 pb-52 sm:pt-10 2xl:pb-10'>
              {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
              <AlertProvider>
                <div className='h-full w-full rounded'>
                  <>
                    <ErrorAlert />
                    <SuccdssAlert />
                    {children}
                  </>
                </div>
              </AlertProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const sidebar = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
