import { DragObjectWithType } from 'react-dnd';

import ID from './ID';

type DragObject = DragObjectWithType & { id: ID };

export default DragObject; // eslint-disable-line no-undef
