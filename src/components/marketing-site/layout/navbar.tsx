import { ReactElement } from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import Head from "next/head";
import { BtnPurple } from "../../btn/btnPurple";
import { BtnNeutral } from "../../btn/btnNeutral";
import { useRouter } from "next/router";

type SideLink = {
  name: string;
  href: string;
  show: boolean;
  icon: IconType;
}[];

const NavbarLayout: React.FC<{ children: any }> = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      {/* Navigation starts */}
      <nav className='relative z-10 flex h-16 items-center justify-end bg-white shadow lg:items-stretch lg:justify-between'>
        <div className='container mx-auto flex w-full items-center justify-between pl-8'>
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

          <ul className='relative mr-6 flex cursor-pointer items-center gap-3'>
            <li>
              <BtnPurple func={() => router.push("/create-account")}>
                Sign Up
              </BtnPurple>
            </li>
            <li>
              <BtnNeutral func={() => router.push("/signin")}>Login</BtnNeutral>
            </li>
          </ul>
        </div>
      </nav>
      {/* Navigation ends */}

      <div className='pb-42 h-full bg-white sm:pt-10 2xl:pb-10'>
        <div className='h-full w-full rounded'>
          <>{children}</>
        </div>
      </div>
    </>
  );
};

export const navbar = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
