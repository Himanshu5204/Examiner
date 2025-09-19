// src/pages/StudentExam/CountdownTimer.jsx
import { useEffect, useState } from "react";

const CountdownTimer = ({ durationInMinutes, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    // Check if an endTime is already stored
    let storedEndTime = localStorage.getItem("examEndTime");

    if (!storedEndTime) {
      const endTime = Date.now() + durationInMinutes * 60 * 1000;
      localStorage.setItem("examEndTime", endTime);
      storedEndTime = endTime;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((storedEndTime - now) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
        localStorage.removeItem("examEndTime"); // clear when exam ends
        onTimeout();
      } else {
        setTimeLeft(diff);
      }
    };

    updateTimer(); // run immediately
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [durationInMinutes, onTimeout]);

  const formatTime = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="text-lg font-bold text-red-600 bg-red-100 px-4 py-2 rounded-xl inline-block">
      ⏳ {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
