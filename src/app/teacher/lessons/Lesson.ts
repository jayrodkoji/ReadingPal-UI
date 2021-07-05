import { ILesson } from './ILesson';
export class Lesson implements ILesson {
  guid: string;
  bookId: string;
  level: string;
  passageStart: string;
  passageEnd: string;
  title: string;
  wordCount: number;
  chapter: string;
  rating: number;
  lessonPlanId: string;
  badgeId: string;

  constructor(
    guid: string,
    bookId: string,
    level: string,
    passageStart: string,
    passageEnd: string,
    title: string,
    wordCount: number,
    chapter: string,
    rating: number,
    lessonPlanId: string,
    badgeId: string
  ) {

    this.guid = guid;
    this.bookId = bookId;
    this.level = level;
    this.passageStart = passageStart;
    this.passageEnd = passageEnd;
    this.title = title;
    this.wordCount = wordCount;
    this.chapter = chapter;
    this.rating = rating;
    this.lessonPlanId = lessonPlanId;
    this.badgeId = badgeId;
  }

  static fromData(data: any): ILesson {
    return new this(
      data.guid,
      data.level,
      data.book_id,
      data.passage_start,
      data.passage_end,
      data.title,
      data.word_count,
      data.chapter,
      data.rating,
      data.lesson_plan_id,
      data.badge_id);
  }
}
