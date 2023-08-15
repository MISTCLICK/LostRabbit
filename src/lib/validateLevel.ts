import { Level } from "../app/types/types";

export default function validateLevel(level: Level) {
  let totalLen = 0;

  level.layout.forEach((e) => (totalLen += e.length));

  if (totalLen !== level.divisions)
    throw `Level layout must contain the same number of tiles as the assigned number of divisions. Given layout has ${totalLen} tiles while assigned number of divisions is ${level.divisions}`;
}
