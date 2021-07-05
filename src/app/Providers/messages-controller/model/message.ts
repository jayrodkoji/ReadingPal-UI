export class Message {
    id: number;
    user_role: string;
    student_username: string;
    teacher_username: string;
    new_message: string;
    book_id: number;
    annotation_id: string;
    resolved: boolean;
    time_stamp: number;
    teacher_read: boolean;
    student_read: boolean;
}
