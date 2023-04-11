import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { BtnPurple } from "../../components/btn/btnPurple";
import { SliderBtn } from "../../components/btn/SliderBtn";
import { Divider } from "../../components/divider";
import { SectionHeading } from "../../components/headers/SectionHeading";
import { sidebar } from "../../components/layout/sidebar";
import { EmailChange } from "../../components/modal/userSettings/emailChange";
import { UserContext } from "../../providers/userProvider";

const UserSettingsPage = () => {
  const user = useContext(UserContext);
  if (user == undefined || user == null) return
  const [hidePhoneNum, setHidePhoneNum] = useState(user.UserSettings?.hidePhoneNum ?? false)
  const [openEditEmail, setOpenEditEmail] = useState(false)
  const [reminderEmails, setReminderEmails] = useState(user.UserSettings?.sendReminderEmail ?? true)
  const [openEditPassword, setOpenEditPassword] = useState(false)
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
        {createPortal(<EmailChange open={openEditEmail} setOpen={setOpenEditEmail} />, document.body)}
        <div className="mt-3 flex justify-between items-center">
          <h3 className="text-xl font-bold">Password</h3>
          <p>*********</p>
          <div className="w-min">
            <BtnPurple>Edit</BtnPurple>
          </div>
        </div>

        <Divider />
      </section>
      <section>
        <SectionHeading>Privacy</SectionHeading>
        <div className="flex items-center justify-between mt-3">
          <h3 className="text-xl font-bold">Hide Phone Number</h3>
          <SliderBtn isChecked={hidePhoneNum} setIsChecked={setHidePhoneNum} />
        </div>
        <Divider />
      </section>
      <section>
        <SectionHeading>Notifications</SectionHeading>
        <div className="flex items-center justify-between mt-3">
          <h3 className="text-xl font-bold">Reminder Emails</h3>
          <SliderBtn isChecked={reminderEmails} setIsChecked={setReminderEmails} />
        </div>
      </section>
    </div>
  )
}
UserSettingsPage.getLayout = sidebar;
export default UserSettingsPage;
