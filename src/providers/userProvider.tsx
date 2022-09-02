import { User, UserSettings } from "@prisma/client";
import { createContext } from "react";
import { trpc } from "../utils/trpc";

export const UserContext = createContext<
	| (User & {
			UserSettings: UserSettings | null;
	  })
	| null
	| undefined
>(null);

export const UserProvider = (props: any) => {
	const { data, isLoading, error } = trpc.useQuery(["user.getUser"]);

	return (
		<UserContext.Provider value={data}>{props.children}</UserContext.Provider>
	);
};
