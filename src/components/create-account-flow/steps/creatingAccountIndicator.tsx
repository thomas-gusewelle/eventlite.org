import { CircularProgress } from "../../circularProgress";

// TODO: add in ability to create org on load
export const CreateAccountIdentifier = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress />
      <p className="mt-3">Creating your organization...</p>
    </div>
  );
};
