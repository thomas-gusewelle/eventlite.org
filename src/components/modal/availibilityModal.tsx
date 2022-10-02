import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "./modal";
import { ModalBody } from "./modalBody";
import { ModalTitle } from "./modalTitle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BottomButtons } from "./bottomButtons";
import { BtnSave } from "../btn/btnSave";
import { BtnCancel } from "../btn/btnCancel";
import { MdDelete } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import { Availability } from "@prisma/client";
import { UserContext } from "../../providers/userProvider";
import { ScheduleSelect } from "../form/scheduleSelect";
import { fullName } from "../../utils/fullName";
import { SingleSelect } from "../form/singleSelect";

export const AvaililityModal: React.FC<{
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  exisitingDates: Availability[];
  setExisitingDates: Dispatch<SetStateAction<Availability[]>>;
}> = ({ userId, open, setOpen, exisitingDates, setExisitingDates }) => {
  const methods = useForm();
  const [newDates, setNewDates] = useState<Date[]>([]);
  const [deletedDates, setDeletedDates] = useState<Date[]>([]);
  const opts = trpc.useContext();

  const updateAvailibility = trpc.useMutation(
    "avalibility.updateUserAvalibility",
    {
      onSuccess() {
        setOpen(false);
        opts.refetchQueries(["avalibility.getUserAvalibilityByID"]);
      },
    }
  );

  const submit = () => {
    updateAvailibility.mutate({
      userId: userId,
      newDates: newDates,
      deleteDates: deletedDates,
    });
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <form onSubmit={submit} className=' '>
        <ModalBody>
          <ModalTitle text={"Add Unavailable Dates"} />

          <div className='w-full'>
            {/* <label className="text-gray-700">End Date</label> */}
            <div className='mt-6 flex flex-col gap-3'>
              <Controller
                name='Date'
                control={methods.control}
                rules={{ required: true }}
                // defaultValue={{ start: new Date(), end: null }}
                defaultValue={null}
                render={({ field: { value, onChange } }) => (
                  <div className='customDate'>
                    <DatePicker
                      id='aDate'
                      autoComplete='off'
                      selected={null}
                      minDate={new Date()}
                      onChange={(date) => {
                        onChange(date);
                        if (date) {
                          //checks if the date is included in the new dates list already and removes it. Triggered when a user clicks on a date already highlighted
                          if (
                            newDates
                              .map((item) => item.getTime())
                              .includes(date.getTime())
                          ) {
                            setNewDates(
                              newDates.filter(
                                (_date) => _date.getTime() != date.getTime()
                              )
                            );
                            methods.setValue("Date", null);
                          } else if (
                            exisitingDates
                              .map((item) => item.date.getTime())
                              .includes(date.getTime())
                          ) {
                            setExisitingDates(
                              exisitingDates.filter(
                                (_date) =>
                                  _date.date.getTime() != date.getTime()
                              )
                            );
                            setDeletedDates([...deletedDates, date]);
                            methods.setValue("Date", null);
                          } else {
                            setNewDates([...newDates, date]);
                          }
                        }
                      }}
                      highlightDates={[
                        ...exisitingDates.map((item) => item.date),
                        ...newDates,
                      ]}
                      inline
                      className='customDate m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none'
                    />
                  </div>
                )}
              />

              <div className='flex flex-col justify-center gap-3'>
                {newDates.map((date, index) => (
                  <div key={index} className='grid grid-cols-[2fr_.5fr] gap-3'>
                    <span>{date.toDateString()}</span>
                    <button
                      className='text-red-600'
                      onClick={() =>
                        setNewDates(newDates.filter((item) => item != date))
                      }>
                      <MdDelete size={25} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* {methods.formState.errors.DDate && (
                            <span className="text-red-500">End Date Required</span>
                        )} */}
          </div>
        </ModalBody>
        <BottomButtons>
          <BtnSave
            type={"button"}
            onClick={() => {
              submit();
            }}
          />
          <BtnCancel
            onClick={() => {
              setOpen(false);
            }}
          />
        </BottomButtons>
      </form>
    </Modal>
  );
};
