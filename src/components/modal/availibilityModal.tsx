import { Dispatch, SetStateAction, useState } from "react";
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

export const AvaililityModal: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  exisitingDates: Date[];
  setExisitingDates: Dispatch<SetStateAction<Date[]>>;
}> = ({ open, setOpen, exisitingDates, setExisitingDates }) => {
  const methods = useForm();
  const [newDates, setNewDates] = useState<Date[]>([]);
  const [deletedDates, setDeletedDates] = useState<Date[]>([]);

  const updateAvailibility = trpc.useMutation(
    "avalibility.updateUserAvalibility",
    {
      onSuccess() {
        setOpen(false);
      },
    }
  );

  const submit = methods.handleSubmit((data) => {});

  return (
    <Modal open={open} setOpen={setOpen}>
      <ModalBody>
        <ModalTitle text={"Add Unavailable Dates"} />
        <form onSubmit={submit} className='h-max min-h-[250px]'>
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
                      onChange={(date) => {
                        onChange(date);
                        if (date) {
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
                          } else {
                            setNewDates([...newDates, date]);
                          }
                        }
                      }}
                      highlightDates={[...exisitingDates, ...newDates]}
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
        </form>
      </ModalBody>
      <BottomButtons>
        <BtnSave type={"submit"} />
        <BtnCancel
          onClick={() => {
            setOpen(false);
          }}
        />
      </BottomButtons>
    </Modal>
  );
};
