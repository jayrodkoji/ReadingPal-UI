import { IUser } from "./IUser";
import { UserRole } from "./UserRole";

export class User implements IUser {
  id: number;
  username: string;
  roles: UserRole[];
  password: string;

  profileimage: string;
  backgroundimage: string;

  constructor(
    id: number,
    username: string,
    roles: UserRole[],
    password: string,

    profileimage: string,
    backgroundimage: string) {
    this.id = id;
    this.username = username;
    this.roles = roles;
    this.password = password;
    this.profileimage = profileimage;
    this.backgroundimage = backgroundimage;
  }
  email: string;
  firstName: string;
  lastName: string;
   getName(): string {
        return `${this.username}`;
      }
}
