import React from "react"
import { minutesToDuration, secondsToDuration } from '../utils/duration';

function BarTimer({session, focusDuration, breakDuration, isBreak, barTimer, isTimerRunning}) {
    return (
        !session ? null : (
            <div>
              {/* TODO: This area should show only when a focus or break session is running or pauses */}
              <div className="row mb-2">
                <div className="col">
                  {/* TODO: Update message below to include current session (Focusing or On Break) and total duration */}
                  <h2 data-testid="session-title">
                    {isBreak ? "On Break" : "Focusing"} for {minutesToDuration(isBreak ? breakDuration : focusDuration)} minutes
                  </h2>
                  {/* TODO: Update message below to include time remaining in the current session */}
                  <p className="lead" data-testid="session-sub-title">
                    {secondsToDuration(session?.timeRemaining)} remaining
                  </p>
                  <div>
                    {session?.timeRemaining > 0 && isTimerRunning === false ? (
                      <h4>PAUSED</h4>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <div className="progress" style={{ height: "20px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow={barTimer} // TODO: Increase aria-valuenow as elapsed time increases
                      style={{ width: barTimer + "%" }} // TODO: Increase width % as elapsed time increases
                    />
                  </div>
                </div>
              </div>
            </div>
          )
    );
}

export default BarTimer;