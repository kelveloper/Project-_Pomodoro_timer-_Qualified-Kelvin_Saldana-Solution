import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { minutesToDuration, secondsToDuration } from "../utils/duration/index";
import PlayPauseStop from "./PlayPauseStop";
import BarTimer from "./BarTimer";
import BreakFocus from "./BreakFocus";

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);

  return {
    ...prevState,
    timeRemaining,
  };
}
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);


  const isBreak = session && session.label == "On Break";

  // Break Duration minus button decrementer function
  const minusBreakDuration = () => {
    // to make sure that it doesn't decrement below zero
    if (breakDuration <= 1) {
      return;
    } else {
      setBreakDuration(breakDuration - 1);
    }
  };
  // Break Duration plus button incrementer function
  const plusBreakDuration = () => {
    if (breakDuration >= 15) {
      return;
    } else {
      setBreakDuration(breakDuration + 1);
    }
  };

  // Focus Duration minus button decrementer function
  const minusFocusDuration = () => {
    // to make sure that it doesn't decrement below zero
    if (focusDuration <= 5) {
      return;
    } else {
      setFocusDuration(focusDuration - 5);
    }
  };
  // Focus Duration plus button incrementer function
  const plusFocusDuration = () => {
    if (focusDuration >= 60) {
      return;
    } else {
      setFocusDuration(focusDuration + 5);
    }
  };

  useInterval(() => {
    if (session.timeRemaining === 0) {
      new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
      return setSession(nextSession(focusDuration, breakDuration));
    }
    return setSession(nextTick);
  },
  isTimerRunning ? 1000 : null
);
function playPause() {
  setIsTimerRunning((prevState) => {
    const nextState = !prevState;
    if (nextState) {
      setSession((prevStateSession) => {
        // If the timer is starting and the previous session is null,
        // start a focusing session.
        if (prevStateSession === null) {
          return {
            label: "Focusing",
            timeRemaining: focusDuration * 60,
          };
        }
        return prevStateSession;
      });
    }
    return nextState;
  });
}
function stopButton() {
  setIsTimerRunning(false);
  setSession(null);
}
  
  const barTimer = (1 - (session?.timeRemaining / ((isBreak ? breakDuration : focusDuration) * 60))) * 100;

  return (
    <div className="pomodoro">
      <div className="row">
        <BreakFocus
        plusBreakDuration = {plusBreakDuration}
        minusBreakDuration = {minusBreakDuration}
        breakDuration = {breakDuration}
        plusFocusDuration = {plusFocusDuration}
        minusFocusDuration = {minusFocusDuration}
        focusDuration = {focusDuration} />
      </div>
      <div className="row">
        <PlayPauseStop 
          isTimerRunning={isTimerRunning}
          playPause={playPause} 
          stopButton = {stopButton}
          session= {session} />
      </div>
        <BarTimer 
          session={session}
          focusDuration={focusDuration}
          breakDuration={breakDuration}
          isTimerRunning={isTimerRunning}
          barTimer={barTimer}
          isBreak={isBreak} />
    </div>
  );
}

export default Pomodoro;