import { useSchedule } from '@/entities';
import { getTodayDate, Nullable } from '@/shared';
import { useEffect, useRef, useState } from 'react';

type ScrollPosition = 'above' | 'below' | null;
export function useGoUpButton() {
  const observer = useRef<Nullable<IntersectionObserver>>(null);
  const [showButton, setShowButton] = useState(false);
  const { schedule } = useSchedule();
  const [position, setPosition] = useState<ScrollPosition>(null);
  const todayDate = getTodayDate();

  useEffect(() => {
    const todayElement = document.getElementById(todayDate);
    if (!todayElement) return;
    const options = {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.1,
    };
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === todayDate) {
          const isVisible = entry.isIntersecting;
          setShowButton(!isVisible);
          if (!isVisible) {
            setPosition(
              entry.boundingClientRect.top - 57 <= 0 ? 'above' : 'below'
            );
          }
        }
      });
    }, options);
    observer.current.observe(todayElement);
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [todayDate, schedule]);
  return { showButton, position };
}
