import { SOIT_SYMBOL } from '../constants';
import { Primitive, Soit } from '../types/core.types';
import { SoitRecord } from '../types/record.types';

export function isSoit(value: Primitive | Soit | SoitRecord): value is Soit | SoitRecord {
  return typeof value === 'function' && value.hasOwnProperty(SOIT_SYMBOL);
}
