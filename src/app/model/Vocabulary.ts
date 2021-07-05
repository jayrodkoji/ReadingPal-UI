export interface Vocabulary {
    id: number;
    words: Word[];
}


export interface Word {
    // may be able to must pull some of these from dictinary api at runtime.

    id: number;             // not sure if needed.
    pos: string;
    pronunciation: string;  // goal is to have link to pronunciation
}
