import { ILesson } from './ILesson';
export class Lesson implements ILesson {
  guid: string;
  book_id: string;
  level: string;
  passage_start: string;
  passage_end: string;
  title: string;
  word_count: number;
  chapter: string;
  rating: number;
  lesson_plan_id: string;
  badge_id: string;

  constructor(guid: string,
              book_id: string,
              level: string,
              passage_start: string,
              passage_end: string,
              title: string,
              word_count: number,
              chapter: string,
              rating: number,
              lesson_plan_id: string,
              badge_id: string) {

    this.guid = guid;
    this.book_id = book_id;
    this.level = level;
    this.passage_start = passage_start;
    this.passage_end = passage_end;
    this.title = title;
    this.word_count = word_count;
    this.chapter = chapter;
    this.rating = rating;
    this.lesson_plan_id = lesson_plan_id;
    this.badge_id = badge_id;
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
