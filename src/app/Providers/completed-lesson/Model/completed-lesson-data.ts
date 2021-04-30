export class CompletedChoiceData {
  public chosen: boolean;
  public content: string;
  public correct: boolean;
}

export class CompletedQuestionData {
  public completedChoices: CompletedChoiceData[];
  public question: string;
}

export class CompletedLessonData {
  public completedQuestions: CompletedQuestionData[];
  public lessonId: number;
  public rating: number;
  public studentUserName: string;
  public timeInSeconds: number;
  public wordsRead: number;
}

export class CompletedLessonResult {
  public id: number;
  public amountCorrect: number;
  public score: number;
  public totalQuestions: number;
  public wordsRead: number;
  public wpm: number;
}
