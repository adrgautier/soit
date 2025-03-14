import { Literal, Primitive, Soit } from './types/core.types';
import { LiteralRecord, RecordValue, SoitRecord } from './types/record.types';
import {
  LiteralTemplate,
  SoitTemplate,
  TemplateValues,
} from './types/template.types';
import { _soitCore } from './core';
import { _soitTemplate } from './template';
import { _soitRecord } from './record';

/**
 * Creates a `Soit` object with the given set of values.
 *
 * ```ts
 * const is123 = Soit([1, 2, 3]);
 * ```
 *
 * @param values array of Literals
 * @returns `Soit` object
 */
function Soit<V extends Primitive & Literal<V>>(values: readonly V[]): Soit<V> {
  return _soitCore(values);
}

/**
 * Creates a `SoitTemplate` object with the given template.
 *
 * ```ts
 * const isBorderWidth = Soit.Template(is123, 'px');
 * ```
 *
 * The `isBorderWidth` object will only accept the following values: `1px`, `2px`, `3px`.
 *
 * @returns `SoitTemplate` object
 */
function Template<T extends TemplateValues & LiteralTemplate<T>>(
  ...templateValues: T
): SoitTemplate<T> {
  return _soitTemplate(...templateValues);
}

/**
 * Creates a `SoitRecord` object with the given template.
 *
 * @returns `SoitRecord` object
 */
function Record<R extends RecordValue & LiteralRecord<R>>(
  record: R
): SoitRecord<R> {
  return _soitRecord(record);
}

Object.assign(Soit, { Template, Record });

export default Soit as typeof Soit & { Template: typeof Template, Record: typeof Record };
