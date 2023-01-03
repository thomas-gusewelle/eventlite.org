import { Role, UserStatus } from "@prisma/client";

export interface UserFormValues {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | undefined | null;
  roles: Role[];
  status: UserStatus;
}
