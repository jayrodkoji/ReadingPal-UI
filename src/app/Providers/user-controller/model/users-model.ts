import { ImageUtils } from "../../../utils/image-utils";

export class UsersModel {
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public password: string;
  public avatar: string;
  public backgroundImage: string;
  public roles: Role[];

  // data: Object from the server's user GET request
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.avatar = ImageUtils.convertDBImage(data.avatar);
    this.backgroundImage = ImageUtils.convertDBImage(data.backgroundImage);
    this.roles = data.roles;
  }
}

export class Role {
  id: string;
  type: string;

  constructor(data) {
    this.id = data.id;
    this.type = data.type;
  }
}
