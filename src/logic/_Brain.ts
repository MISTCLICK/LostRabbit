import * as tf from "@tensorflow/tfjs";
// import { promises as fs } from "fs";
import type { SetStateAction } from "react";
import { Level } from "@/app/types/types";
import LevelContainer from "./LevelContainer";

export function getRandomDirection(possibleDirections: any[]): any {
  return possibleDirections[
    Math.floor(Math.random() * possibleDirections.length)
  ];
}

export function getPossibleDirections(
  layout: string[][],
  coords: number[]
): number[] {
  let possibleDirections: number[] = [];

  if (!layout[coords[0]][coords[1]].includes("T")) possibleDirections.push(0);
  if (!layout[coords[0]][coords[1]].includes("B")) possibleDirections.push(1);
  if (!layout[coords[0]][coords[1]].includes("L")) possibleDirections.push(2);
  if (!layout[coords[0]][coords[1]].includes("R")) possibleDirections.push(3);

  return possibleDirections;
}

export class BrainLog {
  model: tf.Sequential;
  maxMemory: number;
  discount: number;
  memory: any[][];
  numActions: number;

  constructor(
    model: tf.Sequential,
    maxMemory: number = 100,
    discount: number = 0.95
  ) {
    this.model = model;
    this.maxMemory = maxMemory;
    this.discount = discount;
    this.memory = [];
    this.numActions = 4;
  }

  remember(ep: any) {
    // ep = [state, action, reward, state_next, game_over]
    this.memory.push(ep);

    if (this.memory.length > this.maxMemory) this.memory.shift();
  }

  predict(state: any) {
    const res = tf.tidy(() => {
      const pred = this.model.predict(tf.tensor2d(state, [state.length, 1]));
      return pred;
    });
    return res;
  }

  private randomChoice(p: any[]) {
    let rnd = p.reduce((a, b) => a + b) * Math.random();
    return p.findIndex((a) => (rnd -= a) < 0);
  }

  private randomChoices(p: any[], count: number) {
    return Array.from(Array(count), this.randomChoice.bind(null, p));
  }

  getData(dataSize: number = 10) {
    const envSize = this.memory[0][0].length;
    const memorySize = this.memory.length;
    dataSize = Math.min(memorySize, dataSize);

    let inputs = new Array(dataSize).fill(new Array(envSize).fill(0));
    let targets = new Array(dataSize).fill(new Array(this.numActions).fill(0));

    this.randomChoices(new Array(memorySize).fill(0), dataSize).forEach(
      (i, idx) => {
        let state = this.memory[idx][0];
        let nextState = this.memory[idx][3];

        inputs[i] = state;
        targets[i] = this.predict(state);

        //! need to be max value;
        let QSA = this.predict(nextState);

        if (this.memory[idx][4]) {
          targets[i] = this.memory[idx][2];
        } else {
          targets[i] = this.memory[idx][2] + this.discount + QSA;
        }
      }
    );

    return { inputs, targets };
  }
}

export class QBrain {
  model: tf.Sequential;
  level: Level;
  levelContainer: LevelContainer;

  epsilon: number = 0.1;
  minReward: number = -0.5 * 30;
  totalReward: number = 0;

  constructor(level: Level, levelContainer: LevelContainer) {
    this.model = tf.sequential();
    this.level = level;
    this.levelContainer = levelContainer;

    this.model.add(
      tf.layers.dense({
        units: level.layout.length * level.layout[0].length,
        inputShape: [1, 225],
        activation: "relu",
      })
    );
    this.model.add(
      tf.layers.dense({
        units: level.layout.length * level.layout[0].length,
        inputShape: [1, 225],
        activation: "relu",
      })
    );
    this.model.add(tf.layers.dense({ units: 4, activation: "relu" }));

    this.model.summary();
    this.model.compile({ optimizer: "adam", loss: "meanSquaredError" });
  }

  private serializeLevel(pCoords: number[]) {
    let serializedLevel: any[] = [];
    this.level.layout.forEach((r) => r.forEach((i) => serializedLevel.push(i)));

    serializedLevel[pCoords[0] * pCoords[1]] += "P";

    serializedLevel.forEach((cell, idx, parent) => {
      parent[idx] = [];

      if (cell.includes("T")) parent[idx].push(0);
      if (cell.includes("B")) parent[idx].push(1);
      if (cell.includes("L")) parent[idx].push(2);
      if (cell.includes("R")) parent[idx].push(3);
    });

    return serializedLevel;
  }

