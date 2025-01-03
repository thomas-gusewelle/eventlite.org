import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineCalendarToday } from "react-icons/md";
import { yearsFromToday } from "../../server/utils/dateTimeModifers";
import { BtnCancel } from "../btn/btnCancel";
import { BtnPurple } from "../btn/btnPurple";

import DatePicker from "react-datepicker";
import { ErrorSpan } from "../errors/errorSpan";
import { BottomButtons } from "./bottomButtons";
import { Modal } from "./modal";
import { ModalBody } from "./modalBody";
import { ModalTitle } from "./modalTitle";
import { oneMonthInFuture } from "../dateTime/dates";
import { api } from "../../server/utils/api";
import { AlertContext } from "../../providers/alertProvider";
import { InviteLink, Role, User } from "@prisma/client";
import { NewMultiSelect } from "../form/multiSelect";
import { ListWithHide } from "../../../types/genericTypes";
import { fullName } from "../../utils/fullName";

type user = User & {
  InviteLink: InviteLink | null;
  roles: Role[];
};

export const EmailScheduleModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const methods = useForm<{
    startingDate: Date;
    endingDate: Date;
    includedUsers: { id: string; email: string }[];
  }>();
  const sendEmailMutatin = api.eventEmails.upcomingSchedule.useMutation();
  const { setSuccess, setError } = useContext(AlertContext);
  const [selectedUsers, setSelectedUsers] = useState<user[]>([]);

  let usersQuery = api.user.getActiveUsersByOrganization.useQuery(undefined);
  let allUsers: ListWithHide<user> =
    usersQuery.data == undefined
      ? []
      : usersQuery.data.map((u) => ({ item: u, hide: false }));

  const submit = methods.handleSubmit((data) => {
    sendEmailMutatin.mutate(
      {
        startingDate: data.startingDate,
        endingDate: data.endingDate,
        includedUsers: selectedUsers.map((u) => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          orgId: u.organizationId!,
        })),
      },
      {
        onSuccess() {
          setOpen(false),
            setSuccess({ state: true, message: "Emails successfully sent." });
        },
        onError(err) {
          setError({
            state: true,
            message: `Error sending emails. ${err.message}`,
          });
        },
      }
    );
  });
  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalBody>
        <ModalTitle text={"Email Schedule"} />
        <div className="py-3">
          <p>Please select the days for which to email the schedule.</p>

          <form onSubmit={submit} className="py-3">
            <label>Starting Date</label>
            <div>
              <Controller
                control={methods.control}
                name="startingDate"
                defaultValue={new Date()}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <div className="flex">
                      <DatePicker
                        id="starting-datepick"
                        selected={value}
                        onChange={onChange}
                        minDate={new Date()}
                        maxDate={yearsFromToday()}
                        className=" m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                      />

                      <div
                        onClick={() =>
                          document.getElementById("starting-datepick")?.focus()
                        }
                        className="flex cursor-pointer items-center rounded-r border border-l-0 border-gray-300 bg-gray-50 px-3 hover:text-indigo-700"
                      >
                        <MdOutlineCalendarToday size={20} />
                      </div>
                    </div>
                    {fieldState.error?.type == "required" && (
                      <ErrorSpan>Date Required</ErrorSpan>
                    )}
                  </>
                )}
              />
            </div>

            <label>Starting Date</label>
            <div>
              <Controller
                control={methods.control}
                name="endingDate"
                defaultValue={oneMonthInFuture()}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState }) => (
                  <>
                    <div className="flex">
                      <DatePicker
                        id="ending-datepick"
                        selected={value}
                        onChange={onChange}
                        minDate={new Date()}
                        maxDate={yearsFromToday()}
                        className=" m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                      />

                      <div
                        onClick={() =>
                          document.getElementById("ending-datepick")?.focus()
                        }
                        className="flex cursor-pointer items-center rounded-r border border-l-0 border-gray-300 bg-gray-50 px-3 hover:text-indigo-700"
                      >
                        <MdOutlineCalendarToday size={20} />
                      </div>
                    </div>
                    {fieldState.error?.type == "required" && (
                      <ErrorSpan>Date Required</ErrorSpan>
                    )}
                  </>
                )}
              />
            </div>
            <label className="block text-sm font-medium text-gray-700">
              People
            </label>
            <NewMultiSelect
              selected={selectedUsers}
              setSelected={setSelectedUsers}
              list={allUsers}
              label={(item) => fullName(item.firstName, item.lastName)}
            ></NewMultiSelect>
          </form>
        </div>
      </ModalBody>
      <BottomButtons>
        <BtnPurple onClick={submit}>Send</BtnPurple>
        <BtnCancel onClick={() => setOpen(false)} />
      </BottomButtons>
    </Modal>
  );
};
