type ItemDataType<D = ObjectLiteral> = {
  id: ID;
  depth: number;
} & D;

export default ItemDataType; // eslint-disable-line no-undef
