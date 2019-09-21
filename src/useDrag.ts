import { useDrag as useDndDrag } from 'react-dnd';

export default function useDrag() {
  return useDndDrag({
    item: { type: 'ITEM' },
  });
}
