import { Dispatch, SetStateAction, useState } from "react";

export const SuccdssAlert: React.FC<{
	error: { state: boolean; message: string };
	setState: Dispatch<
		SetStateAction<{
			state: boolean;
			message: string;
		}>
	>;
}> = ({ error, setState }) => {
	const [flag, setFlag] = useState(true);

	if (error.state == true) {
		setTimeout(() => {
			setState({ state: false, message: "" });
		}, 3500);
	}
	return (
		<div className="absolute right-0 top-6 z-50 text-red-600">
			{/* Code block starts */}

			<div className="flex items-center justify-center px-4 sm:px-0 ">
				<div
					id="alert"
					className={
						flag
							? "top-0 mt-12 mb-8 items-center justify-between rounded-md border border-red-500 bg-red-200  py-4 px-4 shadow  transition duration-150 ease-in-out md:flex lg:w-10/12 "
							: "translate-hidden top-0 mt-12 mb-8 items-center justify-between rounded-md border border-red-500  bg-red-200 py-4 px-4  shadow transition duration-150 ease-in-out md:flex lg:w-10/12"
					}>
					<div className="items-center sm:flex">
						<div className="flex items-end">
							<div className="mr-2 mt-0.5 text-red-600 sm:mt-0">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width={22}
									height={22}
									fill="currentColor">
									<path
										className="heroicon-ui"
										d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 9a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
									/>
								</svg>
							</div>
							<p className="mr-2 text-base font-bold ">Error</p>
						</div>
						<div className="mr-2 hidden  h-1 w-1 rounded-full xl:block" />
						<p className="text-base ">{error.message}</p>
					</div>
					<div className="mt-4 flex justify-end md:mt-0 md:pl-4 lg:pl-0">
						<span
							onClick={() => setState({ state: false, message: "" })}
							className="cursor-pointer text-sm text-black">
							Dismiss
						</span>
					</div>
				</div>
			</div>

			{/* Code block ends */}
			<style>
				{`
              .translate-show{
                  transform : translateY(0%);
              }
              .translate-hide{
                  transform : translateY(18vh);
              }
              `}
			</style>
		</div>
	);
};
