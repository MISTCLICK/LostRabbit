import { useState } from "react";

export default function useTimer(): [number, () => void, () => void] {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);

  let start = 0;
  let stop = 0;
  let intervalId: NodeJS.Timer;

  function startTimer() {
    if (timerStarted)
      return console.error(
        "You can't start a timer that has already been stated."
      );

    start = performance.now();

    intervalId = setInterval(() => {
      setCurrentTime(performance.now() - start);
    }, 10);
    setTimerStarted(true);
  }

  function stopTimer() {
    if (!timerStarted)
      return console.error(
        "You can't stop a timer that hasn't already been stated."
      );

    clearInterval(intervalId);
    stop = performance.now();

    setCurrentTime(stop - start);
    setTimerStarted(false);
  }

  return [currentTime, startTimer, stopTimer];
}
