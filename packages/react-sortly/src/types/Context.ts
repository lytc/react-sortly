import { DragSourceMonitor } from 'react-dnd';
import Connectable from './Connectable';

type Context = {
  dragMonitor?: DragSourceMonitor | undefined;
  
  connectedDragSource?: React.RefObject<Connectable | undefined>;
  setDragMonitor: (monitor?: DragSourceMonitor) => void;
  setConnectedDragSource: (connectedDragSource?: React.RefObject<Connectable | undefined>) => void;
  initialDepth?: number;
  setInitialDepth: (depth?: number) => void;
};

export default Context; // eslint-disable-line no-undef
