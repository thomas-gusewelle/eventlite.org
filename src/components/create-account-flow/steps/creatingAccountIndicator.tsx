import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AlertContext } from "../../../providers/alertProvider";
import { api } from "../../../server/utils/api";
import { CircularProgress } from "../../circularProgress";
import { CreateOrgContext } from "../dataStore";

// TODO: add in ability to create org on load
// need server functionallity linked in
export const CreateAccountIdentifier = ({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const { state, setState } = useContext(CreateOrgContext)!;
  const { setError } = useContext(AlertContext)!;
  const createOrg = api.organization.createOrg.useMutation();
  const [text, _setText] = useState("Setting up your organization...");

  // used for creating the user and the organziation and then continueing to the pricing tier phase
  useEffect(() => {
    createOrg.mutate(
      {
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        phoneNumber: state.phoneNumber,
        password: state.password,
        status: "ADMIN",
        orgName: state.orgName,
        orgPhoneNumber: state.orgPhoneNumber,
        stripeCustomerId: state.stripeCustomerId,
      },
      {
        onSuccess(data, _variables, _context) {
          if (data.org && data.org.id) {
            // update state to include the org id.
            // This allows me to easily attach the org ID to the stripe customer object
            setState((prev) => ({ ...prev, orgId: data!.org!.id }));
            setStep(4);
          }
        },
        onError(_error, _variables, _context) {
          setError({
            state: true,
            message: "Error creating your account. Please try again.",
          });
          setStep(2);
        },
      }
    );
  }, []);
  return (
    <div className="flex flex-col items-center justify-center">
      <CircularProgress />
      <p className="mt-3">{text}</p>
    </div>
  );
};
