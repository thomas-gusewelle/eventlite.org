import { createContext, Dispatch, SetStateAction, useState } from "react";

interface AlertContextTypes {
  error: {
    state: boolean;
    message: string;
  };
  setError: Dispatch<
    SetStateAction<{
      state: boolean;
      message: string;
    }>
  >;
  success: {
    state: boolean;
    message: string;
  };
  setSuccess: Dispatch<
    SetStateAction<{
      state: boolean;
      message: string;
    }>
  >;
}

export const AlertContext = createContext<AlertContextTypes>({
  error: { state: false, message: "" },
  setError: () => {},
  success: { state: false, message: "" },
  setSuccess: () => {},
});

export const AlertProvider = (props: any) => {
  const [error, setError] = useState({ state: false, message: "" });
  const [success, setSuccess] = useState({ state: false, message: "" });
  return (
    <AlertContext.Provider value={{ error, setError, success, setSuccess }}>
      {props.children}
    </AlertContext.Provider>
  );
};
