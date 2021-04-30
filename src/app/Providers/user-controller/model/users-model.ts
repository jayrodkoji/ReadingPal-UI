import {ImageUtils} from "../../../rp-utils/image-utils";

export class UsersModel
{
    public backgroundimage: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public profileimage: string;
    public username: string;
    public password: string;
    public roles: Role[];

    // data: Object from the server's user GET request
    constructor(data) {
        this.backgroundimage = ImageUtils.convertDBImage(data.backgroundimage);
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.profileimage = ImageUtils.convertDBImage(data.profileimage);
        this.username = data.username;
        this.password = data.password;
        this.roles = data.roles;
    }
}

export class Role
{
    id: string;
    m_dt: string;
    m_user: string;
    s_dt: string;
    s_user: string;
    type: string;

    constructor(data) {
        this.id = data.id;
        this.m_dt = data.m_dt;
        this.m_user = data.m_user;
        this.s_dt = data.s_dt;
        this.s_user = data.s_user;
        this.type = data.type;
    }
}
