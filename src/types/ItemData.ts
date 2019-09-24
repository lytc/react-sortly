import ID from './ID';
import ObjectLiteral from './ObjectLiteral';

type ItemData<D = ObjectLiteral> = {
  id: ID;
  depth: number;
} & D;

export default ItemData; // eslint-disable-line no-undef
