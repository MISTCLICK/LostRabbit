"use client";

import useTimer from "@/lib/useTimer";
import Frame from "./frame";
import ControlsInfoCard from "./controlsInfoCard";
import LevelInfoCard from "./levelInfoCard";
import { Level } from "@/app/types/types";

interface LevelGroupProps {
  level: Level;
  levelNum: string;
  groupNum: number;
  st: string;
}

export default function LevelGroup({
  level,
  levelNum,
  groupNum,
  st,
}: LevelGroupProps) {
  const [currentTime, startTimer, stopTimer] = useTimer();
  return (
    <>
      {" "}
      <LevelInfoCard
        className="infoCardParent"
        levelNum={levelNum}
        currentTime={currentTime}
      />
      <Frame
        level={level}
        levelNum={levelNum}
        groupNum={groupNum}
        st={st}
        currentTime={currentTime}
        startTimer={startTimer}
        stopTimer={stopTimer}
      />
      <ControlsInfoCard className="infoCardParent" />
    </>
  );
}
