export class Message {
    id: number;
    userRole: string;
    studentUsername: string;
    teacherUsername: string;
    newMessage: string;
    bookId: number;
    annotationId: string;
    resolved: boolean;
    timeStamp: number;
    teacherRead: boolean;
    studentRead: boolean;
}
