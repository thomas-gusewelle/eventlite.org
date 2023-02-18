import ConfirmEmail from "../accounts/ConfirmEmailNew";
import InviteCode from "../accounts/InviteCode";

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
