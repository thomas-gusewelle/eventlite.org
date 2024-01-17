import { useEffect, useState } from "react";
import { CircularProgress } from "../../circularProgress";

// TODO: add in ability to create org on load
// need server functionallity linked in
export const CreateAccountIdentifier = () => {
  const [text, setText] = useState("Getting everything ready...");
  // useEffect(() => {
  //   setTimeout(() => {setText("creating your account... ")}, 2000)
  // })
  return (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress />
      <p className="mt-3">{text}</p>
    </div>
  );
};
