import { ArrayUtils, Literal, Primitive, Soit } from './core.types';

/* Represents a part/chunk of a template. */
export type TemplateValue = Literal | Soit;

/* Represents the template. */
export type TemplateValues = readonly [TemplateValue, ...TemplateValue[]];

/* Ensures that all parts/chunks of a template is a finite primitive. */
export type PrimitiveTemplate<T extends readonly [unknown, ...unknown[]]> =
  T[number] extends Soit | Primitive<T[number]> ? unknown : never;

/* Converts a template value to be used in a template literal. */
type TemplateValueToString<V extends TemplateValue> = V extends Soit<infer SV>
  ? LiteralToString<SV>
  : LiteralToString<V>;

/* Converts a literal into a string. */
type LiteralToString<L extends Literal | Soit> = L extends Literal
  ? `${L}`
  : never;

/* Get the union of all possible values from a template. */
export type ValuesFromTemplate<
  T extends TemplateValues,
  Acc extends string = '',
> = T extends [
  infer T0 extends Literal | Soit,
  ...infer TRest extends TemplateValues,
]
  ? ValuesFromTemplate<TRest, `${Acc}${TemplateValueToString<T0>}`>
  : `${Acc}${TemplateValueToString<T[0]>}`;

/* Get all the possible capture groups from a template. */
export type CaptureGroupsFromTemplate<
  T extends TemplateValues,
  Acc extends string[] = [],
> = T extends [
  infer T0 extends Literal | Soit,
  ...infer TRest extends TemplateValues,
]
  ? CaptureGroupsFromTemplate<
      TRest,
      T0 extends Soit<infer V> ? [...Acc, LiteralToString<V>] : Acc
    >
  : T[0] extends Soit<infer V>
  ? [...Acc, LiteralToString<V>] | null
  : Acc | null;

type RestToken<WithRest extends boolean> = WithRest extends true ? string : '';

/* Get the accumulated capture groups for the current recursive loop. */
export type NextGroups<
  TChunk extends TemplateValue,
  TestedValues extends string,
  AccValues extends string,
  AccGroups extends string[],
  WithRest extends boolean = false,
> = TChunk extends Soit<infer TargetValues>
  ? TestedValues extends `${AccValues}${TargetValues}${infer Rest extends
      RestToken<WithRest>}`
    ? TestedValues extends `${AccValues}${infer Group}${Rest}`
      ? [...AccGroups, Group]
      : null
    : null
  : TestedValues extends `${AccValues}${LiteralToString<TChunk>}${RestToken<WithRest>}`
  ? AccGroups
  : null;

/* Get the expected capture groups for the tested value. */
export type CapturedGroupsFromTemplate<
  T extends TemplateValues,
  TestedValues extends string,
  AccValues extends string = '',
  AccGroups extends string[] | null = [],
> = string extends TestedValues
  ? CaptureGroupsFromTemplate<T> // if the tested value is a string, return all possible capture groups
  : AccGroups extends unknown[]
  ? T extends [
      infer T0 extends Literal | Soit,
      ...infer TRest extends TemplateValues,
    ]
    ? CapturedGroupsFromTemplate<
        TRest,
        TestedValues,
        `${AccValues}${TemplateValueToString<T0>}`,
        NextGroups<T0, TestedValues, AccValues, AccGroups, true>
      >
    : NextGroups<T[0], TestedValues, AccValues, AccGroups>
  : null;

export type TemplateUtils<T extends TemplateValues> = {
  /**
   * Uses the `SoitTemplate` instance to capture the values from a string:
   * ```ts
   * const isGetter = Soit.Template('get', Soit(['Seconds', 'Minutes', 'Hours']));
   * const [unit] = isGetter.capture('getSeconds');
   * ```
   *
   * @param {string} value
   * @returns {array | null} array of captured values or null
   */
  capture: <V extends string>(
    testedValue: V
  ) => CapturedGroupsFromTemplate<T, V>;
};

export type TemplateGuard<V extends string> = {
  /**
   * Uses the `SoitTemplate` instance as a type guard:
   * ```ts
   * const isGetter = Soit.Template('get', Soit(['Seconds', 'Minutes', 'Hours']));
   * if(isGetter(method)) { ... }
   * ```
   *
   * @param {string} value
   * @returns {boolean} true or false
   */
  (testedValue: string): testedValue is V;
};

export type SoitTemplate<T extends TemplateValues> = TemplateGuard<
  ValuesFromTemplate<T>
> &
  Iterable<ValuesFromTemplate<T>> &
  ArrayUtils<ValuesFromTemplate<T>> &
  TemplateUtils<T>;
