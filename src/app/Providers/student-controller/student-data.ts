import {ImageUtils} from "../../utils/image-utils";

export class StudentData
{
    public id: number;
    public username: string;
    public reading_level: number;
    public grade: string;

    // data: Object from the server's user GET request
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.reading_level = data.readingLevel;
        this.grade = data.grade;
    }
}

export class StudentAsUserData
{
    public backgroundImage: string;
    public emailAddress: string;
    public readingLevel: number;
    public firstName: string;
    public lastName: string;
    public profileImage: string;
    public username: string;
    public grade: string;

    // data: Object from the server's user GET request
    constructor(data) {
        this.backgroundImage = ImageUtils.convertDBImage(data.backgroundimage);
        this.emailAddress = data.emailAddress;
        this.readingLevel = data.readLevel;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.profileImage = ImageUtils.convertDBImage(data.profileimage);
        this.username = data.username;
        this.grade = data.grade;
    }
}