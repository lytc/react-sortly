import { DragSourceMonitor } from 'react-dnd';

type Context = {
  dragMonitor: DragSourceMonitor;
  setDragMonitor: (monitor: DragSourceMonitor) => void;
};

export default Context; // eslint-disable-line no-undef
