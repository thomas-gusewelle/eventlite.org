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
  orgId: string;
};
export const CreateOrgContext = createContext<
  | {
      state: CreateAccountForm;
      setState: Dispatch<SetStateAction<CreateAccountForm>>;
    }
  | undefined
>(undefined);

export function CreateOrgProvider({
  children,
  customerId,
  subId,
  tier,
}: {
  children: any;
  customerId: string;
  subId: string;
  tier: string;
}) {
  const value: CreateAccountForm = {
    orgName: "",
    orgPhoneNumber: "",
    firstName: "",
    lastName: "",
    email: "test@test.com",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
    tier: tier,
    stripeCustomerId: customerId,
    stripeSubscriptionId:subId,
    orgId: "",
  };
  const [state, setState] = useState(value);
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
