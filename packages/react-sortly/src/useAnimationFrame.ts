import React from 'react';

const useAnimationFrame = (callback: () => void) => {
  const requestRef = React.useRef<number>();
  const cancel = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
  };
  const animate = () => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => cancel, []);

  return [animate, cancel];
};

export default useAnimationFrame;
