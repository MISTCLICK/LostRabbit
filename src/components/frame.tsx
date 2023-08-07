"use client";

import { useState, useEffect } from "react";
import Player from "./player";
import validateLevel from "@/app/utils/validateLevel";

interface FrameProps {
  width: number;
  height: number;
  level: Level;
}

export default function Frame({ level, width, height }: FrameProps) {
  if (Math.sqrt(level.divisions) % 1 !== 0) {
    throw "Unable to render a number of divisions that is not a square.";
  }

  validateLevel(level);

  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  let blockArray: number[] = [];
  let blockWidth: number = width / Math.sqrt(level.divisions);
  let blockHeight: number = height / Math.sqrt(level.divisions);

  useEffect(() => {
    if (coords[0] === level.finish[0] && coords[1] === level.finish[1]) {
      console.log("YEEEEEES!");
    }
  }, [coords, level.finish]);

  function movePlayer(shift: [number, number], layout: string[][]) {
    let newCoords: [number, number] = [
      coords[0] + shift[0],
      coords[1] + shift[1],
    ];

    if (
      coords[0] + shift[0] > Math.sqrt(level.divisions) - 1 ||
      coords[1] + shift[1] > Math.sqrt(level.divisions) - 1 ||
      coords[0] + shift[0] < 0 ||
      coords[1] + shift[1] < 0
    ) {
      return;
    }

    if (
      shift[0] === 0 &&
      shift[1] === -1 &&
      (layout[coords[0]][coords[1]].includes("T") ||
        layout[newCoords[0]][newCoords[1]].includes("B"))
    ) {
      return;
    }

    if (
      shift[0] === 0 &&
      shift[1] === 1 &&
      (layout[coords[0]][coords[1]].includes("B") ||
        layout[newCoords[0]][newCoords[1]].includes("T"))
    ) {
      return;
    }

    if (
      shift[0] === -1 &&
      shift[1] === 0 &&
      (layout[coords[0]][coords[1]].includes("L") ||
        layout[newCoords[0]][newCoords[1]].includes("R"))
    ) {
      return;
    }

    if (
      shift[0] === 1 &&
      shift[1] === 0 &&
      (layout[coords[0]][coords[1]].includes("R") ||
        layout[newCoords[0]][newCoords[1]].includes("L"))
    ) {
      return;
    }

    setCoords(newCoords);
  }

  for (let i = 0; i < Math.sqrt(level.divisions); i++) {
    blockArray.push(i);
  }

  function getClassName(cell: string): string {
    let className = "block";
    if (cell.includes("T")) className += " topBorder";
    if (cell.includes("B")) className += " bottomBorder";
    if (cell.includes("L")) className += " leftBorder";
    if (cell.includes("R")) className += " rightBorder";

    return className;
  }

  return (
    <div
      className="frame"
      style={{
        width: width * 1.007,
        height: height * 1.006,
      }}
    >
      {blockArray.map((row, rowId) => {
        return (
          <div className="row" key={`${row}`}>
            {blockArray.map((pos, posId) => {
              return (
                <div
                  className={`${getClassName(level.layout[rowId][posId])}`}
                  key={`${row}-${pos}`}
                  style={{
                    width: blockWidth,
                    height: blockHeight,
                    fontSize: 10,
                  }}
                >
                  {row === coords[0] && pos === coords[1] ? (
                    <Player width={blockWidth} height={blockHeight}></Player>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      <button onClick={() => movePlayer([0, -1], level.layout)}>Up</button>
      <button onClick={() => movePlayer([0, 1], level.layout)}>Down</button>
      <button onClick={() => movePlayer([-1, 0], level.layout)}>Left</button>
      <button onClick={() => movePlayer([1, 0], level.layout)}>Right</button>
    </div>
  );
}
