"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import { useState, useEffect, useMemo } from "react";
import useSound from "use-sound";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Player from "./player";
import useKeyboardShortcut from "@/lib/useKeyboardShortcut";
import validateLevel from "@/lib/validateLevel";
import { useWindowSize } from "@/lib/useWindowSize";
import LevelContainer from "@/logic/LevelContainer";
import Loading from "@/app/loading";
import Maze from "@/logic/Maze";
import Point from "@/logic/Point";

interface FrameProps {
  level: NewLevel;
  levelNum: string;
  groupNum: number;
  currentTime: number;
  startTimer: () => void;
  stopTimer: () => void;
}

const montserrat = Montserrat({ subsets: ["latin-ext"], weight: "400" });

export default function Frame({
  level,
  levelNum,
  groupNum,
  currentTime,
  startTimer,
  stopTimer,
}: FrameProps) {
  if (Math.sqrt(level.divisions) % 1 !== 0) {
    throw "Unable to render a number of divisions that is not a square.";
  }

  const maze = new Maze({
    size: new Point(Math.sqrt(level.divisions), Math.sqrt(level.divisions)),
    start: new Point(level.start[0], level.start[1]),
    targetPosition: new Point(level.finish[0], level.finish[1]),
    level,
  });

  const currentLevel = new LevelContainer({ ...level });

  validateLevel(level);

  const [width, setWidth] = useState<number>(0);
  const [position, setPosition] = useState<Point>(
    new Point(maze.start.x, maze.start.y)
  );
  const [frozen, setFrozen] = useState<boolean>(true);
  const [showStartScreen, setShowStartScreen] = useState<boolean>(true);
  const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false);
  const [levelFinished, setLevelFinished] = useState<boolean>(false);
  const [path, setPath] = useState<Point[]>([]);
  const [startButtonText, setStartButtonText] = useState<string>(
    parseInt(levelNum) === 1 ? "Sākt spēli" : "Sākt līmeni"
  );
  const [playBoopSound] = useSound("/sounds/3boops.mp3", {
    soundEnabled: true,
  });
  const [w] = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    if (window) {
      if (w < 2650) setWidth(window.innerWidth * 0.35);
      if (w >= 2650) setWidth(window.innerWidth * 0.25);
    }
  }, [w]);

  useEffect(() => {
    (async () => {
      if (
        position.x === level.finish[0] &&
        position.y === level.finish[1] &&
        !frozen
      ) {
        stopTimer();
        setFrozen(true);

        const res = await fetch(`/api/level/${levelNum}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentTime,
            levelNum,
          }),
        });

        if (res.status !== 200) {
          return router.replace("/");
        }

        setLevelFinished(true);
      }
    })();
  }, [
    position,
    currentTime,
    frozen,
    level.finish,
    levelNum,
    router,
    stopTimer,
  ]);

  useEffect(() => {
    setPath((prev) => {
      const posInPath = prev.find(
        (p) => p.x === position.x && p.y === position.y
      );
      if (posInPath) prev.splice(-1, 1);
      return prev;
    });

    let t = setTimeout(() => {
      setPath(
        maze.solve(position).filter((_p, idx, arr) => idx >= arr.length - 10)
      );
    }, 3000);

    return () => clearTimeout(t);
  }, [position]);

  let blockWidth: number = width / Math.sqrt(level.divisions);
  let blockHeight: number = width / Math.sqrt(level.divisions);

  function handleLevelStart() {
    if (startButtonClicked) return;

    setStartButtonClicked(true);

    let i = 3;
    setStartButtonText(`${i}`);
    playBoopSound({ forceSoundEnabled: true });

    let interval = setInterval(() => {
      if (i > 1) {
        i--;
        setStartButtonText(`${i}`);
      }
    }, 1000);

    setTimeout(async () => {
      clearInterval(interval);

      await fetch(`/api/level/${levelNum}`, {
        method: "PATCH",
      }).catch(() => router.replace("/"));

      setShowStartScreen(false);
      setFrozen(false);
      startTimer();
    }, 3000);
  }

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

  //Keyboard controls ARROWS
  useKeyboardShortcut(["ArrowUp"], moveUp);
  useKeyboardShortcut(["ArrowDown"], moveDown);
  useKeyboardShortcut(["ArrowLeft"], moveLeft);
  useKeyboardShortcut(["ArrowRight"], moveRight);

  if (width === 0) return <Loading />;

  return (
    <div
      className="frame"
      style={{
        width: width,
        height: width,
        position: "relative",
      }}
    >
      {showStartScreen ? (
        <Card
          sx={{
            width: width,
            height: width,
          }}
        >
          {parseInt(levelNum) === 1 ? (
            <div className={`${montserrat.className} levelStartCard`}>
              <p>Šī eksperimenta daļa sastāv no 20 labirintiem.</p>
              <p>
                Pa kreisi tiks rādīta informācija par šo līmeni un laiks, kas
                pagājis no līmeņa sākuma.
              </p>
              <p>
                Kontrolēt galveno varoni var ar WASD vai bultu taustiņām. Šī
                konfigurācija ir atkārtota pa labi no labirinta.
              </p>
              <div>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src="/images/bigCarrot.png"
                    alt="victory carrot"
                    width={width / 13}
                    height={width / 13}
                    style={{
                      marginRight: "2%",
                      marginLeft: "-3%",
                    }}
                  />
                  Lai pabeigtu līmeni, ir jānotiek līdz lielajam burkānam.{" "}
                </p>{" "}
                {groupNum === 1 && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "-3%",
                    }}
                  >
                    {" "}
                    <Image
                      src="/images/babyCarrot.png"
                      alt="victory carrot"
                      width={width / 17}
                      height={width / 17}
                      style={{
                        marginRight: "2%",
                        marginLeft: "-3%",
                      }}
                    />
                    Ja apmaldīsieties, burkāni-mazulīši parādīs Jums ceļu!
                  </p>
                )}
              </div>
              <Button
                size="large"
                variant="contained"
                className={montserrat.className}
                sx={
                  w >= 1875
                    ? {
                        height: "10rem",
                        width: "10rem",
                        borderRadius: "50%",
                        backgroundColor: "#EB8EAD", //"#FFBDD3",
                        ":hover": {
                          backgroundColor: "#CD3669",
                        },
                        fontSize: "1.5rem",
                      }
                    : {
                        backgroundColor: "#EB8EAD", //"#FFBDD3",
                        ":hover": {
                          backgroundColor: "#CD3669",
                        },
                      }
                }
                onClick={handleLevelStart}
              >
                {startButtonText}
              </Button>
            </div>
          ) : (
            <div
              className={`${montserrat.className} levelStartCard`}
              style={{
                height: "100%",
              }}
            >
              <Button
                size="large"
                variant="contained"
                className={montserrat.className}
                sx={
                  w >= 1540
                    ? {
                        height: "10rem",
                        width: "10rem",
                        borderRadius: "50%",
                        backgroundColor: "#EB8EAD", //"#FFBDD3",
                        ":hover": {
                          backgroundColor: "#CD3669",
                        },
                        fontSize: "1.5rem",
                      }
                    : {
                        backgroundColor: "#EB8EAD", //"#FFBDD3",
                        ":hover": {
                          backgroundColor: "#CD3669",
                        },
                      }
                }
                onClick={handleLevelStart}
              >
                {startButtonText}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <>
          {levelFinished && (
            <div
              className={`${montserrat.className} levelStartCard`}
              style={{
                width: "90%",
                height: "100%",
                position: "absolute",
              }}
            >
              <Button
                size="large"
                variant="contained"
                className={`${montserrat.className} finishBtn`}
                onClick={() =>
                  router.replace(
                    levelNum !== "20"
                      ? `/level/${(parseInt(levelNum) + 1).toFixed(0)}`
                      : `/feedback`
                  )
                }
                sx={
                  w >= 1875
                    ? {
                        height: "10rem",
                        width: "10rem",
                        borderRadius: "50%",
                        backgroundColor: "#EB8EAD", //"#FFBDD3",
                        ":hover": {
                          backgroundColor: "#CD3669",
                        },
                        fontSize: "1.5rem",
                        textAlign: "center",
                      }
                    : {
                        backgroundColor: "#EB8EAD", //"#FFBDD3",
                        ":hover": {
                          backgroundColor: "#CD3669",
                        },
                        textAlign: "center",
                      }
                }
              >
                {levelNum !== "20" ? "Uz nākamo līmeni" : "Pabeigt spēli"}
              </Button>
            </div>
          )}{" "}
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
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {rowIdx === position.x && blockIdx === position.y && (
                        <Player
                          width={blockWidth}
                          height={blockHeight}
                        ></Player>
                      )}

                      {rowIdx === level.finish[0] &&
                        blockIdx === level.finish[1] &&
                        !(
                          position.x === level.finish[0] &&
                          position.y === level.finish[1]
                        ) && (
                          <Image
                            src="/images/bigCarrot.png"
                            alt="victory carrot"
                            width={blockWidth}
                            height={blockHeight}
                          />
                        )}

                      {groupNum === 1 &&
                        path.some((p) => p.x === rowIdx && p.y === blockIdx) &&
                        !(position.x === rowIdx && position.y === blockIdx) &&
                        !(
                          rowIdx === level.finish[0] &&
                          blockIdx === level.finish[1]
                        ) && (
                          <Image
                            src="/images/babyCarrot.png"
                            alt="baby path carrot"
                            width={blockWidth / 1.6}
                            height={blockHeight / 1.6}
                          />
                        )}
                    </div>
                  );
                })}
              </div>
            );
          })}{" "}
        </>
      )}
    </div>
  );
}
