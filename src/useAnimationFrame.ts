import React from 'react';

// const stats = new global.Stats();
// stats.showPanel(0);
// stats.dom.style.opacity = 0.3;
// stats.dom.style.transition = 'opacity 0.5s';
// stats.dom.style.top = '10px';
// stats.dom.style.right = '10px';
// stats.dom.style.left = 'auto';
// document.body.appendChild(stats.dom);

const useAnimationFrame = (callback: () => void) => {
  const requestRef = React.useRef<number>();

  const animate = () => {
    callback();
    // stats.update();
    requestRef.current = requestAnimationFrame(animate);
  };

  const cancel = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  React.useLayoutEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancel();
    };
  }, []);

  return [animate, cancel];
};

export default useAnimationFrame;
