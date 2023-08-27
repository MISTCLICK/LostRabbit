import { SetStateAction } from "react";
import LevelContainer from "./LevelContainer";

enum directions {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const directionValues = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

export default class Brain {
  epsilon: number = 0.5;

  getRandomDirection(possibleDirections: any[]): any {
    return possibleDirections[
      Math.floor(Math.random() * possibleDirections.length)
    ];
  }

  getPossibleDirections(layout: string[][], coords: number[]): number[] {
    let possibleDirections: number[] = [];

    if (!layout[coords[0]][coords[1]].includes("T") && coords[1] !== 0)
      possibleDirections.push(0);
    if (
      !layout[coords[0]][coords[1]].includes("B") &&
      coords[1] !== layout.length - 1
    )
      possibleDirections.push(1);
    if (!layout[coords[0]][coords[1]].includes("L") && coords[0] !== 0)
      possibleDirections.push(2);
    if (
      !layout[coords[0]][coords[1]].includes("R") &&
      coords[1] !== layout.length - 1
    )
      possibleDirections.push(3);

    return possibleDirections;
  }

  getNextMove(
    level: LevelContainer,
    coords: number[],
    visitedList: number[][],
    setVisitedList: (value: SetStateAction<number[][]>) => void
  ): number {
    const possibleDirections = this.getPossibleDirections(level.layout, coords);

    // const currentDiff = [
    //   Math.abs(coords[0] - level.finishCoords[0]),
    //   Math.abs(coords[1] - level.finishCoords[1]),
    // ].reduce((a, b) => Math.sqrt(a ** 2 + b ** 2));

    const upDiff = possibleDirections.some((n) => n === directions.UP)
      ? [
          Math.abs(coords[0] + directionValues.UP[0] - level.finishCoords[0]),
          Math.abs(coords[1] + directionValues.UP[1] - level.finishCoords[1]),
        ].reduce((a, b) => Math.sqrt(a ** 2 + b ** 2))
      : 1000;

    const downDiff = possibleDirections.some((n) => n === directions.DOWN)
      ? [
          Math.abs(coords[0] + directionValues.DOWN[0] - level.finishCoords[0]),
          Math.abs(coords[1] + directionValues.DOWN[1] - level.finishCoords[1]),
        ].reduce((a, b) => Math.sqrt(a ** 2 + b ** 2))
      : 1000;

    const leftDiff = possibleDirections.some((n) => n === directions.LEFT)
      ? [
          Math.abs(coords[0] + directionValues.LEFT[0] - level.finishCoords[0]),
          Math.abs(coords[1] + directionValues.LEFT[1] - level.finishCoords[1]),
        ].reduce((a, b) => Math.sqrt(a ** 2 + b ** 2))
      : 1000;

    const rightDiff = possibleDirections.some((n) => n === directions.RIGHT)
      ? [
          Math.abs(
            coords[0] + directionValues.RIGHT[0] - level.finishCoords[0]
          ),
          Math.abs(
            coords[1] + directionValues.RIGHT[1] - level.finishCoords[1]
          ),
        ].reduce((a, b) => Math.sqrt(a ** 2 + b ** 2))
      : 1000;

    const dirs = [upDiff, downDiff, leftDiff, rightDiff];

    if (!visitedList.some((i) => i[0] === coords[0] && i[1] === coords[1])) {
      setVisitedList((prev) => {
        prev.push(coords);
        return prev;
      });
    }

    const possibleNewCoords: number[][] = [
      [coords[0] + directionValues.UP[0], coords[1] + directionValues.UP[1]],
      [
        coords[0] + directionValues.DOWN[0],
        coords[1] + directionValues.DOWN[1],
      ],
      [
        coords[0] + directionValues.LEFT[0],
        coords[1] + directionValues.LEFT[1],
      ],
      [
        coords[0] + directionValues.RIGHT[0],
        coords[1] + directionValues.RIGHT[1],
      ],
    ];

    possibleNewCoords.forEach((coordOption, idx) => {
      if (
        visitedList.some(
          (i) => i[0] === coordOption[0] && i[1] === coordOption[1]
        )
      ) {
        dirs[idx] = 1000;
      }
    });

    if (Math.random() < this.epsilon) {
      const randDir = this.getRandomDirection(
        this.getPossibleDirections(level.layout, coords)
      );

      if (dirs[randDir] === 1000) {
        this.epsilon += 0.05;
      }

      this.epsilon > 1 || this.epsilon < 0 ? (this.epsilon = 0) : null;

      return randDir;
    }

    if (
      dirs[0] === 1000 &&
      dirs[1] === 1000 &&
      dirs[2] === 1000 &&
      dirs[3] === 1000
    ) {
      this.epsilon += 0.05;
    } else {
      this.epsilon -= 0.1;
    }

    this.epsilon > 1 || this.epsilon < 0 ? (this.epsilon = 1) : null;

    return dirs.indexOf(Math.min(...dirs));
  }
}
