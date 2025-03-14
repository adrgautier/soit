import { Soit } from '../types/core.types';
import { SoitRecord } from '../types/record.types';
import { escapeRegExp } from './escapeRegExp';

export function toCaptureGroup(value: Soit | SoitRecord): string {
  return `(${Array.from(value).map(escapeRegExp).join('|')})`;
}
