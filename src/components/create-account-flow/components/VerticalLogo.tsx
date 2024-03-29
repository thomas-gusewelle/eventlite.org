import { useRouter } from "next/router";

export const VerticalLogo = () => {
  const router = useRouter();
  return (
    <div
      className='mb-12 flex cursor-pointer flex-col items-center'
      onClick={() => router.push("/")}>
      <svg
        width={188}
        height={32}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M69 17.0551C69.0331 25.2688 75.7248 32 83.9453 32C92.1861 32 98.8902 25.2959 98.8902 17.0551V14.9453C98.8902 11.5521 101.651 8.79118 105.044 8.79118C108.438 8.79118 111.199 11.5521 111.199 14.9453C111.199 15.9163 111.986 16.7037 112.957 16.7037H118.232C119.203 16.7037 119.99 15.9163 119.99 14.9453C119.99 6.70457 113.286 0 105.045 0C96.8041 0 90.0995 6.70457 90.0995 14.9453V17.0551C90.0995 20.4489 87.3386 23.2088 83.9458 23.2088C80.5526 23.2088 77.7917 20.4489 77.7917 17.0551C77.7917 16.0842 77.0043 15.2968 76.0333 15.2968H70.7583C69.7874 15.2973 69 16.0842 69 17.0551Z'
          fill='white'
        />
      </svg>
      <h1 className='mt-2 text-center text-4xl font-bold tracking-wide text-white'>
        EventLite.org
      </h1>
    </div>
  );
};
