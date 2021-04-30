export type LessonArray = Array<LessonData>;

export class QuizOverview {
    constructor(
      public quizId: number,
      public title: string,
      public numQuestions: number) {
    }
}

export class CategorizedQuizOverviews {
    constructor(
      public vocabulary: Array<QuizOverview> = [],
      public comprehension: Array<QuizOverview> = [],
      public comprehensive: Array<QuizOverview> = []) {
    }
}

export class LessonData {
    public id: number;
    public creator: string;
    public bookId: number;
    public level: string;
    public chapter: string;
    public start_page: string;
    public end_page: string;
    public title: string;
    public wordCount: number;
    public badgeId: number;
    public rating: string;
    public sequence: number;
    public viewable: boolean;

    constructor(data) {
        this.id = data.id;
        this.creator = data.creator;
        this.bookId = data.bookid;
        this.level = data.level;
        this.chapter = data.chapter;
        this.start_page = data.start_page;
        this.end_page = data.end_page;
        this.title = data.title;
        this.wordCount = data.wordCount;
        this.badgeId = data.badge_id;
        this.rating = data.rating;
        this.sequence = data.sequence;
        this.viewable = data.viewable;
    }
}
