import { ArrayUtils, Literal, SetUtils, Soit } from './types/core.types';
import { SOIT_SYMBOL } from './constants';

export function _soitCore<V extends Literal>(values: readonly V[]): Soit<V> {
  const _set = new Set(values);

  const _values = Array.from(_set);

  function _guard(testedValue: Literal): testedValue is V {
    return values.some(o => o === testedValue);
  }

  const _arrayUtils: ArrayUtils<V> = {
    forEach: (...args) => _values.forEach(...args),
    map: (...args) => _values.map(...args),
  };

  const _setUtils: SetUtils<V> = {
    subset: subsetValues => _soitCore(subsetValues),
    extend: additionalValues => _soitCore([..._values, ...additionalValues]),
    // we cannot rely on filter and includes typings
    difference: differenceValues =>
      _soitCore(
        _values.filter(value => !differenceValues.includes(value as any)) as any
      ),
  };

  const _iterable: Iterable<V> = {
    [Symbol.iterator]: () => _set[Symbol.iterator](),
  };

  return Object.assign(_guard, _iterable, _setUtils, _arrayUtils, {
    [SOIT_SYMBOL]: true,
  });
}
