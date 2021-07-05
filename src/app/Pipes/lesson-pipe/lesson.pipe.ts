import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appLessonPipe'
})
export class LessonPipe implements PipeTransform {

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
          return it.title.toLocaleLowerCase().includes(searchText.substr(7));
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
