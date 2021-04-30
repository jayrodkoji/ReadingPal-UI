export const QUIZES = {
    vocabulary: [],
    comprehension: [
        {
            id: 1,
            title: "Moby Dick: Chapter 1",
            type: 'comprehension',
            max_points: 100,
            score: 0,
            num_questions: 5,
            reading_section: "chapter 1",
            questions: [{
                    id: 0,
                    type: "single",
                    value: "What is Moby Dick?"
                },
                {
                    id: 1,
                    type: "single",
                    value: "What. is Moby Dick?"
                },
                {
                    id: 2,
                    type: "single",
                    value: "What.. is Moby Dick?"
                },
                {
                    id: 3,
                    type: "single",
                    value: "What... is Moby Dick?"
                },
                {
                    id: 4,
                    type: "single",
                    value: "What.... is Moby Dick?"
                }
            ],
            options: [{
                    id: 0,
                    values: ["dog", "cat", "whale", "cartoon"]
                },
                {
                    id: 1,
                    values: ["cat", "dog", "whale", "cartoon"]
                },
                {
                    id: 2,
                    values: ["whale", "cat", "dog", "cartoon"]
                },
                {
                    id: 3,
                    values: ["cartoon", "cat", "dog", "cartoon"]
                },
                {
                    id: 4,
                    values: ["dog", "cat", "whale", "cartoon"]
                }
            ],
            answers: [{
                    id: 0,
                    num_answers: 1,
                    values: ["whale"]
                },
                {
                    id: 1,
                    num_answers: 1,
                    values: ["whale"]
                },
                {
                    id: 2,
                    num_answers: 1,
                    values: ["whale"]
                },
                {
                    id: 3,
                    num_answers: 1,
                    values: ["whale"]
                },
                {
                    id: 4,
                    num_answers: 1,
                    values: ["whale"]
                }
            ]
        }
    ],
    comprehensive: []
}