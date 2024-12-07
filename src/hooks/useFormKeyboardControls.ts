import React from "react";

export function useFormKeyboardControls(onSubmit: Function) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      console.log("here")
      if (e.key == "Enter") {
        onSubmit();
      }
    };

    document.addEventListener("keydown", (e) => handleKey(e));

    return () =>{
      console.log("removed")
document.removeEventListener("keydown", (e) => handleKey(e));
    } 
  }, []);
}
