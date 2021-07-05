export class LessonPostData {
  constructor(
    public bookid: number,
    public creator: string,
    public level: string,
    public chapter: string,
    public startPage: string,
    public endPage: string,
    public rating: string,
    public title: string,
    public wordCount: number,
    public sequence: number,
    public viewable: boolean,
    public badgeId: number) {}
}
