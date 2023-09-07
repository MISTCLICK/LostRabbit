import Point from "@/logic/Point";
import type { SetStateAction } from "react";

export default class LevelContainer {
  layout: number[][][];
  finishCoords: number[];
  divisions: number;
  visitedList: number[][] = [];
  private _playerCoords: number[];

  constructor(level: NewLevel) {
    this.layout = level.layout;
    this._playerCoords = level.start;
    this.finishCoords = level.finish;
    this.divisions = level.divisions;
  }

  movePlayer(
    playerCoords: number[],
    shift: [number, number],
    callback: (value: SetStateAction<Point>) => void
  ): void {
    let newCoords: [number, number] = [
      playerCoords[0] + shift[0],
      playerCoords[1] + shift[1],
    ];

    if (
      playerCoords[0] + shift[0] > Math.sqrt(this.divisions) - 1 ||
      playerCoords[1] + shift[1] > Math.sqrt(this.divisions) - 1 ||
      playerCoords[0] + shift[0] < 0 ||
      playerCoords[1] + shift[1] < 0
    ) {
      return;
    }

    if (
      shift[0] === 0 &&
      shift[1] === -1 &&
      (this.layout[playerCoords[0]][playerCoords[1]][2] ||
        this.layout[newCoords[0]][newCoords[1]][0])
    ) {
      return;
    }

    if (
      shift[0] === 0 &&
      shift[1] === 1 &&
      (this.layout[playerCoords[0]][playerCoords[1]][0] ||
        this.layout[newCoords[0]][newCoords[1]][2])
    ) {
      return;
    }

    if (
      shift[0] === -1 &&
      shift[1] === 0 &&
      (this.layout[playerCoords[0]][playerCoords[1]][3] ||
        this.layout[newCoords[0]][newCoords[1]][1])
    ) {
      return;
    }

    if (
      shift[0] === 1 &&
      shift[1] === 0 &&
      (this.layout[playerCoords[0]][playerCoords[1]][1] ||
        this.layout[newCoords[0]][newCoords[1]][3])
    ) {
      return;
    }

    callback(new Point(...newCoords));
  }

  get playerCoords() {
    return this._playerCoords;
  }

  set playerCoords(newCoords: number[]) {
    this.visitedList.push(this.playerCoords);
    this._playerCoords = newCoords;
  }
}
