import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-experience-bar',
  templateUrl: './experience-bar.component.html',
  styleUrls: ['./experience-bar.component.scss'],
})
export class ExperienceBarComponent implements OnInit {
  static BAR_PERCENT_PER_SEC_FIRST = 50;
  static BAR_PERCENT_PER_SEC_FOLLOWING = 100;
  static BAR_PERCENT_V1 = 50;
  static BAR_PERCENT_A = 50;
  static BAR_PERCENT_A0 = ExperienceBarComponent.BAR_PERCENT_A;
  static BAR_PERCENT_A1 = 0;
  static BAR_PERCENT_A2 = -ExperienceBarComponent.BAR_PERCENT_A;


  @Input() initialValue: number;
  @Input() expEarned = 0;
  @Input() stage = 0;
  @Input() isAnimated = true;
  @Input() isModal = true;

  @ViewChild('barCanvas') barCanvas: ElementRef;

  currentLevel: ExperienceLevel;
  relativeThreshold: number;
  animRemainingExpEarned: number;
  animCurrentValue: number;
  initialLevel: number;

  barStartTime = 0;
  barFillDuration = 2000;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // console.log(this.initialValue);
    // console.log(this.modalController);
    this.currentLevel = new ExperienceLevel(this.initialValue);
    this.relativeThreshold = this.currentLevel.nextRelativeThreshold();

    if (this.isAnimated) {
      this.animRemainingExpEarned = this.expEarned;
      this.animCurrentValue = this.initialValue;
      this.initialLevel = this.currentLevel.level;
    }
    else {
      this.stage = 2;
    }

    setInterval(() => {
      if (this.stage === 1) {
        if (this.barStartTime === 0) {
          this.barStartTime = new Date().getTime();
        }
        else {
          const canvas = this.barCanvas.nativeElement;
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.width  = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          const ctx = canvas.getContext('2d');
          const rect = canvas.getBoundingClientRect();
          const w = rect.width;
          const h = rect.height;

          // const tEnd =
          // const fillDuration = this.expEarned / this.

          const delta = Math.round(this.expEarned * Math.min(
            1.0,
            (new Date().getTime() - this.barStartTime) / this.barFillDuration
          ));
          this.animRemainingExpEarned = this.expEarned - delta;
          this.animCurrentValue = this.initialValue + delta;

          this.currentLevel = new ExperienceLevel(this.animCurrentValue);
          this.relativeThreshold = this.currentLevel.nextRelativeThreshold();

          const ratio = this.currentLevel.relativeExp / this.relativeThreshold;
          const r = document.querySelector(':root');
          const rs = getComputedStyle(r);

          ctx.fillStyle = rs.getPropertyValue('--ion-color-primary');
          ctx.fillRect(0, 0, ratio * w, h);
          // console.log(ratio * w + ' ' + ratio + ' ' + w);
        }
      }
      else if (this.stage === 2) {
        const canvas = this.barCanvas.nativeElement;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        this.currentLevel = new ExperienceLevel(this.initialValue + this.expEarned);
        this.relativeThreshold = this.currentLevel.nextRelativeThreshold();

        const ratio = this.currentLevel.relativeExp / this.relativeThreshold;
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r);

        ctx.fillStyle = rs.getPropertyValue('--ion-color-primary');
        ctx.fillRect(0, 0, ratio * w, h);
      }
    }, 16);
  }

  onClick() {
    if (this.isAnimated) {
      this.stage = Math.min(2, this.stage + 1);
    }
  }

  onDismiss() {
    this.modalController.dismiss();
  }

  calcBarDis(currentT, tBurnEnd, tSteadyEnd) {
    const k = (v, a, t) => {
      return v * t + 0.5 * a * Math.pow(t, 2);
    };

    const d1 = t => {
      return k(0, ExperienceBarComponent.BAR_PERCENT_A0, t);
    };

    const d2 = t => {
      return d1(tBurnEnd) + k(
        ExperienceBarComponent.BAR_PERCENT_V1,
        ExperienceBarComponent.BAR_PERCENT_A1,
        t - tBurnEnd
      );
    };

    const d3 = t => {
      return d2(tSteadyEnd) + k(
        ExperienceBarComponent.BAR_PERCENT_V1,
        ExperienceBarComponent.BAR_PERCENT_A2,
        t - tSteadyEnd
      );
    };

    if (currentT <= tBurnEnd) {
      return d1(currentT);
    }
    else if (currentT <= tSteadyEnd) {
      return d2(currentT);
    }
    else {
      return d3(currentT);
    }
  }

  /*calcDuration() {
    let remainingEarned = this.expEarned;
    let level = this.currentLevel;
    let remaining = level.nextRelativeThreshold() - level.relativeExp;

    if (remainingEarned <= remaining) {
      return (remainingEarned / level.nextRelativeThreshold()) /
        ExperienceBarComponent.BAR_PERCENT_PER_SEC_FIRST;
    }
    else {
      let sum = (remaining / level.nextRelativeThreshold()) /
        ExperienceBarComponent.BAR_PERCENT_PER_SEC_FIRST;
      let total = this.initialValue
      level = new ExperienceLevel()

      while (true) {
        level.nextRelativeThreshold() - level.relativeExp;
      }
    }
  }*/
}

