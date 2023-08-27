const fs = require('fs');

for (let i = 1; i < 10; i++) {
  let level = JSON.parse(fs.readFileSync(`${i}.json`));

  for (const row of level.layout) {
    for (const block of row) {
      let newBlock = [1, 1, 1, 1];

      if(!block.includes("B")) newBlock[0] = 0;
      if(!block.includes("R")) newBlock[1] = 0;
      if(!block.includes("T")) newBlock[2] = 0;
      if(!block.includes("L")) newBlock[3] = 0;

      row[row.indexOf(block)] = newBlock;
    }
  }

  fs.writeFileSync(`_${i}.json`, JSON.stringify(level, null, 2));
}