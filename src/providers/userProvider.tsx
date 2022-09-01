import { createContext } from "react";
import { trpc } from "../utils/trpc";

export const userContext = createContext();

const userProvider = () => {
	const { data, isLoading, error } = trpc.useQuery(["user.getUser"]);
};
