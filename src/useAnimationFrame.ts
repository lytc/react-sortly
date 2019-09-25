import React from 'react';

// @ts-ignore
const stats = new global.Stats();
stats.showPanel(0);
stats.dom.style.opacity = 0.3;
stats.dom.style.transition = 'opacity 0.5s';
stats.dom.style.top = '1px';
stats.dom.style.right = '1px';
stats.dom.style.left = 'auto';
document.body.appendChild(stats.dom);

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
    stats.update();
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => cancel, []);

  return [animate, cancel];
};

export default useAnimationFrame;
