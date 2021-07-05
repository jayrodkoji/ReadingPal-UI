export interface Lesson {
    id: number;
    book_id: number;
    start: number;
    end: number;
    word_count: number;
    vacab_quizes: number[];
    comprehension_quizes: number[];
    comprehensive_quiz: number[];
}
