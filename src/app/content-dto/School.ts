import { ISchool } from './ISchool';
export class School implements ISchool {
    id: number;
    name: string;
    teacher_code: string;
    student_code: string;

  constructor(id: number,
              name: string,
              teacher_code: string,
              student_code: string,
              ) {
    this.id = id;
    this.name = name;
    this.teacher_code = teacher_code;
    this.student_code = student_code;
  }

  static fromData(data: any): ISchool {
    return new this(
      data.id,
      data.name,
      data.teacher_code,
      data.student_code);
  }
}
