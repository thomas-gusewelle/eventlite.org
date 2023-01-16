import { inviteCodeEmailString } from "../../emails/inviteCode";

const InviteEmailTest = () => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: inviteCodeEmailString("Preston Hollow Presbyterian Church", ""),
      }}></div>
  );
};

export default InviteEmailTest;