export class ExperienceLevel {
  // The amount of EXP required to advance from level 1 to level 2.
  private static THRESHOLD_FIRST_ADVANCEMENT = 100;

  // The additional amount of EXP required to advance for each consecutive level.
  // I.e. it takes THRESHOLD_FIRST_ADVANCEMENT + (x-1)*THRESHOLD_DELTA points to advance
  // from level x to level x+1.
  private static THRESHOLD_DELTA = 15;

  public level: number;
  public relativeExp: number;

  // Calculates the amount of required EXP points to advance from a particular level.
  static calcRelativeThreshold(level: number) {
    return ExperienceLevel.THRESHOLD_FIRST_ADVANCEMENT +
      (level - 1) * ExperienceLevel.THRESHOLD_DELTA;
  }

  // Calculates the total amount of EXP points required to be at least a certain level.
  // I.e. iff a user's exp is >= the result, then they are at least level `level`.
  // Formally,
  //  0 => 0,
  //  1 => b,
  //  2 => b + b+m,
  //  3 => b + b+m + b+2m,
  // where
  //  b = THRESHOLD_FIRST_ADVANCEMENT,
  //  m = THRESHOLD_DELTA.
  // Note: 0 is a special case for ease of other algorithms. 0 is not an actual level.
  static calcTotalThreshold(level: number) {
    if (level === 0) {
      return 0;
    }

    const a = 0.5 * ExperienceLevel.THRESHOLD_DELTA;
    const b = ExperienceLevel.THRESHOLD_FIRST_ADVANCEMENT - a;
    const b2 = Math.pow(b, 2);

    return a * Math.pow(level + b / (2 * a), 2) - b2 / (4 * a);


    // The following is equivalent code which is kept for mathematical book keeping purposes.
    // The above algorithm is simpler but less intuitive as to how it translates from
    // summation of many relative thresholds.

    // const b = ExperienceLevel.THRESHOLD_FIRST_ADVANCEMENT;
    // const m = ExperienceLevel.THRESHOLD_DELTA;

    // // Simplified version of sum_{i=1}^{level} mi
    // // Represents the accumulation of all delta increases.
    // const deltaAccumulation = m * level * (level + 1) / 2;

    // // Simplified version of sum_{i=1}^{level} b-m
    // // Represents the accumulation of all base exp thresholds.
    // const baseAccumulation = level * (b - m);

    // const sum = deltaAccumulation + baseAccumulation;
    // return sum;
  }

  // The mathematical inverse of calcTotalThreshold, rounded down.
  // Formally,
  //  [0, b) => 1,
  //  [b, b + b+m) => 2,
  //  [b + m, b + b+m + b+2m) => 3,
  // where
  //  b = THRESHOLD_FIRST_ADVANCEMENT,
  //  m = THRESHOLD_DELTA
  static calcLevel(totalPoints: number) {
    const a = 0.5 * ExperienceLevel.THRESHOLD_DELTA;
    const b = ExperienceLevel.THRESHOLD_FIRST_ADVANCEMENT - a;

    const a2 = Math.pow(a, 2);
    const b2 = Math.pow(b, 2);

    // a and b are defined such that calcTotalThreshold = ax^2 + bx.
    // This implies calcTotalThreshold = a(x+b/(2a))^2 - b^2/(4a) (by completing the square).
    // Thus the inverse is as follows.
    const exact = Math.sqrt((totalPoints / a) + (b2 / (4 * a2))) - (b / (2 * a));

    // Adding 1 because `exact` equals x exactly on the threshold FROM x TO x+1.
    return 1 + Math.floor(exact);
  }

  constructor(totalPoints: number) {
    this.level = ExperienceLevel.calcLevel(totalPoints);
    const lastThreshold = ExperienceLevel.calcTotalThreshold(this.level - 1);
    this.relativeExp = totalPoints - lastThreshold;
  }

  nextRelativeThreshold(): number {
    return ExperienceLevel.calcRelativeThreshold(this.level);
  }

  remainingExp(): number {
    return Math.round(this.nextRelativeThreshold() - this.relativeExp);
  }
}
