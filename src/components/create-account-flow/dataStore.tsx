import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type CreateAccountForm = {
  orgName: string;
  orgPhoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  tier: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  orgId: string,
};
export const CreateOrgContext = createContext<
  | {
    state: CreateAccountForm;
    setState: Dispatch<SetStateAction<CreateAccountForm>>;
  }
  | undefined
>(undefined);

export function CreateOrgProvider({ children }: { children: any }) {
  const value: CreateAccountForm = {
    orgName: "",
    orgPhoneNumber: "",
    firstName: "",
    lastName: "",
    email: "test@test.com",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
    tier: "price_1OWkdjKjgiEDHq2AOHNwODgi",
    stripeCustomerId: "cus_PTI2Sgue1oShvj",
    stripeSubscriptionId: "sub_1OeLSpKjgiEDHq2Agl7ZmBpb",
    orgId: ""
  };
  const [state, setState] = useState(value);
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <CreateOrgContext.Provider value={{ state, setState }}>
      {children}
    </CreateOrgContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(CreateOrgContext);

  if (!context) {
    throw new Error("useAppState must be used within the AppProvider");
  }
  return context;
}
