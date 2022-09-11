import { SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LimitSelect } from "../components/form/limitSelect";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";

import { AvaililityModal } from "../components/modal/availibilityModal";
import { trpc } from "../utils/trpc";

const AvailabilityPage = () => {
  const [limit, setLimit] = useState(4);
  const [modalOpen, setModalOpen] = useState(true);
  const [dates, setDates] = useState<Date[]>([]);

  const getDatesQuery = trpc.useQuery(["avalibility.getUserAvalibility"], {
    onSuccess(data) {
      console.log("this is the data: ", data);
      setDates(data?.map((item) => item.date) ?? []);
    },
  });
  return (
    <>
      <div className='mb-8 flex justify-between gap-4 md:hidden'>
        <SectionHeading>Unavaliable Dates</SectionHeading>
        <div>
          <span></span>
          <LimitSelect selected={limit} setSelected={setLimit} />
        </div>
      </div>
      <div className='mb-8 hidden justify-between md:flex'>
        <SectionHeading>Unavailable Dates</SectionHeading>
        <div>
          <LimitSelect selected={limit} setSelected={setLimit} />
        </div>
      </div>

      <AvaililityModal
        open={modalOpen}
        setOpen={setModalOpen}
        exisitingDates={dates}
        setExisitingDates={setDates}
      />

      <button onClick={() => setModalOpen(true)}>show</button>
    </>
  );
};

AvailabilityPage.getLayout = sidebar;

export default AvailabilityPage;
