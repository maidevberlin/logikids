import { useEffect, useState } from 'react';

export type TimeOfDay = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

function updateBodyTimeClass(time: TimeOfDay): void {
  const classes = Array.from(document.body.classList);
  classes.forEach(className => {
    if (className.startsWith('time-')) {
      document.body.classList.remove(className);
    }
  });
  document.body.classList.add(`time-${time}`);
}

export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);

  useEffect(() => {
    // Apply initial class
    const currentTime = getTimeOfDay();
    updateBodyTimeClass(currentTime);

    // Update every minute
    const interval = setInterval(() => {
      const newTime = getTimeOfDay();
      setTimeOfDay(prevTime => {
        if (newTime !== prevTime) {
          updateBodyTimeClass(newTime);
          return newTime;
        }
        return prevTime;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - run only on mount

  return timeOfDay;
}
