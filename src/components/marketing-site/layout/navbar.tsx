import { ReactElement, useEffect, useState } from "react";
import { IconType } from "react-icons";
import Head from "next/head";
import { useRouter } from "next/router";
import { MdMenu, MdClose, MdCopyright } from "react-icons/md";
import { BtnPurple } from "../../btn/btnPurple";
import { BtnNeutral } from "../../btn/btnNeutral";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowWidth } from "../../../hooks/useWindowWidth";

const NavbarLayout: React.FC<{ children: any }> = ({ children }) => {
  const router = useRouter();
  const [showMobile, setShowMobile] = useState(false);
  const windowWidth = useWindowWidth();
  const links = [
    { name: "Home", href: "" },
    { name: "Features", href: "#features" },
    { name: "Roadmap", href: "#roadmap" },
  ];
  // Takes window width and automatically closes mobile menu on resize
  useEffect(() => {
    if (windowWidth > 768) {
      setShowMobile(false);
    }
  }, [windowWidth]);
  return <>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Head>

    {/* Navigation starts */}
    <nav className='relative z-10 flex h-16 items-center justify-end bg-white shadow lg:items-stretch lg:justify-between'>
      <div className='container relative mx-auto flex w-full items-center justify-between px-2'>
        <div className='flex items-center gap-3 text-indigo-600'>
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
          <h1 className='text-2xl font-bold tracking-wide'>EventLite.org</h1>
        </div>
        {/* Mobile Nav */}
        <div className='md:hidden'>
          {showMobile == false && (
            <MdMenu
              size={40}
              className=' cursor-pointer text-gray-500'
              onClick={() => setShowMobile(true)}
            />
          )}
        </div>
        <AnimatePresence>
          {showMobile && (
            <motion.div
              initial={{ opacity: 0, translateX: "100%" }}
              animate={{ opacity: 1, translateX: "-50%" }}
              exit={{ opacity: 0, translateX: "100%" }}
              className={`absolute top-0 left-1/2 mx-auto min-h-[30%] w-[95%] -translate-x-1/2 rounded-xl bg-gray-800`}>
              <div
                className={`py-6 px-6 text-white md:flex md:items-center md:text-black`}>
                <div className='flex items-start justify-between md:hidden'>
                  <div className='mb-9 flex gap-3'>
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
                    <h1 className='text-2xl font-bold tracking-wide'>
                      EventLite.org
                    </h1>
                  </div>
                  <MdClose
                    size={40}
                    onClick={() => setShowMobile(false)}
                    className='cursor-pointer'
                  />
                </div>
                <ul className='relative mr-6 flex cursor-pointer flex-col gap-3 md:flex-row md:items-center'>
                  {links.map((link, index) => (
                    <li
                      onClick={() => setShowMobile(false)}
                      key={index}
                      className='w-fit rounded-lg px-2 font-medium transition-all duration-200 ease-in-out hover:bg-gray-100/10 hover:ring-1 hover:ring-white'>
                      <Link href={link.href} legacyBehavior>{link.name}</Link>
                    </li>
                  ))}
                  <li className='mt-6 md:mt-0 md:ml-6'>
                    <BtnPurple
                      fullWidth
                      func={() => router.push("/create-account")}>
                      Join the Beta
                    </BtnPurple>
                  </li>
                  <li>
                    <BtnNeutral fullWidth func={() => router.push("/signin")}>
                      Login
                    </BtnNeutral>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Desktop Nav */}
        <div className='hidden scroll-smooth md:block'>
          <ul className='flex gap-3 lg:gap-6'>
            {links.map((link, index) => (
              <li
                key={index}
                className='rounded-lg px-3 font-medium text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-600/10 hover:ring-1 hover:ring-gray-200'>
                <Link href={link.href} legacyBehavior>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='item-center hidden gap-3 md:flex '>
          <BtnPurple func={() => router.push("/create-account")}>
            Join the Beta
          </BtnPurple>
          <BtnNeutral func={() => router.push("/signin")}>Login</BtnNeutral>
        </div>
      </div>
    </nav>
    {/* Navigation ends */}

    <div className='h-full bg-white sm:pt-10'>
      <div className='h-full w-full rounded'>
        <>{children}</>
      </div>
    </div>
    <footer className='flex flex-col items-center justify-center gap-3 py-6 shadow lg:flex-row lg:justify-around'>
      <div className='flex items-center gap-3 text-indigo-600'>
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
        <h1 className='text-2xl font-bold tracking-wide'>EventLite.org</h1>
      </div>
      <div className='flex items-center gap-1'>
        <MdCopyright />
        <span>2023 EventLight.org, All Rights Reserved</span>
      </div>
    </footer>
  </>;
};

export const navbar = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
