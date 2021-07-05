export type ClassArray = Array<ClassData>;

export class ClassData {
    public name: string;
    public grade: string;
    public teacher: string;
    public students: [];
    public id: number;

    constructor(data) {
        this.name = data.name;
        this.grade = data.grade;
        this.teacher = data.teacher;
        this.id = data.id;
    }
}

export class NewClassData {
    public grade: string;
    public name: string;
    public teacherUserName: string;

    constructor(data) {
        this.name = data.name;
        this.grade = data.grade;
        this.teacherUserName = data.teacherUserName;
    }
}

export class AddStudentToClassData {
    public classId: string;
    public studentUsername: string;

    constructor(data) {
        this.classId = data.id;
        this.studentUsername = data.studentUsername;
    }

}
