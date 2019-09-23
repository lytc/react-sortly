import { DragElementWrapper, DragSourceOptions, DragPreviewOptions } from 'react-dnd';
import ItemDataType from './ItemDataType';

type ItemRendererProps<D = ObjectLiteral> = {
  index: number;
  id: ID;
  data: ItemDataType<D>;
  drag: DragElementWrapper<DragSourceOptions>;
  preview: DragElementWrapper<DragPreviewOptions>;
  drop: DragElementWrapper<any>;
  isDragging: boolean;
  isClosestDragging: () => boolean;
};

export default ItemRendererProps; // eslint-disable-line no-undef
