import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Vocab1Data} from '../../model/game/Vocab1Data';
import {interval, Observable, Subject, Subscription} from 'rxjs';
import {IonInput, ModalController} from '@ionic/angular';
import {Vocab1Options} from '../vocab1-options/vocab1-options.component';
import {ExperienceControllerService} from '../../Providers/experience-controller/experience-controller.service';
import {Polar2, Vector2} from '../../rp-utils/math-util';
import {Enemy} from './enemy';
import {ExpBarModalComponent} from '../exp-bar-modal/exp-bar-modal.component';

@Component({
  selector: 'app-vocab1',
  templateUrl: './vocab1.component.html',
  styleUrls: ['./vocab1.component.scss'],
})
export class Vocab1Component implements OnInit, AfterViewInit {
  private static SCORE_SCALAR = 4;

  @Input() data: Vocab1Data;
  @Input() vocabOptions: Vocab1Options;

  @ViewChild('mainCanvas') canvasRef: ElementRef;
  @ViewChild('canvasParent') canvasParentRef: ElementRef;
  @ViewChild('bottomSpace') bottomSpaceRef: any;
  @ViewChild('textBox') textBoxRef: any;
  @ViewChild('textBoxInput') textBoxInputRef: IonInput;

  heartsMax = 3;
  heartsCurrent = 3;
  textBoxValue: string;
  score = 0;
  multipleChoiceArr: string[] = [];
  lost = false;
  playAgainSubject = new Subject<any>();

  private intervalSub: Subscription;
  private dotLoc = 0;
  private pixelScale = 5;
  private timeLimit = 5000;
  private startTime = 0;
  private canvas;
  private ctx: CanvasRenderingContext2D;
  private wordIndex = 0;
  private userTypedWord = '';
  private multipleChoiceWord = '';
  private multipleChoiceSelected = false;
  private isInWordTransition = false;

  private enemyExists: boolean;
  private enemySpawn: Vector2;
  private enemyVelocityInitial = .01;
  private enemyAcceleration: number;
  private enemy: Enemy;

  private killRadius: number;
  private waiting = true;

  private canvasSize: Vector2;


  constructor(
    public modalController: ModalController,
    private experienceController: ExperienceControllerService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.intervalSub = interval(16).subscribe(() => {
      if (!this.isDone() && this.tryInit()) {
        this.fixDPI();
        if (this.waiting) {
          this.waiting = false;
        }
        else {
          this.executeGame();
        }
      }
    });
  }

  playAgain() {
    this.playAgainSubject.next();
  }

  onPlayAgain(): Observable<any> {
    return this.playAgainSubject.asObservable();
  }

  tryInit() {
    if (this.ctx === undefined) {
      this.canvas = this.canvasRef.nativeElement;
      this.ctx = this.canvas.getContext('2d');
      this.updateCurrentModel(new Date().getTime());

      return true;
    }

    return true;
  }

  fixDPI() {
    const dpi = window.devicePixelRatio;
    //const styleHeight = +getComputedStyle(this.canvas).getPropertyValue('height').slice(0, -2);
    //const styleWidth = +getComputedStyle(this.canvas).getPropertyValue('width').slice(0, -2);
    const canvasRect = this.canvas.getBoundingClientRect();
    //const textBoxRect = this.textBoxRef.el.getBoundingClientRect();
    //console.log(this.bottomSpaceRef);
    const bottomRect = this.bottomSpaceRef.nativeElement.getBoundingClientRect();
    //console.log(textBoxRect);
    const h = window.innerHeight - canvasRect.top - bottomRect.height - 10;

    const refAny = this.canvasParentRef as any;
    const styleHeight = h;
    const styleWidth = refAny.el.clientWidth;

    this.canvas.setAttribute('height', styleHeight);
    this.canvas.setAttribute('width', styleWidth);
  }

