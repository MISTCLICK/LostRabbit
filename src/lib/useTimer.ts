"use client";

import { useEffect, useState } from "react";

export default function useTimer(): [number, () => void, () => void] {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;
    if (timerStarted) {
      let start = Date.now();
      intervalId = setInterval(() => {
        setCurrentTime(Date.now() - start);
      }, 10);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [timerStarted]);

  function startTimer() {
    if (timerStarted)
      return console.error(
        "You can't start a timer that has already been stated."
      );

    setTimerStarted(true);
  }

  function stopTimer() {
    if (!timerStarted)
      return console.error(
        "You can't stop a timer that hasn't already been stated."
      );
    setTimerStarted(false);

    setCurrentTime(currentTime);
  }

  return [currentTime, startTimer, stopTimer];
}
