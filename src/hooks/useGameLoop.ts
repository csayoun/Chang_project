import { useEffect, useRef } from 'react';

export function useGameLoop(
  callback: (deltaTime: number) => void,
  isRunning: boolean
) {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      callback(deltaTime);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [callback, isRunning]);
}


