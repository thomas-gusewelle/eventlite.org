import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
	createBrowserClient(process.env.DATABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	)

