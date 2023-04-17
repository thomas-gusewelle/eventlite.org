import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BtnPurple } from "../../components/btn/btnPurple";
import { BtnRed } from "../../components/btn/btnRed";
import { SliderBtn } from "../../components/btn/SliderBtn";
import { Divider } from "../../components/divider";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { sidebar } from "../../components/layout/sidebar";
import { EmailChange } from "../../components/modal/userSettings/emailChange";
import { PasswordChange } from "../../components/modal/userSettings/passwordChange";
import { AlertContext } from "../../providers/alertProvider";
import { UserContext } from "../../providers/userProvider";
import { api } from "../../server/utils/api";

const UserSettingsPage = () => {
  const user = useContext(UserContext);
  console.log(user);

  if (user == undefined || user == null) return
  const context = api.useContext()
  const router = useRouter()
  const { setError, setSuccess } = useContext(AlertContext)
  const [openEditEmail, setOpenEditEmail] = useState(false)
  const [openEditPassword, setOpenEditPassword] = useState(false)
  const hidePhoneNum = useRef(user.UserSettings?.hidePhoneNum ?? false)
  const reminderEmails = useRef(user.UserSettings?.sendReminderEmail ?? true)
  const changePhoneNumMutation = api.userSettings.changeHidePhoneNum.useMutation(
    {
      onError(err) {
        hidePhoneNum.current = user.UserSettings?.hidePhoneNum ?? false
        reminderEmails.current = user.UserSettings?.sendReminderEmail ?? true
        setError({ state: true, message: err.message })
      },
      onSuccess() {
        context.user.getUser.invalidate()
        setSuccess({ state: true, message: "Setting successfully saved" })
      }
    }
  )
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false)
  //TODO: finish implementing delete account flow and test it. Need to add success and error state
  const deleteAccount = api.userSettings.deleteAccount.useMutation({ onSuccess: () => router.push("/") })
  // const settingsMutation = () => { changePhoneNumMutation.mutate({ hidePhoneNum: hidePhoneNum, sendReminderEmail: reminderEmails }) }
  // const changeReminderEmailsMutation = api.userSettings.changeRemidnerEmails.useMutation()
  return (
    <div className="max-w-[960px] mx-auto">
      <section>
        <SectionHeading>Account</SectionHeading>
        <div className="mt-3 flex justify-between items-center">
          <h3 className="text-xl font-bold">Email</h3>
          <p>{user?.email}</p>
          <div className="w-min">
            <BtnPurple onClick={() => { setOpenEditEmail(true) }}>Edit</BtnPurple>
          </div>
        </div>
        {openEditEmail && createPortal(<EmailChange open={openEditEmail} setOpen={setOpenEditEmail} />, document.body)}
        <div className="mt-3 flex justify-between items-center">
          <h3 className="text-xl font-bold">Password</h3>
          <p>*********</p>
          <div className="w-min">
            <BtnPurple onClick={() => setOpenEditPassword(true)}>Edit</BtnPurple>
          </div>
        </div>
        {openEditPassword && createPortal(<PasswordChange open={openEditPassword} setOpen={setOpenEditPassword} />, document.body)}

        <Divider />
      </section>
      <section>
        <SectionHeading>Privacy</SectionHeading>
        <div className="flex items-center justify-between mt-3">
          <h3 className="text-xl font-bold">Hide Phone Number</h3>
          <SliderBtn mutation={() =>
            changePhoneNumMutation.mutate({ sendReminderEmail: reminderEmails.current, hidePhoneNum: hidePhoneNum.current })
          } isChecked={hidePhoneNum} />
        </div>
        <Divider />
      </section>
      <section>
        <SectionHeading>Notifications</SectionHeading>
        <div className="flex items-center justify-between mt-3">
          <h3 className="text-xl font-bold">Reminder Emails</h3>
          <SliderBtn mutation={() =>
            changePhoneNumMutation.mutate({ sendReminderEmail: reminderEmails.current, hidePhoneNum: hidePhoneNum.current })
          } isChecked={reminderEmails} />
        </div>
        <Divider />
      </section>
      <section>
        <BtnRed onClick={() => test.mutate()}>Delete Account</BtnRed>
      </section>
    </div>
  )
}
UserSettingsPage.getLayout = sidebar;
export default UserSettingsPage;
