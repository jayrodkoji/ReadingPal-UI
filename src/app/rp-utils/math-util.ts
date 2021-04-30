export class Vector2
{
  public constructor(
    public x = 0,
    public y = 0) {}

  public static distance(first: Vector2, second: Vector2) {
    return Vector2.difference(first, second).mag();
  }

  public static sum(first: Vector2, second: Vector2) {
    return new Vector2(
      first.x + second.x,
      first.y + second.y
    );
  }

  public static difference(first: Vector2, second: Vector2) {
    return new Vector2(
      first.x - second.x,
      first.y - second.y
    );
  }

  public toPolar(): Polar2 {
    return new Polar2(
      this.mag(),
      Math.atan2(this.y, this.x));
  }

  public mag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

export class Polar2
{
  public constructor(
    public radius = 0,
    public radians = 0) {}

  public toVector(): Vector2 {
    return new Vector2(
      this.radius * Math.cos(this.radians),
      this.radius * Math.sin(this.radians));
  }
}