  executeGame() {
    if (this.isOptionTyping()) {
      this.textBoxInputRef.setFocus();
    }

    const currentTime = new Date().getTime();
    const timeFactor = Math.min(1.0, this.calcTimeFactor(currentTime));
    //console.log(timeFactor);

    let isCorrectWord = false;
    if (this.vocabOptions.inputType === 'typing') {
      if (this.textBoxValue !== undefined) {
        this.textBoxValue = this.textBoxValue.trim();
        //console.log(this.textBoxValue + " " + this.currentWord().word);
        if (this.textBoxValue.toLowerCase() === this.currentWord().word) {
          isCorrectWord = true;
          this.updateScore(timeFactor);
          this.advanceWord(currentTime);
        }
      }
    }
    else if (this.vocabOptions.inputType === 'multipleChoice') {
      if (this.multipleChoiceSelected) {
        if (this.multipleChoiceWord === this.currentWord().word) {
          isCorrectWord = true;
          this.updateScore(timeFactor);
          this.advanceWord(currentTime);
        }
        else {
          this.loseRound(currentTime);
        }
      }
    }

    if (!isCorrectWord && timeFactor >= 1.0 && !this.lost) {
      this.loseRound(currentTime);
    }

    const w = this.ctx.canvas.width;
    const h = this.ctx.canvas.height;
    const wHalf = Math.floor(w / 2);

    const enemyRadius = 25;
    this.killRadius = .05 * Math.max(w, h);
    const canvasSize = new Vector2(w, h);
    if (this.canvasSize) {
      if (canvasSize.x !== this.canvasSize.x || canvasSize.y !== this.canvasSize.y) {
        this.enemy.resizePos(
          canvasSize,
          new Vector2(canvasSize.x / 2, canvasSize.y / 2),
          enemyRadius,
          this.killRadius
        );
      }
    }
    this.canvasSize = canvasSize;

    this.ctx.fillStyle = '#191919';
    this.ctx.fillRect(0, 0, w, h);

    this.drawPlanet(this.killRadius);
    this.drawEnemy(canvasSize, enemyRadius, timeFactor);

    this.ctx.font = '30px Arial';
    this.ctx.fillText(this.userTypedWord, wHalf, h - 10);

    //this.ctx.font = '16px Arial';
    //this.ctx.fillText(Math.round(this.enemy.startPos.x) + ' ' + Math.round(this.enemy.startPos.y), wHalf, h - 30);
    //this.ctx.fillText(Math.round(canvasSize.x) + ' ' + Math.round(canvasSize.y), wHalf, h - 20);

    this.ctx.strokeStyle = '#C3C3C3';
    this.ctx.lineWidth = 15;
    this.ctx.strokeRect(0, 0, w, h);
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = '30px Arial';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(this.score + ' points', 8, 8);
  }

  drawEnemy(canvasSize: Vector2, radius: number, timeFactor: number) {
    const planet = new Vector2(canvasSize.x / 2, canvasSize.y / 2);

    if (!this.enemyExists) {
      //this.generateEnemy(canvasSize, planet, radius);
      this.generateEnemy2(canvasSize, planet, radius);
      this.enemyExists = true;
    }

    this.drawEnemyImage(canvasSize, planet, radius, timeFactor);
    const pos = this.enemy.calcPos(canvasSize, planet, timeFactor);

    //this.ctx.font = '16px Arial';
    //this.ctx.fillText(Math.round(pos.x) + ' ' + Math.round(pos.y), canvasSize.x / 2, canvasSize.y - 45);
    //this.ctx.fillText(timeFactor.toString(), canvasSize.x / 2, canvasSize.y - 60);
    //this.ctx.fillText(this.timeLimit.toString(), canvasSize.x / 2, canvasSize.y - 75);
  }

  drawEnemyImage(canvasSize: Vector2, planet: Vector2, radius: number, timeFactor: number) {
    this.enemy.draw(canvasSize, planet, timeFactor, this.ctx, radius);
    // this.drawEnemyAt(pos, radius);
    //this.drawEnemyAt(this.enemy.firstTryPos, radius);
  }

