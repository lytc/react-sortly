import ID from './ID';

type ItemData<D = { id: ID }> = {
  id: D extends { id: ID } ? D['id'] : ID;
  depth: number;
} & D;

export default ItemData; // eslint-disable-line no-undef
