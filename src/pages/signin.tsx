import { router } from "@trpc/server";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn = () => {
  const user = useSession();
  const router = useRouter();
  if (user.status == "authenticated") {
    router.push("/dashboard");
    return <div></div>;
  }

  return (
    <button onClick={() => signIn("google")} className='m2 p2 bg-green-500'>
      Sign In WIth Google
    </button>
  );
};

export default SignIn;
