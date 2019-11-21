import ID from './ID';
import ObjectLiteral from './ObjectLiteral';

type ItemRendererProps<D extends ObjectLiteral> = {
  index: number;
  id: ID;
  depth: number;
  data: D;
};

export default ItemRendererProps; // eslint-disable-line no-undef
