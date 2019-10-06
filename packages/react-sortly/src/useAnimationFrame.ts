import React from 'react';

// // @ts-ignore
// let stats;
// if (process.env.NODE_ENV === 'development') {
//   // @ts-ignore
//   stats = new global.Stats();
//   stats.showPanel(0);
//   stats.dom.style.opacity = 0.3;
//   stats.dom.style.transition = 'opacity 0.5s';
//   stats.dom.style.top = '1px';
//   stats.dom.style.right = '1px';
//   stats.dom.style.left = 'auto';
//   document.body.appendChild(stats.dom);
// }

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
    // if (process.env.NODE_ENV === 'development') {
    //   // @ts-ignore
    //   stats.update(); // eslint-disable-line no-undef
    // }
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => cancel, []);

  return [animate, cancel];
};

export default useAnimationFrame;
