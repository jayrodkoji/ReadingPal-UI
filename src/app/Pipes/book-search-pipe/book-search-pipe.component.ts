import { Pipe, PipeTransform} from '@angular/core';

@Pipe({ name : 'appBookSearchPipe'})
export class BookSearchPipeComponent implements PipeTransform {

  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();

    const filter = searchText.split(' ')[0];

    switch (filter) {
      case ('@title'):
        return items.filter(it => {
          return it.title.toLocaleLowerCase().includes(searchText.substr(8));
        });
      case ('@author'):
        return items.filter(it => {
          return it.author.toLocaleLowerCase().includes(searchText.substr(10));
        });
      case ('@level'):
        return items.filter(it => {
          return it.level.toString().includes(searchText.substr(7));
        });

      default:
        if (searchText[0] === '@') {
          return items;
        }

        return items.filter(it => {
          return it.title.toLocaleLowerCase().includes(searchText);
        });
    }
  }
}
