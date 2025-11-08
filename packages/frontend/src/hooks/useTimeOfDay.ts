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

export function useTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);

  useEffect(() => {
    // Apply initial class
    const currentTime = getTimeOfDay();
    document.body.className = document.body.className
      .split(' ')
      .filter(c => !c.startsWith('time-'))
      .concat(`time-${currentTime}`)
      .join(' ');

    // Update every minute
    const interval = setInterval(() => {
      const newTime = getTimeOfDay();
      if (newTime !== timeOfDay) {
        setTimeOfDay(newTime);
        document.body.className = document.body.className
          .split(' ')
          .filter(c => !c.startsWith('time-'))
          .concat(`time-${newTime}`)
          .join(' ');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [timeOfDay]);

  return timeOfDay;
}
