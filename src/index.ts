import { Literal, Primitive, Soit } from './types/core.types';
import {
  PrimitiveTemplate,
  SoitTemplate,
  TemplateValues,
} from './types/template.types';
import { _soitCore } from './core';
import { _soitTemplate } from './template';

/**
 * Creates a `Soit` instance with the given set of values.
 *
 * ```ts
 * const is123 = Soit([1, 2, 3]);
 * ```
 *
 * @param values array of Literals
 * @returns `Soit` instance
 */
function Soit<V extends Literal & Primitive<V>>(values: readonly V[]): Soit<V> {
  return _soitCore(values);
}

/**
 * Creates a `SoitTemplate` instance with the given template.
 *
 * ```ts
 * const isBorderWidth = Soit.Template(is123, 'px');
 * ```
 *
 * The `isBorderWidth` instance will only accept the following values: `1px`, `2px`, `3px`.
 *
 * @returns `SoitTemplate` instance
 */
function Template<T extends TemplateValues & PrimitiveTemplate<T>>(
  ...templateValues: T
): SoitTemplate<T> {
  return _soitTemplate(...templateValues);
}

Object.assign(Soit, { Template });

export default Soit as typeof Soit & { Template: typeof Template };

export type { Infer } from './types/index.types';
