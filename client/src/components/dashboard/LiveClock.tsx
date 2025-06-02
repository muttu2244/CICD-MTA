import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center space-x-3 text-slate-300">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-blue-400" />
        <span className="text-sm text-slate-400">Real-Time Monitoring Active</span>
      </div>
      <div className="border-l border-slate-600 pl-3">
        <div className="text-sm font-mono text-slate-200">
          {formatTime(currentTime)}
        </div>
        <div className="text-xs text-slate-400">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
}