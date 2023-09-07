import Point from "./Point";

interface MazeOptions {
  targetPosition?: Point;
  size: Point;
  start: Point;
  level?: NewLevel;
}

export default class Maze {
  bounds: Point;
  start: Point;
  targetPosition: Point;
  sides: string[];
  oppositeSides: string[];
  delta: number[][];
  blocks: any[];
  position: Point;
  generating: boolean = false;
  solving: boolean = false;
  solved: boolean = false;
  level?: NewLevel;
  generated: boolean = false;

  constructor(options: MazeOptions) {
    this.bounds = options.size;
    this.start = options.start;
    this.targetPosition =
      options.targetPosition || this.bounds.offset([-1, -1]);

    this.sides = ["bottom", "right", "top", "left"];
    this.oppositeSides = ["top", "left", "bottom", "right"];
    this.delta = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    this.position = this.start;

    this.blocks = new Array(this.bounds.y);

    for (let i = 0; i < this.bounds.y; i++) {
      this.blocks[i] = new Array(this.bounds.x);
    }

    if (options.level) this.level = options.level;

    this.init();
  }

  createBlock(p: Point, open: number[]) {
    const classList = new Set().add("frame-block");

    if (!open[0]) classList.add("bottomBorder");
    if (!open[1]) classList.add("rightBorder");
    if (!open[2]) classList.add("topBorder");
    if (!open[3]) classList.add("leftBorder");

    return {
      classList,
      open: {
        bottom: open[0] === 0,
        right: open[1] === 0,
        top: open[2] === 0,
        left: open[3] === 0,
      },
      point: p,
    };
  }

  getBlock(p: Point) {
    return this.blocks[p.x][p.y];
  }

  getPlayerBlock() {
    return this.getBlock(this.position);
  }

  private init() {
    if (this.generating || this.solving) {
      return false;
    }

    for (let x = 0; x < this.bounds.x; x++) {
      for (let y = 0; y < this.bounds.y; y++) {
        this.blocks[x][y] = this.createBlock(
          new Point(x, y),
          this.level?.layout[x][y] || [1, 1, 1, 1]
        );
      }
    }
  }

  getAdjacents(p: Point, visitedSet: number[][]) {
    let adjacents = [];

    for (let i = 0; i < this.delta.length; i++) {
      let cp = p.offset(this.delta[i]);
      cp.side = this.sides[i];
      cp.oppositeSide = this.oppositeSides[i];

      if (
        cp.insideBounds(this.bounds) &&
        !visitedSet.some((i) => i[0] === cp.x && i[1] === cp.y)
      ) {
        adjacents.push(cp);
      }
    }

    return adjacents;
  }

  setPlayerPosition(position: Point) {
    this.getPlayerBlock().classList.delete("current");
    this.position = position;
    this.getPlayerBlock().classList.add("current");

    if (!this.solved && this.position.isEqual(this.targetPosition)) {
      this.solved = true;
    }
  }

  generate() {
    // if (this.generated) return;

    let divisions = this.bounds.x * this.bounds.y;
    let stack = [];
    let visitedList: number[][] = [];
    let start = this.start;
    stack.push(start);

    let i = 0;
    while (visitedList.length < divisions) {
      let point = stack[stack.length - 1];
      let ps = [point.x, point.y];
      let block = this.getBlock(point);

      if (!visitedList.some((i) => i[0] === ps[0] && i[1] === ps[1])) {
        visitedList.push(ps);
        block.index = i;
        block.classList.add("generated");
        i++;
      }

      let adjacents = this.getAdjacents(point, visitedList);

      if (adjacents.length === 0) {
        point = stack.pop()!;
        continue;
      }

      let rand = Math.floor(Math.random() * adjacents.length);
      let np = adjacents[rand];
      let adjBlock = this.getBlock(np);
      stack.push(np);

      block.classList.add(np.side + "Border");
      block.open[np.side] = true;

      adjBlock.classList.add(np.oppositeSide + "Border");
      adjBlock.open[np.oppositeSide] = true;
    }

    this.generated = true;

    return {
      layout: this.blocks.map((row) => {
        return row.map((block: any) => {
          let open = [];

          for (let side in block.open) {
            open.push(block.open[side] ? 0 : 1);
          }

          return open;
        });
      }),
      start: [this.start.x, this.start.y],
      finish: [this.targetPosition.x, this.targetPosition.y],
      divisions: this.blocks.length * this.blocks[0].length,
    };
  }

  solve(currentPos: Point) {
    if (this.solving || this.generating) {
      return [];
    }

    this.solving = true;
    let startPosition = currentPos;
    let visitedList: number[][] = [];
    let position = startPosition;
    let queue = [position];

    while (queue.length > 0 && !position.isEqual(this.targetPosition)) {
      position = queue.shift()!;
      let block = this.getBlock(position);

      visitedList.push([position.x, position.y]);
      block.classList.add("visited");

      for (let side in block.open) {
        if (!block.open[side]) continue;

        let nextPosition = position.offset(
          this.delta[this.sides.indexOf(side)]
        );

        if (
          !nextPosition.insideBounds(this.bounds) ||
          visitedList.some(
            (p) => p[0] === nextPosition.x && p[1] === nextPosition.y
          )
        ) {
          continue;
        }

        nextPosition.previous = position;
        queue.push(nextPosition);
      }
    }

    // return visitedList;
    let path = [];
    while (!position.isEqual(startPosition)) {
      path.push(position);
      position = position.previous!;
    }

    return path;
  }
}
