import { UserRole } from './UserRole';

export interface IUser {
    id: number;
    username: string;
    roles: UserRole[];
    password: string;
    email: string;
    firstName: string;
    lastName: string;

    profileimage: string;
    backgroundimage: string;
}
