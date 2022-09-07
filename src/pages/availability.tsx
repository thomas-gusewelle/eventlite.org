import { useState } from "react";
import { useForm } from "react-hook-form";
import { LimitSelect } from "../components/form/limitSelect";
import { SectionHeading } from "../components/headers/SectionHeading";
import { sidebar } from "../components/layout/sidebar";
import { Modal } from "../components/modal/modal";
import { ModalBody } from "../components/modal/modalBody";
import { ModalTitle } from "../components/modal/modalTitle";

const AvailabilityPage = () => {
	const [limit, setLimit] = useState(4);
	const [modalOpen, setModalOpen] = useState(true);
	const methods = useForm();

	return (
		<>
			<div className="mb-8 flex justify-between gap-4 md:hidden">
				<SectionHeading>Unavaliable Dates</SectionHeading>
				<div>
					<span></span>
					<LimitSelect selected={limit} setSelected={setLimit} />
				</div>
			</div>
			<div className="mb-8 hidden justify-between md:flex">
				<SectionHeading>Unavailable Dates</SectionHeading>
				<div>
					<LimitSelect selected={limit} setSelected={setLimit} />
				</div>
			</div>

			<Modal open={modalOpen} setOpen={setModalOpen}>
				<ModalBody>
					<ModalTitle text={"Add Unavailable Dates"} />
					<form></form>
				</ModalBody>
			</Modal>
		</>
	);
};

AvailabilityPage.getLayout = sidebar;

export default AvailabilityPage;
