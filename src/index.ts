type Literal = string | number | boolean;

type ArrayUtils<V extends Literal> = Pick<Array<V>, 'forEach' | 'map'>;

type SetUtils<V extends Literal> = {
  subset: <S extends V>(subsetValues: Array<S>) => Soit<S>;
};

type Soit<V extends Literal = Literal> = ((
  testedValue: Literal
) => testedValue is Literal) &
  (<K extends string, T extends { [k in K]: Literal }>(
    testedValue: T,
    key: K
  ) => testedValue is T & { [k in K]: Literal }) &
  Iterable<V> &
  ArrayUtils<V> &
  SetUtils<V>;

function Soit<V extends Literal>(values: Array<V>): Soit<V> {
  const _set = new Set(values);

  function _check(testedValue: Literal): testedValue is V;

  function _check<K extends string, T extends { [k in K]: Literal }>(
    testedValue: T,
    key: K
  ): testedValue is T & { [k in K]: V };

  function _check(
    testedValue: Literal | { [k: string]: Literal },
    key?: string
  ): boolean {
    if (key && typeof testedValue === 'object') {
      return Array.from(_set).some(o => o === testedValue[key]);
    }
    return Array.from(_set).some(o => o === testedValue);
  }

  const _arrayUtils: ArrayUtils<V> = {
    forEach: (...args) => Array.from(_set).forEach(...args),
    map: (...args) => Array.from(_set).map(...args),
  };

  const _setUtils: SetUtils<V> = {
    subset: <S extends V>(subsetValues: Array<S>) => Soit(subsetValues),
  };

  const _iterable: Iterable<V> = {
    [Symbol.iterator]: () => _set[Symbol.iterator](),
  };

  return Object.assign(_check, _iterable, _setUtils, _arrayUtils);
}

export type Infer<S extends Soit> = Parameters<S['subset']>[0][number];

export default Soit;
