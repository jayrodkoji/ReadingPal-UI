export class LessonPostData {
  constructor(
    public bookid: number,
    public creator: string,
    public level: string,
    public chapter: string,
    public start_page: string,
    public end_page: string,
    public rating: string,
    public title: string,
    public wordCount: number,
    public sequence: number,
    public viewable: boolean,
    public badge_id: number) {}
}
