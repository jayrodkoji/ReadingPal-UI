export class User {
  public _id?: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public profileImageKey: string;
  public roles: [string];

  // data: Object from the server's user GET request
  constructor(data) {
    this._id = data?._id ;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.username = data?.username;
    this.email = data?.email;
    this.profileImageKey = data?.profileImageKey;
    this.roles = data?.roles
  }
}

export class UpdateUser {
  public firstName?: string;
  public lastName?: string;
  public username?: string;
  public email?: string;
  public profileImageKey?: string;
  public roles?: [string];

  // data: Object from the server's user GET request
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.username = data.username;
    this.email = data.email;
    this.profileImageKey = data.profileImageKey;
    this.roles = data?.roles;

  }
}

export class NewUser {
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public profileImageKey?: string;
  public roles!: [string];

  // data: Object from the server's user GET request
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.username = data.username;
    this.email = data.email;
    this.profileImageKey = data.profileImageKey ? data.profileImageKey : '';
    this.roles = data?.roles
  }
}
