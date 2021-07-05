import {Component, Input, OnInit} from '@angular/core';
import {KEY} from '../../../../utils/keys/dictionary-keys';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-vocab-definition',
  templateUrl: './vocab-definition.component.html',
  styleUrls: ['./vocab-definition.component.scss'],
})
export class VocabDefinitionComponent implements OnInit {
  @Input() word;
  definition: any;
  hasDefinition = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDefinition();
  }

  // checks selected for dictionary compatibility (single word)
  isSingleWord(word: string): boolean {
    return word.toString().match(/[^ ]+/g) && word.toString().match(/[^ ]+/g).length === 1;

    return false;
  }

  getDefinition() {
    if (this.isSingleWord(this.word)){
      this.http.get('https://www.dictionaryapi.com/api/v3/references/sd3/json/' + this.word.toString() + '?key=' + KEY.beginner)
          .subscribe(
              (data: any[]) => {
                if (data){
                  // prefer non abbreviations
                  if (data.length > 1){
                    let i = 0;
                    while (data[i].fl === 'abbreviation'){
                      data.push(data[0]);
                      data.splice(0, 1);
                      i++;
                    }
                  }
                  this.definition = data;
                  this.hasDefinition = true;
                }
              }
          );
    }

    if (JSON.stringify(this.definition) !== '{}') {
      this.hasDefinition = false;
    }
  }

}


