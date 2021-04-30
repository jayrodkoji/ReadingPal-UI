export type CompletedLessonArray = Array<CompletedLessonData>;

export class CompletedLessonData {
    public color: string;
    public comprehension: number;
    public firstName: string;
    public grade: string;
    public id: number;
    public lastName: string;
    public lessonsDoneThisWeek: number;
    public readingLessons: number;
    public readingLessons80Plus: number;
    public streak: number;
    public totalTimeSpentReading: number;
    public totalWordsRead: number;
    public totalWordsRead80Plus: number;
    public userName: string;
    public wpm: number;

    constructor(data) {
        this.color = data.color;
        this.comprehension = data.comprehension;
        this.firstName = data.firstName;
        this.grade = data.grade;
        this.id = data.id;
        this.lastName = data.lastName;
        this.lessonsDoneThisWeek = data.lessonsDoneThisWeek;
        this.readingLessons = data.readingLessons;
        this.readingLessons80Plus = data.readingLessons80Plus;
        this.streak = data.streak;
        this.totalTimeSpentReading = data.totalTimeSpentReading;
        this.totalWordsRead = data.totalWordsRead;
        this.totalWordsRead80Plus = data.totalWordsRead80Plus;
        this.userName = data.userName;
        this.wpm = data.wpm;
    }
}

export class SavedLessonData {

    public amountCorrect: number;
    public id: number;
    public score: number;
    public totalQuestions: number;
    public wordsRead: number;
    public wpm: number;

    constructor (data) {
        this.amountCorrect = data.amountCorrect;
        this.id = data.id;
        this.score = data.score;
        this.totalQuestions = data.totalQuestions;
        this.wordsRead = data.wordsRead;
        this.wpm = data.wpm;
    }
}