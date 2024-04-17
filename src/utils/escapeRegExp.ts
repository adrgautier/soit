import { Literal } from '../types/core.types';

export function escapeRegExp(literal: Literal) {
  return String(literal).replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
