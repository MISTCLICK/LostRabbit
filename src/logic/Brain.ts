// import * as tf from "@tensorflow/tfjs";
// import { promises as fs } from "fs";
// import LevelContainer from "./LevelContainer";
// import Point from "./Point";

//@ts-nocheck

const tf = require("@tensorflow/tfjs");
const fs = require("fs/promises");

function getRandomDirection(possibleDirections: any[]): any {
  return possibleDirections[
    Math.floor(Math.random() * possibleDirections.length)
  ];
}

function getPossibleDirections(
  layout: number[][][],
  coords: number[]
): number[] {
  let possibleDirections: number[] = [];

  if (!layout[coords[0]][coords[1]][2]) possibleDirections.push(2);
  if (!layout[coords[0]][coords[1]][0]) possibleDirections.push(0);
  if (!layout[coords[0]][coords[1]][3]) possibleDirections.push(3);
  if (!layout[coords[0]][coords[1]][1]) possibleDirections.push(1);

  return possibleDirections;
}

// Creates a tf.Sequential model. A sequential model is any model where the outputs of one layer are the inputs to the next layer, i.e. the model topology is a simple 'stack' of layers, with no branching or skipping.

// This means that the first layer passed to a tf.Sequential model should have a defined input shape. What that means is that it should have received an inputShape or batchInputShape argument, or for some type of layers (recurrent, Dense...) an inputDim argument.

// The key difference between tf.model and tf.sequential is that tf.sequential is less generic, supporting only a linear stack of layers. tf.model is more generic and supports an arbitrary graph (without cycles) of layers.

// Examples:

// const model = tf.sequential();

// First layer must have an input shape defined.
// model.add(tf.layers.dense({units: 32, inputShape: [50]}));
// Afterwards, TF.js does automatic shape inference.
// model.add(tf.layers.dense({units: 4}));

// Inspect the inferred shape of the model's output, which equals
// `[null, 4]`. The 1st dimension is the undetermined batch dimension; the
// 2nd is the output size of the model's last layer.
// console.log(JSON.stringify(model.outputs[0].shape));
// It is also possible to specify a batch size (with potentially undetermined batch dimension, denoted by "null") for the first layer using the batchInputShape key. The following example is equivalent to the above:

// const model = tf.sequential();

// First layer must have a defined input shape
// model.add(tf.layers.dense({units: 32, batchInputShape: [null, 50]}));
// Afterwards, TF.js does automatic shape inference.
// model.add(tf.layers.dense({units: 4}));

// Inspect the inferred shape of the model's output.
// console.log(JSON.stringify(model.outputs[0].shape));
// You can also use an Array of already-constructed Layers to create a tf.Sequential model:

// const model = tf.sequential({
//   layers: [tf.layers.dense({units: 32, inputShape: [50]}),
//            tf.layers.dense({units: 4})]
// });
// console.log(JSON.stringify(model.outputs[0].shape));
// @doc — {heading: 'Models', subheading: 'Creation'}

class QBrain {
  model: tf.Sequential;
  level: NewLevel;
  // levelContainer: LevelContainer;

  epsilon: number = 0.1;
  minReward: number = -0.5 * 30;
  totalReward: number = 0;

  constructor(level: NewLevel /*, levelContainer: LevelContainer*/) {
    this.model = tf.sequential();
    this.level = level;
    // this.levelContainer = levelContainer;

    this.model.add(tf.layers.dense({ units: 40, inputShape: [20, 20, 4] }));
    this.model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 4, activation: "softmax" }));

    this.model.compile({ loss: "meanSquaredError", optimizer: "adam" });
  }

  async train() {
    const xs = tf.tensor3d(this.level.layout, [
      this.level.layout.length,
      this.level.layout[0].length,
      4,
    ]);
    const ys = tf.tensor(this.level.start);

    await this.model.fit(xs, ys, { epochs: 50 });
  }

  test(level: NewLevel) {
    return this.model.predict([
      tf.tensor3d(level.layout, [
        level.layout.length,
        level.layout[0].length,
        4,
      ]),
      tf.tensor(this.level.start),
    ]);
  }
}

async function work() {
  const data = JSON.parse(
    await fs.readFile(`${process.cwd()}/level_backup/_10.json`, "utf8")
  );

  const brain = new QBrain(data);
  await brain.train();

  console.log(brain.test);
}

work();
