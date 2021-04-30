
export interface Quiz {
    id: number,
    title: string,
    type: string,
    score: number,
    questions: Question[],
}

export interface Question {
    id: number,        // 1 through n where n is number of questions
    type: string,      // short answer, multiple choice, etc.
    question: string, 
    options: Option[],
    answer: number,    // where answer must be id in option.
    points: number     // total number of points for question
}

export interface Option {
    id: number,        // 1 through n where n is number of options
    value: string      
}