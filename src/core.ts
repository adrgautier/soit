import { GuardUtils, Primitive, SetUtils, Soit } from './types/core.types';
import { SOIT_SYMBOL } from './constants';

export function _soitCore<V extends Primitive>(values: readonly V[]): Soit<V> {
  const _set = new Set(values);

  const _values = Array.from(_set);

  function _passthrough<S extends V>(value: S): S {
    return value;
  }

  const _guardUtils: GuardUtils<V> = {
    guard: (testedValue: Primitive): testedValue is V => values.some(o => o === testedValue)
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

  return Object.assign(_passthrough, _guardUtils, _iterable, _setUtils, {
    [SOIT_SYMBOL]: true,
  });
}
