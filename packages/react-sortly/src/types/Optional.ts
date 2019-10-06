type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export default Optional; // eslint-disable-line no-undef
