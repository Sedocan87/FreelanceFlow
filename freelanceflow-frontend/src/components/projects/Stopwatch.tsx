import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/store/timerStore';
import { PlayIcon, PauseIcon, StopCircle } from 'lucide-react';

interface StopwatchProps {
  projectId: string;
  taskId: string;
  onTimeUpdate: (hours: number) => void;
}

const Stopwatch = ({ projectId, taskId, onTimeUpdate }: StopwatchProps) => {
  const { 
    isRunning, 
    elapsedTime,
    startTimer, 
    stopTimer, 
    resetTimer,
    updateElapsedTime 
  } = useTimerStore();

  const [displayTime, setDisplayTime] = useState('00:00:00');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        updateElapsedTime();
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setDisplayTime(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, elapsedTime, updateElapsedTime]);

  const handleStart = () => {
    startTimer(projectId, taskId);
  };

  const handleStop = () => {
    stopTimer();
    // Convert milliseconds to hours
    const hours = elapsedTime / (1000 * 60 * 60);
    onTimeUpdate(hours);
    resetTimer();
  };

  const handlePause = () => {
    stopTimer();
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="font-mono text-lg">{displayTime}</div>
      <div className="space-x-1">
        {!isRunning ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStart}
          >
            <PlayIcon className="h-4 w-4" />
            <span className="sr-only">Start timer</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handlePause}
          >
            <PauseIcon className="h-4 w-4" />
            <span className="sr-only">Pause timer</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={handleStop}
          disabled={!isRunning && elapsedTime === 0}
        >
          <StopCircle className="h-4 w-4" />
          <span className="sr-only">Stop timer</span>
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;
