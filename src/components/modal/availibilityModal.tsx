import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

export const AvaililityModal: React.FC<{
  userId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  exisitingDates: Availability[];
  setExisitingDates: Dispatch<SetStateAction<Availability[]>>;
}> = ({ userId, open, setOpen, exisitingDates, setExisitingDates }) => {
  const methods = useForm();
  const [dates, setDates] = useState<Date[]>(
    exisitingDates
      .map((item) => item.date)
      .sort((a, b) => a.getTime() - b.getTime())
  );
  const [deletedDates, setDeletedDates] = useState<Date[]>([]);
  const opts = trpc.useContext();

  //TODO: fix display of dates below calendar
  // useEffect(() => {
  //   console.log(exisitingDates);
  //   setNewDates(
  //     newDates.filter((date) =>
  //       exisitingDates.map((item) => item.date).includes(date)
  //     )
  //   );
  // }, [exisitingDates, newDates]);

  const updateAvailibility = trpc.avalibility.updateUserAvalibility.useMutation(
    {
      onSuccess() {
        setOpen(false);
        opts.refetchQueries(["avalibility.getUserAvalibilityByID"]);
        opts.refetchQueries(["events.getUpcomingEventsByUser"]);
      },
    }
  );

  const submit = () => {
    const newDates = dates.filter(
      (date) =>
        !exisitingDates
          .map((item) => item.date.getTime())
          .includes(date.getTime())
    );

    const deleteDates = exisitingDates.filter(
      (date) =>
        !dates.map((item) => item.getTime()).includes(date.date.getTime())
    );

    updateAvailibility.mutate({
      userId: userId,
      newDates: newDates,
      deleteDates: deleteDates?.map((item) => item.date) ?? [],
    });
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <form onSubmit={submit} className='max-h-[90vh] overflow-scroll'>
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
                        // onChange(date);
                        if (date) {
                          //checks if the date is included in the new dates list already and removes it. Triggered when a user clicks on a date already highlighted

                          if (
                            dates
                              .map((item) => item.getTime())
                              .includes(date.getTime())
                          ) {
                            setDates(
                              dates.filter(
                                (item) => item.getTime() != date.getTime()
                              )
                            );
                          } else {
                            setDates([...dates, date]);
                          }
                        }
                      }}
                      highlightDates={dates}
                      inline
                      className='customDate m-0 block w-full rounded-l border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none'
                    />
                  </div>
                )}
              />

              <div className='flex flex-col justify-center gap-3'>
                {dates.map((date, index) => (
                  <div key={index} className='grid grid-cols-[2fr_.5fr] gap-3'>
                    <span>{date.toDateString()}</span>
                    <button
                      className='text-red-600'
                      onClick={(e) => {
                        e.preventDefault();
                        setDates(
                          dates.filter(
                            (item) => item.getTime() != date.getTime()
                          )
                        );
                      }}>
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
