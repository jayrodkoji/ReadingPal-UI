import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Vocab1Data, Vocab1Word} from '../model/game/Vocab1Data';
import {Vocab1Options, Vocab1OptionsComponent, VocabPair} from './vocab1-options/vocab1-options.component';
import {VocabularyServicesService} from '../Providers/vocabulary-services/vocabulary-services.service';
import {DictionaryControllerService} from '../Providers/dictionary-controller/dictionary-controller.service';
import {forkJoin, Observable, Subject} from 'rxjs';
import {Vocab1Component} from './vocab1/vocab1.component';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, AfterViewInit {
  @ViewChildren(Vocab1OptionsComponent) vocab1Options: QueryList<Vocab1OptionsComponent>;
  @ViewChildren(Vocab1Component) vocab1Component: QueryList<Vocab1Component>;
  vocab1Data = new Vocab1Data();
  onOptions = true;
  vocabOptions: Vocab1Options;
  lessonId: number;

  private static shuffle(arr) {
    let currentIndex = arr.length;

    while (0 !== currentIndex) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      const t = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = t;
    }

    return arr;
  }

  constructor(
    private vocabService: VocabularyServicesService,
    private dictionaryController: DictionaryControllerService,
    private router: Router) {
    const currentNav = this.router.getCurrentNavigation();
    if (currentNav && currentNav.extras.state) {
      this.lessonId = currentNav.extras.state.lessonId;
      console.log({lessonId: this.lessonId});
    }
  }

  ngOnInit() {
    // TODO: Test with <= 4 words
    // TODO: Shuffle
    /*this.vocab1Data.words = [
      new Vocab1Word('surprise', 'an unexpected or astonishing event, fact, or thing'),
      new Vocab1Word('daunting', 'causing fear or discouragement; intimidating'),
      new Vocab1Word('starboard', 'the right-hand side of or direction from a vessel or aircraft, facing forward'),
      new Vocab1Word('phantom', 'an apparition or specter'),
      new Vocab1Word('cathedral', 'the principal church of a diocese, containing the bishop\'s throne'),
      new Vocab1Word('armistice', 'a temporary suspension of hostilities by agreement of the warring parties')
    ];*/

    /*this.dictionaryController.lookupWord('surprise').subscribe(res => {
      console.log(res);
    });*/
  }

  ngAfterViewInit() {

    this.vocab1Options.changes.subscribe(
      (comps: QueryList<Vocab1OptionsComponent>) => {
        if (comps.length === 1) {
          comps.first.onSubmit().subscribe(
            res => {
              this.vocabOptions = res;

              this.vocabService.getVocab(res.lessonId.toString())
                .subscribe(
                  words => {
                    this.loadWords(words).subscribe(pairs => {
                      this.vocab1Data.words = GamePage.shuffle(pairs);
                      this.onOptions = false;
                    });
                  }
                );
            }
          );
        }
      }
    );

    this.vocab1Options.first.onSubmit().subscribe(
      res => {
        this.vocabOptions = res;

        this.vocabService.getVocab(res.lessonId.toString())
          .subscribe(
            words => {
              this.loadWords(words).subscribe(pairs => {
                this.vocab1Data.words = GamePage.shuffle(pairs);
                this.onOptions = false;
              });
            }
          );
      }
    );

    this.vocab1Component.changes.subscribe(
      (comps: QueryList<Vocab1Component>) => {
        if (comps.length === 1) {
          comps.first.onPlayAgain().subscribe(
            res => {
              this.onOptions = true;
            }
          );
        }
      }
    );
  }

  loadWords(words: string[]): Observable<Vocab1Word[]> {
    const subject = new Subject<Vocab1Word[]>();
    forkJoin(words.map(
      w => this.loadWord(w.toLowerCase())
    )).subscribe(
      res => {
        subject.next(res.map((data, i) => this.vocabWord(words[i], data)));
      }
    );
    return subject.asObservable();
  }

  loadWord(word: string) {
    return this.dictionaryController.lookupWord(word);
  }

  vocabWord(word, data) {
    return new Vocab1Word(word.toLowerCase(), data.find(o => o.fl !== 'abbreviation').shortdef[0]);
  }

}
