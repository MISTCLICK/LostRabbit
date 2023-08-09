"use client";

import { useState, useEffect } from "react";
import Player from "./player";
import useKeyboardShortcut from "@/lib/useKeyboardShortcut";
import validateLevel from "@/app/utils/validateLevel";
import { Level } from "@/app/types/types";

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

  const [coords, setCoords] = useState<number[]>(level.start);
  let blockArray: number[] = [];
  let blockWidth: number = width / Math.sqrt(level.divisions);
  let blockHeight: number = height / Math.sqrt(level.divisions);

  useEffect(() => {
    if (coords[0] === level.finish[0] && coords[1] === level.finish[1]) {
      console.log("YEEEEEES!");
    }
  }, [coords, level.finish]);

  function movePlayer(shift: [number, number], layout: string[][]): void {
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

  function moveUp() {
    movePlayer([0, -1], level.layout);
  }

  function moveDown() {
    movePlayer([0, 1], level.layout);
  }

  function moveLeft() {
    movePlayer([-1, 0], level.layout);
  }

  function moveRight() {
    movePlayer([1, 0], level.layout);
  }

  //Keyboard controls WASD
  useKeyboardShortcut(["W"], moveUp);
  useKeyboardShortcut(["S"], moveDown);
  useKeyboardShortcut(["A"], moveLeft);
  useKeyboardShortcut(["D"], moveRight);

  //Keyboard controls ARROWS
  useKeyboardShortcut(["ArrowUp"], moveUp);
  useKeyboardShortcut(["ArrowDown"], moveDown);
  useKeyboardShortcut(["ArrowLeft"], moveLeft);
  useKeyboardShortcut(["ArrowRight"], moveRight);

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
    <>
      <div
        className="frame"
        style={{
          width: width,
          height: height,
        }}
      >
        {blockArray.map((row, rowId) => {
          return (
            <div className="row" key={`${row}`}>
              {blockArray.map((pos, posId) => {
                return (
                  <div
                    className={`${getClassName(
                      level.layout[rowId][posId]
                    )} frame-block`}
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
      </div>
    </>
  );
}
