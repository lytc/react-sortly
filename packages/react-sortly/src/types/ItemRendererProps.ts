import ID from './ID';

type ItemRendererProps<D = { id: ID }> = {
  id: D extends { id: ID } ? D['id'] : ID;
  index: number;
  depth: number;
  data: D;
};

export default ItemRendererProps; // eslint-disable-line no-undef
