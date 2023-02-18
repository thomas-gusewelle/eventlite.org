import ConfirmEmail from "../accounts/ConfirmEmailNew";
import InviteCode from "../accounts/InviteCode";
import ResetPassword from "../accounts/ResetPassword";

export function confirmEmail() {
  return <ConfirmEmail link='eventlite.org' />;
}

export function inviteCode() {
  return (
    <InviteCode
      orgName={"Preston Hollow Presbyterian Church"}
      invideCode={""}
      email={""}
    />
  );
}

export function resetPassword() {
  return <ResetPassword code='1234' />;
}
