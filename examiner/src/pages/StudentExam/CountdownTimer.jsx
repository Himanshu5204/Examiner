// src/pages/StudentExam/CountdownTimer.jsx
import { useEffect, useState } from 'react';

const CountdownTimer = ({ durationInMinutes = 60, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-lg font-bold text-red-600 bg-red-100 px-4 py-2 rounded-xl inline-block">
      ⏳ {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