  async trainModel(setCoords: (value: SetStateAction<number[]>) => void) {
    const nEpoch = 15000;
    const maxMem = 1000;
    const dataSize = 50;

    const log = new BrainLog(this.model, maxMem);

    let winHistory: any[] = [];
    let winRate = 0;
    let hSize = Math.round(this.level.layout.length / 2);

    for (let epoch = 0; epoch < nEpoch; epoch++) {
      let loss;
      let startCoords = [
        Math.floor(Math.random() * this.level.layout.length),
        Math.floor(Math.random() * this.level.layout.length),
      ];
      let coords = startCoords;

      setCoords(startCoords);

      let gameOver = false;
      let state = this.serializeLevel(coords);
      let action;

      let nEpisodes = 0;
      while (!gameOver) {
        let validDirections = getPossibleDirections(this.level.layout, coords);

        if (validDirections.length === 0) break;

        let prevState = state;

        if (Math.random() < this.epsilon) {
          action = getRandomDirection(validDirections);
        } else {
          action = log.predict(prevState);
        }

        let reward = this.getReward(
          this.level,
          coords,
          action,
          this.levelContainer.visitedList
        );

        this.totalReward += reward;

        console.log(action, reward);

        switch (action) {
          case 0:
            setCoords((prev) => [prev[0], prev[1] - 1]);
            this.levelContainer.playerCoords = [coords[0], coords[1] - 1];
            coords = this.levelContainer.playerCoords;
            break;
          case 1:
            setCoords((prev) => [prev[0], prev[1] + 1]);
            this.levelContainer.playerCoords = [coords[0], coords[1] + 1];
            coords = this.levelContainer.playerCoords;
            break;
          case 2:
            setCoords((prev) => [prev[0] - 1, prev[1]]);
            this.levelContainer.playerCoords = [coords[0] - 1, coords[1]];
            coords = this.levelContainer.playerCoords;
            break;
          case 3:
            setCoords((prev) => [prev[0] + 1, prev[1]]);
            this.levelContainer.playerCoords = [coords[0] + 1, coords[1]];
            coords = this.levelContainer.playerCoords;
            break;
        }

        let gameStatus =
          coords[0] === this.level.finish[0] &&
          coords[1] === this.level.finish[1]
            ? 1
            : this.totalReward < this.minReward
            ? 0
            : null;

        if (gameStatus === 1) {
          winHistory.push(1);
          gameOver = true;
        } else if (gameStatus === 0) {
          winHistory.push(0);
          gameOver = true;
        }

        let ep = [prevState, action, reward, state, gameOver];
        log.remember(ep);
        nEpisodes++;

        let { inputs, targets } = log.getData(dataSize);

        console.log(inputs, targets);

        await this.model.fit(
          tf.tensor2d([inputs[0]]),
          tf.tensor2d([0, 1, 2, 3], [1, 4]),
          {
            epochs: 8,
            batchSize: 16,
            verbose: 0,
          }
        );

        loss = this.model.evaluate(inputs, targets, { verbose: 0 });
      }

      if (winHistory.length > hSize) {
        let w = 0;
        for (let game of winHistory) game && w++;
      }

      console.log(
        `Epoch: ${epoch} | Loss: ${loss} | Episodes: ${nEpisodes} | Win count: ${
          winHistory.filter((i) => i === 1).length
        } | Win rate: ${winRate}`
      );

      if (winRate > 0.9) this.epsilon = 0.05;

      if (winRate === 1) {
        console.log("100% precision reached!!!");
        break;
      }
    }

    await this.model.save("brain.h5");
    // await fs.writeFile("brain.json", this.model.toJSON().toString());
  }

  chooseAction(state: any, explorationModifier: number) {
    if (Math.random() < explorationModifier) {
      return Math.floor(Math.random() * 4) - 1;
    } else {
      return tf.tidy(() => {
        return this.model.predict(state);
      });
    }
  }

  getReward(
    level: Level,
    coords: number[],
    action: 0 | 1 | 2 | 3,
    visitedList: number[][]
  ) {
    const possibleDirections = getPossibleDirections(level.layout, coords);

    if (coords[0] === level.finish[0] && coords[1] === level.finish[1])
      return 1;
    if (visitedList.some((i) => i[0] === coords[0] && i[1] === coords[1]))
      return -0.25;
    if (!possibleDirections.some((i) => i === action)) return -100;
    if (possibleDirections.some((i) => i === action)) return -0.04;

    return 0;
  }
}
