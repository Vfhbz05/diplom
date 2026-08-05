import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { logTaskTimeAction } from "../../actions";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

export const TaskTimer = ({ taskId, isExecutor, isInProgress, onTimeLogged }) => {

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (isTimerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isTimerActive]);

   const dispatch = useDispatch();

   if (!isExecutor || !isInProgress) return null;

  const startTimer = () => {
    setTimerSeconds(0);
    setIsTimerActive(true);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const secondsLogged  = timerSeconds;

    dispatch(logTaskTimeAction(taskId, secondsLogged)).then((res) => {
      if (!res?.error) {
        if (onTimeLogged) onTimeLogged(secondsLogged);
        alert(`Успешно сохранено: зафиксировано ${secondsLogged} сек.`);
      }
    });

    setIsTimerActive(false);
    setTimerSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <FullTimerBox>
      <div className="timer-meta">
        <span className={`timer-status-dot ${isTimerActive ? "active" : ""}`}></span>
        <span>{isTimerActive ? "Идет запись рабочего времени:" : "Учет времени по задаче:"}</span>
      </div>
      <div className="timer-display-row">
        <div className="modal-timer-digits">
          {formatTime(timerSeconds)}
        </div>
        {isTimerActive ? (
          <button className="modal-timer-btn stop" onClick={stopTimer}>Остановить трек ⏹️</button>
        ) : (
          <button className="modal-timer-btn start" onClick={startTimer}>Запустить трек ▶️</button>
        )}
      </div>
    </FullTimerBox>
  );
};

const FullTimerBox = styled.div`
  background: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  .timer-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #c2410c;
  }
  .timer-status-dot {
    width: 8px;
    height: 8px;
    background: #cbd5e1;
    border-radius: 50%;
    &.active {
      background: #ea580c;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
  }
  .timer-display-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-timer-digits {
    font-family: monospace;
    font-size: 24px;
    font-weight: 700;
    color: #ea580c;
  }
  .modal-timer-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
  }
  .modal-timer-btn.start { background: #ea580c; color: white; &:hover { background: #c2410c; } }
  .modal-timer-btn.stop { background: #dc2626; color: white; &:hover { background: #b91c1c; } }
`;

TaskTimer.propTypes = {
  taskId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired, 
  isExecutor: PropTypes.bool.isRequired,
  isInProgress: PropTypes.bool.isRequired, 
  onTimeLogged: PropTypes.func 
};