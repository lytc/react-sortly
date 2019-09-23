import { DragObjectWithType } from 'react-dnd';

import ItemDataType from './ItemDataType';

type DragObject<D extends ItemDataType> = DragObjectWithType & { id: ID; data: D };

export default DragObject; // eslint-disable-line no-undef
