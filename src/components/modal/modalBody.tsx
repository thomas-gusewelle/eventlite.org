export const ModalBody: React.FC<{ children: any }> = ({ children }) => {
	return (
		<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
			<div className="">
				<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
					{children}
				</div>
			</div>
		</div>
	);
};
