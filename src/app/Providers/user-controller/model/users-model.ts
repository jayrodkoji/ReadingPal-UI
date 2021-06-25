export class User {
  public _id?: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public password: string;

  // data: Object from the server's user GET request
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
  }
}
