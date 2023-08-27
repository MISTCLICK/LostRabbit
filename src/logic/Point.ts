export default class Point {
  x: number;
  y: number;
  side: string = "";
  oppositeSide: string = "";
  previous: Point | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static isEqual(p1: Point, p2: Point) {
    return p1.x === p2.x && p1.y === p2.y;
  }

  isEqual(other: Point) {
    return this.x === other.x && this.y === other.y;
  }

  insideBounds(bounds: { x: number; y: number }) {
    return this.x >= 0 && this.x < bounds.x && this.y >= 0 && this.y < bounds.y;
  }

  offset(delta: number[]) {
    return new Point(this.x + delta[0], this.y + delta[1]);
  }
}
