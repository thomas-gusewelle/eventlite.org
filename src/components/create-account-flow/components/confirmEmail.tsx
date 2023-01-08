import { BtnPurple } from "../../btn/btnPurple";
import { CardHeader } from "./cardHeader";

export const ConfirmEmail = ({ email }: { email: string }) => {
  return (
    <>
      <CardHeader>Please confirm your email</CardHeader>
      <p className='my-6 text-center'>
        Please check your email for a confirmation email and click the button to
        confirm your email. If you do not see the email you can click the button
        below to resend the email.
      </p>
      <BtnPurple>Resend Confirmation</BtnPurple>
    </>
  );
};
