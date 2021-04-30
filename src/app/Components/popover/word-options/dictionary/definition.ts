export interface DEFINITION {
    word: string,
    pos: string,
    tense: string,
    senses: [
        {
            sense: string,
        }
    ],
    pronunciation: [
        {
            text: string,
            audio: string
        }
    ]
}