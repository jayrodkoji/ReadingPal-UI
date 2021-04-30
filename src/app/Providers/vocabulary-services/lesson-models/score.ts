export type ScoreArray = Array<Score>;

export class Score {
    id: number;
    lastPracticed: string;
    score: string;
    studentUsername: string;
    wordId: number; 

    constructor(data) {
        this.id = data.id;
        this.lastPracticed = data.lastPracticed;
        this.score = data.score;
        this.studentUsername = data.studentUsername;
        this.wordId = data.wordId;
    }
}