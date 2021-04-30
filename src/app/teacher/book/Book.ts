import { IBook } from './IBook';

export class Book implements IBook {
    id: string;
    title: string;
    author: string;
    shortDescription: string;
    level: number;
    base64Cover: any;
    base64eBook: any;
    suser: string;
    sts: Date;

  constructor(id: string,
              title: string,
              author: string,
              shortDescription: string,
              level: number,
              base64Cover: any,
              base64eBook: any,
              suser: string,
              sts: Date) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.shortDescription = shortDescription;
    this.level = level;
    this.base64Cover = base64Cover;
    this.base64eBook = base64eBook;
    this.suser = suser;
    this.sts = sts;
  }

  static fromData(data: any): IBook {
    return new this(
      data.id,
      data.title,
      data.author,
      data.shortDescription,
      data.level,
      data.base64Cover,
      data.base64eBook,
      data.suser,
      data.sts);
  }
}
