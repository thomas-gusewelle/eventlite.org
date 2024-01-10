import { Context, createContext, Dispatch, SetStateAction, useContext, useState } from "react";

export const CreateOrgContext = createContext<{state: any, setState: Dispatch<SetStateAction<any>>} | undefined>(undefined);

export function CreateOrgProvider({ children }: {children: any}) {
  const [state, setState] = useState({});
  
  return (
  <CreateOrgContext.Provider value={{state, setState}}></CreateOrgContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(CreateOrgContext);
  if (!context) {
    throw new Error("useAppState must be used within the AppProvider");
  }
  return context;
}
