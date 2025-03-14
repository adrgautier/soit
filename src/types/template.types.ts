import { Literal, Primitive, Soit } from './core.types';
import { SoitRecord } from './record.types';

/* Represents a part/chunk of a template. */
export type TemplateValue = Primitive | Soit | SoitRecord;

/* Represents the template. */
export type TemplateValues = readonly [TemplateValue, ...TemplateValue[]];

/* Ensures that all parts/chunks of a template is a fixed literal. */
export type LiteralTemplate<T extends readonly [unknown, ...unknown[]]> =
  T[number] extends Soit | SoitRecord | Literal<T[number]> ? unknown : never;

/* Converts a template value to be used in a template literal. */
type TemplateValueToString<V extends TemplateValue> = V extends Soit<infer SV>
  ? PrimitiveToString<SV> :
  (V extends SoitRecord<infer SV>
    ? PrimitiveToString<SV[keyof SV]> :
    PrimitiveToString<V>);

/* Converts a literal into a string. */
type PrimitiveToString<L> = L extends Primitive
  ? `${L}`
  : never;

/* Get the union of all possible values from a template. */
export type ValuesFromTemplate<
  T extends TemplateValues,
  Acc extends string = '',
> = T extends [
  infer T0 extends TemplateValue,
  ...infer TRest extends TemplateValues,
]
  ? ValuesFromTemplate<TRest, `${Acc}${TemplateValueToString<T0>}`>
  : `${Acc}${TemplateValueToString<T[0]>}`;

/* Get all the possible capture groups from a template. */
export type CaptureGroupsFromTemplate<
  T extends TemplateValues,
  Acc extends string[] = [],
> = T extends [
  infer T0 extends TemplateValue,
  ...infer TRest extends TemplateValues,
]
  ? CaptureGroupsFromTemplate<
    TRest,
    T0 extends Soit<infer V> ? [...Acc, PrimitiveToString<V>] :
    T0 extends SoitRecord<infer R> ? [...Acc, PrimitiveToString<R[keyof R]>] : Acc
  >
  : T[0] extends Soit<infer V>
  ? [...Acc, PrimitiveToString<V>] | null
  : Acc | null;

type RestToken<WithRest extends boolean> = WithRest extends true ? string : '';

/* Get the accumulated capture groups for the current recursive loop. */
export type NextGroups<
  TChunk extends TemplateValue,
  TestedValues extends string,
  AccValues extends string,
  AccGroups extends string[],
  WithRest extends boolean = false,
> = TChunk extends Soit<infer TargetValues> // TODO: add SoitRecord
  ? (TestedValues extends `${AccValues}${TargetValues}${infer Rest extends
    RestToken<WithRest>}`
    ? (TestedValues extends `${AccValues}${infer Group}${Rest}`
      ? [...AccGroups, Group]
      : null)
    : null)
  : (TChunk extends SoitRecord<infer Record> ?
    (TestedValues extends `${AccValues}${Record[keyof Record]}${infer Rest extends
      RestToken<WithRest>}`
      ? (TestedValues extends `${AccValues}${infer Group}${Rest}`
        ? [...AccGroups, Group]
        : null)
      : null)
    : (TestedValues extends `${AccValues}${PrimitiveToString<TChunk>}${RestToken<WithRest>}`
      ? AccGroups
      : null));

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
    infer T0 extends TemplateValue,
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

export type TemplatePassthrough<V extends string> = {
  /**
   * Uses the `SoitTemplate` object as a passthrough.
   * Only accepts values in the set.
   * ```ts
   * const Getter = Soit.Template('get', Soit(['Seconds', 'Minutes', 'Hours']));
   * Getter('getMonths');
   *        ^^^^^^^^^^^
   * ```
   *
   * @param {string} value
   * @returns {string} value
   */
  <S extends V>(value: S): S;
};

export type TemplateUtils<T extends TemplateValues> = {
  /**
   * Uses the `SoitTemplate` object to capture the values from a string:
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

export type TemplateGuardUtils<V extends string> = {
  /**
   * Uses the `SoitTemplate` object as a type guard:
   * ```ts
   * const isGetter = Soit.Template('get', Soit(['Seconds', 'Minutes', 'Hours']));
   * if(isGetter(method)) { ... }
   * ```
   *
   * @param {string} value
   * @returns {boolean} true or false
   */
  guard: (testedValue: string) => testedValue is V;
};

export type InferUtils<V extends string> = {
  /**
   * Infer the union from the `SoitTemplate` object.  
   * ⚠️ **Undefined during runtime** ⚠️
   * ```ts
   * type Union = typeof SoitTemplate.Infer;
   * ```
   */
  Infer: V;
};

export type SoitTemplate<T extends TemplateValues> =
  TemplatePassthrough<ValuesFromTemplate<T>> &
  TemplateGuardUtils<
    ValuesFromTemplate<T>
  > &
  Iterable<ValuesFromTemplate<T>> &
  TemplateUtils<T> &
  InferUtils<ValuesFromTemplate<T>>;
