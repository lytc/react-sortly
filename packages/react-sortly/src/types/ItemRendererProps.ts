import { DragElementWrapper, DragSourceOptions, DragPreviewOptions } from 'react-dnd';

import ID from './ID';
import ObjectLiteral from './ObjectLiteral';
import ItemData from './ItemData';

type ItemRendererProps<D = ObjectLiteral> = {
  index: number;
  id: ID;
  depth: number;
  data: ItemData<D>;
  drag: DragElementWrapper<DragSourceOptions>;
  preview: DragElementWrapper<DragPreviewOptions>;
  drop: DragElementWrapper<any>;
  isDragging: boolean;
  isClosestDragging: () => boolean;
};

export default ItemRendererProps; // eslint-disable-line no-undef
