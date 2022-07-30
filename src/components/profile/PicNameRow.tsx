import { User } from ".prisma/client";
import { fullName } from "../../utils/fullName";
import { Avatar } from "./avatar";

export const PicNameRow: React.FC<{ user: User | null }> = ({ user }) => {
	if (user == null) {
		return null;
	}
	return (
		<div className="flex items-center">
			<Avatar user={user} />
			<p className="md:text-xl text-gray-800 text-base leading-4 ml-2">
				{fullName(user.firstName, user.lastName)}
				{/* {user.firstName} */}
			</p>
		</div>
	);
};
