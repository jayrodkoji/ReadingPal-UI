import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LessonService} from '../../../../../Providers/lesson-services/lesson.service';
import {forkJoin} from 'rxjs';
import {VocabularyServicesService} from '../../../../../Providers/vocabulary-services/vocabulary-services.service';

@Component({
  selector: 'app-vocab-catalog',
  templateUrl: './vocab-catalog.component.html',
  styleUrls: ['./vocab-catalog.component.scss'],
})
export class VocabCatalogComponent implements OnInit {
  lessons: any[];
  vocab: string[][];
  viewing: number;

  constructor(
    private modalController: ModalController,
    private lessonController: LessonService,
    private vocabController: VocabularyServicesService
  ) { }

  ngOnInit() {
    this.lessonController.getLessons()
      .subscribe(lessons => {
        if (lessons) {
          forkJoin(lessons.map(
            lesson => this.vocabController.getVocabDirect(lesson.id.toString())
          )).subscribe(vocab => {
            this.lessons = lessons.filter((l, i) => vocab[i].length > 0).sort((a,b) => a.title.localeCompare(b.title));
            this.vocab = vocab.filter(q => q.length > 0);
          });
        }
      });
  }

  view(i) {
    this.viewing = i;
  }

  back() {
    this.viewing = undefined;
  }

  select() {
    console.log(this.vocab[this.viewing]);

    this.modalController.dismiss(
      this.vocab[this.viewing]
    );
  }
}
