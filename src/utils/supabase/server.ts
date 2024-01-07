import { createServerClient, serialize, type CookieOptions } from '@supabase/ssr'
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers'

export const createClient = (context: GetServerSidePropsContext) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return context.req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          context.res.setHeader(
            "Set-Cookie",
            serialize(name, value, options)
          );
        },
        remove(name: string, options: CookieOptions) {
          context.res.setHeader("Set-Cookie", serialize(name, "", options));
        },
      },
    }
  )
}


export const createApiClient = (req: NextApiRequest, res: NextApiResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name];
        },
        set(name: string, value: string, options: CookieOptions) {
          res.setHeader("Set-Cookie", serialize(name, value, options));
        },
        remove(name: string, options: CookieOptions) {
          res.setHeader("Set-Cookie", serialize(name, "", options));
        },
      },
    }
  )
}