  drawEnemyAt(pos: Vector2, radius: number) {
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawPlanet(radius: number) {
    this.ctx.fillStyle = '#046CD7';
    this.ctx.beginPath();
    this.ctx.arc(this.canvasSize.x / 2, this.canvasSize.y / 2, radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  generateEnemy(canvasSize: Vector2, planet: Vector2, enemyRadius: number) {
    const outerRadius = Math.max(canvasSize.x / 2, canvasSize.y / 2) - enemyRadius;
    const innerRadius = 0.2 * outerRadius + enemyRadius; // TODO: Get rid of magic number

    const paddedCanvasSize = new Vector2(
      canvasSize.x - enemyRadius,
      canvasSize.y - enemyRadius
    );


    let count = 0;
    let radians = Math.random() * 2 * Math.PI;
    //radians = 2.2997242903252073;
    //radians = 2.825898976839665;

    while (count < 100) {
      const posInitial = new Polar2(outerRadius, radians).toVector();
      posInitial.x += planet.x;
      posInitial.y += planet.y;
      let pos = new Vector2();
      let radiusScalar = 0;

      if (posInitial.x < enemyRadius) {
        radiusScalar = (planet.x - enemyRadius) / outerRadius;
      }
      else if (posInitial.x > paddedCanvasSize.x) {
        radiusScalar = (paddedCanvasSize.x - planet.x) / outerRadius;
      }
      else if (posInitial.y < enemyRadius) {
        radiusScalar = (planet.y - enemyRadius) / outerRadius;
      }
      else if (posInitial.y > paddedCanvasSize.y) {
        radiusScalar = (paddedCanvasSize.y - planet.y) / outerRadius;
      }
      else {
        pos.x = posInitial.x;
        pos.y = posInitial.y;
      }

      if (radiusScalar !== 0) {
        pos = new Polar2(radiusScalar * outerRadius, radians).toVector();
        pos.x += planet.x;
        pos.y += planet.y;
      }

      if (Vector2.distance(pos, planet) < innerRadius) {
        radians = Math.random() * 2 * Math.PI;
        count += 1;
      }
      else {
        this.enemySpawn = pos;
        const dis = Vector2.distance(pos, planet) - this.killRadius;
        this.enemyAcceleration =
          2 * (dis - this.enemyVelocityInitial * this.timeLimit) / Math.pow(this.timeLimit, 2);
        break;
      }
    }
  }

  generateEnemy2(canvasSize: Vector2, planet: Vector2, enemyRadius: number) {
    this.enemy = new Enemy(this.enemyVelocityInitial, this.timeLimit);
    this.enemy.randomPos(canvasSize, planet, enemyRadius, this.killRadius);
  }

  calcEnemyPos(planet: Vector2, timeFactor: number) {
    const diff = Vector2.difference(this.enemySpawn, planet);
    const dis = diff.mag() - this.killRadius;
    const acc =
      2 * (dis - this.enemyVelocityInitial * this.timeLimit) / Math.pow(this.timeLimit, 2);
    const t = timeFactor * this.timeLimit;
    const d = this.enemyVelocityInitial * t + 0.5 * acc * Math.pow(t, 2);
    const polar = diff.toPolar();
    polar.radius -= d;
    const v = polar.toVector();
    v.x += planet.x;
    v.y += planet.y;
    return v;
  }


  updateScore(timeFactor) {
    this.score += Vocab1Component.SCORE_SCALAR * (1 + Math.round(9 * (1.0 - timeFactor)));
  }

  calcTimeFactor(currentTime) {
    const deltaTime = currentTime - this.startTime;
    return deltaTime / this.timeLimit;
  }

  isDone() {
    return this.wordIndex >= this.data.words.length || this.lost;
  }

  currentWord() {
    return this.data.words[this.wordIndex];
  }

  advanceWord(currentTime) {
    this.wordIndex += 1;
    this.updateCurrentModel(currentTime);
    this.enemyExists = false;

    if (this.isDone()) {
      this.showBar();
    }
  }

  showBar() {
    const username = localStorage.getItem('logedInUsername');
    this.experienceController.getUserPoints(username)
      .subscribe((initial: number) => {
        this.experienceController.increaseUserPoints(username, this.score)
          .subscribe(res => {
            this.presentModal(initial);
          });
      });
  }

  async presentModal(initial: number) {
    const modal = await this.modalController.create({
      component: ExpBarModalComponent,
      componentProps: {
        initialValue: initial,
        expEarned: this.score
      }
    });
    await modal.present();
  }

  updateCurrentModel(currentTime) {
    this.startTime = currentTime;
    if (this.isOptionMultipleChoice()) {
      this.multipleChoiceSelected = false;
      const potentialChoices = this.data.words.map(o => o.word);
      this.shuffleChoices(potentialChoices);
      if (this.data.words.length <= 4) {
        this.multipleChoiceArr = potentialChoices;
      }
      else {
        this.multipleChoiceArr = potentialChoices.slice(0, 4);
      }
    }
    else if (this.isOptionTyping()) {
      this.textBoxValue = '';
    }
  }

  selectedChoice(word: string) {
    this.multipleChoiceWord = word;
    this.multipleChoiceSelected = true;
  }

  isOptionMultipleChoice() {
    return this.vocabOptions.inputType === 'multipleChoice';
  }

  isOptionTyping() {
    return this.vocabOptions.inputType === 'typing';
  }

  shuffleChoices(arr) {
    this.swap(arr, 0, this.wordIndex);
    //console.log(arr);

    const l = arr.length;
    const end = Math.min(l, 4);
    for (let i = 1; i < end; i++) {
      const i2 = i + Math.floor(Math.random() * (l - i));
      //console.log(i + ' ' + i2 + ' ' + (l - i));
      this.swap(arr, i, i2);
    }

    {
      const i2 = Math.floor(Math.random() * end);
      //console.log(0 + ' ' + i2);
      this.swap(arr, 0, i2);
    }

    //console.log(arr);
  }

  swap(arr, i1, i2) {
    const t = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = t;
  }

  loseRound(currentTime) {
    this.heartsCurrent -= 1;
    if (this.heartsCurrent === 0) {
      this.lost = true;
      if (this.isDone()) {
        this.showBar();
      }
      //console.log(this.lost);
    }
    else {
      this.advanceWord(currentTime);
    }
  }
}
