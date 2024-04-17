import { Soit } from '../types/core.types';
import { escapeRegExp } from './escapeRegExp';

export function toCaptureGroup(value: Soit): string {
  return `(${value.map(escapeRegExp).join('|')})`;
}
