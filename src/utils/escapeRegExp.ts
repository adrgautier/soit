import { Primitive } from '../types/core.types';

export function escapeRegExp(literal: Primitive) {
  return String(literal).replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
