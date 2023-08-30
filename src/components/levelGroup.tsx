"use client";

import useTimer from "@/lib/useTimer";
import Frame from "./frame";
import ControlsInfoCard from "./controlsInfoCard";
import LevelInfoCard from "./levelInfoCard";

interface LevelGroupProps {
  level: NewLevel;
  levelNum: string;
  groupNum: number;
}

export default function LevelGroup({
  level,
  levelNum,
  groupNum,
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
        currentTime={currentTime}
        startTimer={startTimer}
        stopTimer={stopTimer}
      />
      <ControlsInfoCard className="infoCardParent" />
    </>
  );
}
