"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import useSound from "use-sound";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Player from "./player";
import useKeyboardShortcut from "@/lib/useKeyboardShortcut";
import validateLevel from "@/lib/validateLevel";
import { Level } from "@/app/types/types";
import { useWindowSize } from "@/lib/useWindowSize";
import Loading from "@/app/loading";

interface FrameProps {
  level: Level;
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

  validateLevel(level);

  const [width, setWidth] = useState<number>(0);
  const [coords, setCoords] = useState<number[]>(level.start);
  const [frozen, setFrozen] = useState<boolean>(true);
  const [showStartScreen, setShowStartScreen] = useState<boolean>(true);
  const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false);
  const [levelFinished, setLevelFinished] = useState<boolean>(false);
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
        coords[0] === level.finish[0] &&
        coords[1] === level.finish[1] &&
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
          return router.push("/");
        }

        setLevelFinished(true);
      }
    })();
  }, [coords]);

  let blockArray: number[] = [];
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

    setTimeout(() => {
      clearInterval(interval);

      setShowStartScreen(false);
      setFrozen(false);
      startTimer();
    }, 3000);
  }

  function movePlayer(shift: [number, number], layout: string[][]): void {
    if (frozen) return;

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
                    width={blockWidth}
                    height={blockHeight}
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
                      width={blockWidth}
                      height={blockHeight}
                      style={{
                        marginRight: "2%",
                        marginLeft: "-3%",
                      }}
                    />
                    Ja apmaldisieties, burkāni-mazulīši parādīs Jums ceļu!
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
                href={
                  levelNum !== "20"
                    ? `/level/${(parseInt(levelNum) + 1).toFixed(0)}`
                    : `/feedback`
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
                        <Player
                          width={blockWidth}
                          height={blockHeight}
                        ></Player>
                      ) : (
                        <></>
                      )}

                      {row === level.finish[0] &&
                        pos === level.finish[1] &&
                        !(
                          coords[0] === level.finish[0] &&
                          coords[1] === level.finish[1]
                        ) && (
                          <Image
                            src="/images/bigCarrot.png"
                            alt="victory carrot"
                            width={blockWidth}
                            height={blockHeight}
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
