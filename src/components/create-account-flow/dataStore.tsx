//TODO: Must use setState or else data is erased
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type CreateAccountForm = {
  orgName: string;
  orgPhoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
};
export const CreateOrgContext = createContext<{state: CreateAccountForm, setState: Dispatch<SetStateAction<CreateAccountForm>>} | undefined>(undefined);

export function CreateOrgProvider({ children }: { children: any }) {
  const value: CreateAccountForm = {
    orgName: "",
    orgPhoneNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
  };
  const [state, setState] = useState(value);
  useEffect(() => {
    console.log(state);
  }, [state]);
  return <CreateOrgContext.Provider value={{state, setState}}>{children}</CreateOrgContext.Provider>;
}

export function useAppState() {
  const context = useContext(CreateOrgContext);

  //TODO: use this info to break each form into individual form allowing for me to not have to do custom validation.
  if (!context) {
    throw new Error("useAppState must be used within the AppProvider");
  }
  return context;
}
