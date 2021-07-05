export interface Quiz {
    id: number;
    title: string;
    type: string;
    max_points: number;
    num_questions: number;
    reading_section: string;
    score: number;
    badges: [];
    questions: [{
        id: number,
        type: string,
        value: string
    }];
    options: [{
        id: number,
        values: []
    }];
    answers: [{
        id: number,
        num_answers: number,
        values: []
    }];
}
