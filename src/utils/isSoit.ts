import { SOIT_SYMBOL } from '../constants';
import { Literal, Soit } from '../types/core.types';

export function isSoit(value: Literal | Soit): value is Soit {
  return typeof value === 'function' && value.hasOwnProperty(SOIT_SYMBOL);
}
