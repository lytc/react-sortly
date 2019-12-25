import React from 'react';

export default function useRafLoop(callback: CallableFunction): [() => void, () => void, boolean] {
  const raf = React.useRef<number | null>(null);
  const [isActive, setIsActive] = React.useState<boolean>(true);

  const loopStep = React.useCallback(() => {
    callback();
    raf.current = requestAnimationFrame(loopStep);
  }, [callback]);

  const stop = React.useCallback(() => {
    setIsActive(false);
  }, []);

  const start = React.useCallback(() => {
    setIsActive(true);
  }, []);

  const clear = React.useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
    }
  }, []);

  React.useEffect(() => clear, [clear]);

  React.useEffect(() => {
    clear();
    if (isActive) {
      raf.current = requestAnimationFrame(loopStep);
    }

    return clear;
  }, [isActive, callback, loopStep, clear]);

  return [start, stop, isActive];
}
