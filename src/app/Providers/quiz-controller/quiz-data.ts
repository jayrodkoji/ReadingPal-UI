export class QuestionChoice {
  public id: number;
  public answer: string;
  public isTrue: boolean;

  public constructor(data: any) {
    this.id = data.id;
    this.answer = data.answer;
    this.isTrue = data.correct;
  }

  public static choicesFromJson(data: any[]) {
    return data.map(o => new QuestionChoice(o));
  }
}

export class QuizQuestion {
  public id: number;
  public lessonId: number;
  public sequence: number;
  public text: string;
  public choices: QuestionChoice[];

  public constructor(data: any) {
    this.id = data.id;
    this.lessonId = data.lessonId;
    this.sequence = data.sequence;
    this.text = data.text;
    this.choices = data.choices.map(o => new QuestionChoice(o));
  }

  public static questionsFromJson(data: any[]) {
    return data.map(o => new QuizQuestion(o));
  }
}


export class QuestionChoicePost
{
  public answer: string;
  public correct: boolean;

  public constructor(answer: string, correct: boolean) {
    this.answer = answer;
    this.correct = correct;
  }
}


export class QuestionChoiceAdd
{
  public constructor(
    public questionId: number,
    public correct: boolean,
    public text: string) {}
}


export class QuestionChoiceUpdate
{
  public constructor(
    public questionId: number,
    public id: number,
    public correct: boolean,
    public text: string) {}
}


export class QuizQuestionPost
{
  public constructor(
    public lessonId: number,
    public sequence: number,
    public text: string,
    public choices: QuestionChoicePost[]) {}
}


/*export class QuestionData
{
    constructor(
        public type: string,
        public questionText: string,
        public answers: Array<string>) {}
}

type QuestionDataArray = Array<QuestionData>;

export class QuizData
{
    constructor(
        public title: string,
        public type: string,
        public maxPoints: number,
        public score: number,
        public numQuestions: number,
        public readingSection: string,
        public questions: QuestionDataArray
) {
}
}*/
