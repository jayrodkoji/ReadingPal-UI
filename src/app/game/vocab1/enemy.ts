import {Polar2, Vector2} from '../../rp-utils/math-util';

export class Enemy
{
  firstTryPos: Vector2;
  startPos: Vector2;
  acceleration: number;
  starPoints: number;
  spinSpeed: number;

  constructor(
    public velocityInitial: number,
    public timeLimit: number
  ) {
    this.starPoints = 5 + Math.round(Math.random() * 5);
    this.spinSpeed = .75 + Math.random() * 1.5;
  }

  calcAcceleration(planet: Vector2, killRadius: number): void {
    const dis = Vector2.distance(this.startPos, planet) - killRadius;
    this.acceleration =
      2 * (dis - this.velocityInitial * this.timeLimit) / Math.pow(this.timeLimit, 2);
  }

  calcPos(
    canvasSize: Vector2,
    planet: Vector2,
    timeFactor: number): Vector2
  {
    const diff = Vector2.difference(this.startPos, planet);
    const t = timeFactor * this.timeLimit;
    const d = this.velocityInitial * t + 0.5 * this.acceleration * Math.pow(t, 2);
    const polar = diff.toPolar();
    polar.radius -= d;
    const v = polar.toVector();
    v.x += planet.x;
    v.y += planet.y;
    return v;
  }

  resizePos(
    canvasSize: Vector2,
    planet: Vector2,
    enemyRadius: number,
    killRadius: number)
  {
    const isPosValid = this.tryPos(
      canvasSize,
      planet,
      enemyRadius,
      this.startPos,
      Vector2.difference(this.startPos, planet).toPolar().radians,
      killRadius
    );
  }

  randomPos(
    canvasSize: Vector2,
    planet: Vector2,
    enemyRadius: number,
    killRadius: number)
  {
    const outerRadius = this.calcOuterRadius(canvasSize, enemyRadius);
    const initialPosPolar = this.randomUntriedPosPolar(outerRadius);
    const radians = initialPosPolar.radians;
    const initialPos = Vector2.sum(initialPosPolar.toVector(), planet);
    this.firstTryPos = initialPos;

    const isPosValid = this.tryPos(
      canvasSize, planet, enemyRadius, initialPos, radians, killRadius
    );
  }

  draw(
    canvasSize: Vector2,
    planet: Vector2,
    timeFactor: number,
    ctx,
    radius: number): Vector2
  {
    //timeFactor = 1;
    const points = this.starPoints;
    const anglePer = Math.PI / points; // (2*pi / (2*points))
    const pos = this.calcPos(canvasSize, planet, timeFactor);

    const outerScaleBase = 1.3;
    const innerScaleBase = 0.7;
    let outerScale = outerScaleBase;
    let innerScale = innerScaleBase;

    const shrinkTime = .8;
    const shrinkTo = .5;
    if (timeFactor > shrinkTime) {
      const shrinkTimeFactor = 1 - (timeFactor - shrinkTime) / (1 - shrinkTime);
      const scale = shrinkTo + (1 - shrinkTo) * shrinkTimeFactor;
      outerScale *= scale;
      innerScale *= scale;
    }

    const outerRadius = outerScale * radius;
    const innerRadius = innerScale * radius;
    let angle = this.spinSpeed * timeFactor * 2 * Math.PI;

    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const p1 = new Polar2(outerRadius, angle);
      const v1 = Vector2.sum(pos, p1.toVector());
      if (i === 0) {
        ctx.moveTo(v1.x, v1.y);
      }
      else {
        ctx.lineTo(v1.x, v1.y);
      }
      angle += anglePer;

      const p2 = new Polar2(innerRadius, angle);
      const v2 = Vector2.sum(pos, p2.toVector());
      ctx.lineTo(v2.x, v2.y);
      angle += anglePer;
    }

    //const p = new Polar2(outerRadius, angle);
    //const v = Vector2.sum(pos, p.toVector());
    //ctx.lineTo(v.x, v.y);

    ctx.closePath();
    ctx.fillStyle = '#26D503';
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    return pos;
  }

  private randomUntriedPosPolar(outerRadius): Polar2 {
    const radians = Math.random() * 2 * Math.PI;
    return new Polar2(outerRadius, radians);
  }

  private calcOuterRadius(canvasSize: Vector2, enemyRadius: number) {
    return Math.max(canvasSize.x / 2, canvasSize.y / 2) - enemyRadius;
  }

  private tryPos(
    canvasSize: Vector2,
    planet: Vector2,
    enemyRadius: number,
    initialPos: Vector2,
    radians: number,
    killRadius: number): boolean
  {
    const outerRadius = this.calcOuterRadius(canvasSize, enemyRadius);
    const innerRadius = 0.2 * outerRadius + enemyRadius; // TODO: Get rid of magic number

    const paddedCanvasSize = new Vector2(
      canvasSize.x - enemyRadius,
      canvasSize.y - enemyRadius
    );

    let count = 0;
    while (count < 100) {
      const isPosValid = this.trySinglePos(
        paddedCanvasSize, planet, enemyRadius, initialPos, radians, innerRadius, outerRadius
      );

      if (isPosValid) {
        break;
      }
      else {
        const initialPosPolar = this.randomUntriedPosPolar(outerRadius);
        radians = initialPosPolar.radians;
        initialPos = initialPosPolar.toVector();
        count += 1;
      }
    }

    this.calcAcceleration(planet, killRadius);

    if (count >= 100) {
      console.log('Failed to assign a position to enemy');
      return false;
    }

    return true;
  }

  private trySinglePos(
    paddedCanvasSize: Vector2,
    planet: Vector2,
    enemyRadius: number,
    initialPos: Vector2,
    radians: number,
    innerRadius: number,
    outerRadius: number): boolean
  {
    let pos = new Vector2();
    let radiusScalar = 0;

    const diff = Vector2.difference(initialPos, planet);
    const absDiff = new Vector2(
      Math.abs(diff.x),
      Math.abs(diff.y)
    );
    if (initialPos.x < enemyRadius) {
      radiusScalar = (absDiff.x - (enemyRadius - initialPos.x)) / absDiff.x;
    }
    else if (initialPos.x > paddedCanvasSize.x) {
      radiusScalar = (absDiff.x - (initialPos.x - paddedCanvasSize.x)) / absDiff.x;
    }
    else if (initialPos.y < enemyRadius) {
      radiusScalar = (absDiff.y - (enemyRadius - initialPos.y)) / absDiff.y;
    }
    else if (initialPos.y > paddedCanvasSize.y) {
      radiusScalar = (absDiff.y - (initialPos.y - paddedCanvasSize.y)) / absDiff.y;
    }
    else {
      pos.x = initialPos.x;
      pos.y = initialPos.y;
    }

    if (radiusScalar !== 0) {
      pos = new Polar2(radiusScalar * outerRadius, radians).toVector();
      pos.x += planet.x;
      pos.y += planet.y;
    }

    if (Vector2.distance(pos, planet) < innerRadius) {
      return false;
    }
    else {
      this.startPos = pos;
      return true;
    }
  }
}
