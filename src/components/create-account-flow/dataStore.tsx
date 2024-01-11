import { CreateRouterInner } from "@trpc/server";
import {
  Context,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type CreateAccountForm = {
  orgID?: string;
  orgName: string;
  orgPhoneNumber?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};
export const CreateOrgContext = createContext<CreateAccountForm>({
  orgID: undefined,
  orgName: "",
  orgPhoneNumber: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

export function CreateOrgProvider({ children }: { children: any }) {
const value = {
  orgID: undefined,
  orgName: "",
  orgPhoneNumber: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
}
  useEffect(() => {
    console.log(value);
  }, [value])
  return (
    <CreateOrgContext.Provider
      value={value}
    ></CreateOrgContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(CreateOrgContext);

  //TODO: use this info to break each form into individual form allowing for me to not have to do custom validation.
  if (!context) {
    throw new Error("useAppState must be used within the AppProvider");
  }
  return context;
}
