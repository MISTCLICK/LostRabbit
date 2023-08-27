"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import Player from "./player";
import useKeyboardShortcut from "@/lib/useKeyboardShortcut";
import validateLevel from "@/lib/validateLevel";
import { NewLevel } from "@/app/types/types";
import { useWindowSize } from "@/lib/useWindowSize";
import Loading from "@/app/loading";
import LevelContainer from "@/logic/LevelContainer";
import Brain from "@/logic/Brain";
import Maze from "@/logic/Maze";
import Point from "@/logic/Point";
import "@/styles/frame.scss";

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function FrameSandbox({ level }: { level: NewLevel }) {
  const maze = new Maze({
    size: new Point(Math.sqrt(level.divisions), Math.sqrt(level.divisions)),
    start: new Point(level.start[0], level.start[1]),
    level,
  });
  maze.clear();

  const currentLevel = new LevelContainer({ ...level });

  const [position, setPosition] = useState<Point>(
    new Point(maze.start.x, maze.start.y)
  );
  const [frozen, setFrozen] = useState<boolean>(false);
  const [path, setPath] = useState<any[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [w] = useWindowSize();

  useEffect(() => {
    if (window) {
      if (w < 2650) setWidth(window.innerWidth * 0.35);
      if (w >= 2650) setWidth(window.innerWidth * 0.25);
    }
  }, [w]);

  let blockWidth: number = width / Math.sqrt(level.divisions);
  let blockHeight: number = width / Math.sqrt(level.divisions);

  function moveUp() {
    if (frozen) return;
    currentLevel.movePlayer([position.x, position.y], [0, -1], setPosition);
  }

  function moveDown() {
    if (frozen) return;
    currentLevel.movePlayer([position.x, position.y], [0, 1], setPosition);
  }

  function moveLeft() {
    if (frozen) return;
    currentLevel.movePlayer([position.x, position.y], [-1, 0], setPosition);
  }

  function moveRight() {
    if (frozen) return;
    currentLevel.movePlayer([position.x, position.y], [1, 0], setPosition);
  }

  //Keyboard controls WASD
  useKeyboardShortcut(["W"], moveUp);
  useKeyboardShortcut(["S"], moveDown);
  useKeyboardShortcut(["A"], moveLeft);
  useKeyboardShortcut(["D"], moveRight);

  // Keyboard controls ARROWS
  useKeyboardShortcut(["ArrowUp"], moveUp);
  useKeyboardShortcut(["ArrowDown"], moveDown);
  useKeyboardShortcut(["ArrowLeft"], moveLeft);
  useKeyboardShortcut(["ArrowRight"], moveRight);

  return (
    <div
      className="frame"
      style={{
        width: width,
        height: width,
        position: "relative",
      }}
    >
      {maze.blocks.map((blockRow, rowIdx) => {
        return (
          <div key={`${rowIdx}-row`} className="row">
            {blockRow.map((block: any, blockIdx: number) => {
              let className = "";

              for (const cName of block.classList.keys()) {
                className += `${cName} `;
              }

              return (
                <div
                  key={`${blockIdx}-block`}
                  className={className}
                  style={{
                    width: blockWidth,
                    height: blockHeight,
                    fontSize: 10,
                    backgroundColor:
                      position.x === block.point.x &&
                      position.y === block.point.y
                        ? "red"
                        : path.some(
                            (p) =>
                              p.x === block.point.x && p.y === block.point.y
                          )
                        ? "blue"
                        : "",
                  }}
                ></div>
              );
            })}
          </div>
        );
      })}
      <button
        onClick={() => {
          setPath(maze.solve(position));
          // maze.solve();
        }}
      >
        SOLVE
      </button>
    </div>
  );
}
