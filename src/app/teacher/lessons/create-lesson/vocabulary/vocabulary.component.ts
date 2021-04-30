import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {QuizCatalogComponent} from '../quiz/quiz-catalog/quiz-catalog.component';
import {QuestionChoicePost, QuizQuestionPost} from '../../../../Providers/quiz-controller/quiz-data';
import {ModalController} from '@ionic/angular';
import {VocabCatalogComponent} from './vocab-catalog/vocab-catalog.component';

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.scss'],
})
export class VocabularyComponent implements OnInit {
  wordForm: FormGroup;
  words: string[] = [];
  deleteWords: boolean = false;

  @Input()
  set initialWords(words: string[]) {
    if (words) {
      this.words = words;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController) {
    this.wordForm = this.formBuilder.group({
      word: ["", Validators.required]
    });
   }

  ngOnInit() {

  }

  addWord(){
    if (this.wordForm.controls.word.value) {
      this.addWordText(this.wordForm.controls.word.value);
    }

    this.wordForm.reset();
  }

  deleteWord(ind) {
    this.words.splice(ind, 1);

    if (!this.words.length) {
      this.deleteWords = false;
    }
  }

  addWords(words) {
    for (const word of words) {
      this.addWordText(word);
    }
  }

  addWordText(word) {
    if (this.words.find(w => w === word) === undefined) {
      this.words.push(word);
    }
  }

  async importFromCatalog() {
    const modal = await this.modalController.create({
      component: VocabCatalogComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data !== undefined) {
      this.addWords(data);
    }
  }
}
