import { Primitive } from './types/core.types';
import { GuardUtils } from './types/record.types';
import { SOIT_SYMBOL } from './constants';
import { SoitRecord } from './types/record.types';


export function _soitRecord<R extends Record<string, Primitive>>(record: R): SoitRecord<R> {
  const _map = new Map(Object.entries(record));

  const _values = Array.from(_map.values());
  
  type K = keyof R;
  type V = R[K];

  function _getter<S extends K>(key: S): R[S] {
    return record[key];
  }

  const _guardUtils: GuardUtils<R> = {
    guard: (testedValue: Primitive): testedValue is V => _values.some(o => o === testedValue)
  };

  const _iterable: Iterable<V> = {
    [Symbol.iterator]: () => _map.values() as any,
  };

  return Object.assign(_getter, _guardUtils, _iterable, {
    [SOIT_SYMBOL]: true,
  });
}
