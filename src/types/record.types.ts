import { Primitive } from "./core.types";

export type RecordValue<K extends string = string, V extends Primitive = Primitive> = Record<K, V>;

type MISSING_AS_CONST = '`as const` missing';

/* Ensures that the input type is a fixed literal. */
export type LiteralRecord<R extends RecordValue> = string extends R[keyof R]
  ? MISSING_AS_CONST
  : number extends R[keyof R]
  ? MISSING_AS_CONST
  : boolean extends R[keyof R]
  ? MISSING_AS_CONST
  : unknown;

export type Getter<R extends RecordValue> = {
  /**
   * Uses the `SoitRecord` object as a getter.
   * Only accepts key in the record.
   *
   * @param {string} key
   * @returns {Primitive} value
   */
  <K extends keyof R>(value: K): R[K];
}

export type GuardUtils<R extends RecordValue> = {
  /**
   * Uses the `SoitRecord` object as a type guard:
   * ```ts
   * const TimeUnit = SoitRecord({ minute: 'm', second: 's' });
   * if(TimeUnit.guard(value)) { ... }
   * ```
   *
   * @param {Primitive} value
   * @returns {boolean} true or false
   */
  guard: (testedValue: Primitive) => testedValue is R[keyof R];
};

/* This type aims to display an alias when manipulating a Soit object. */
export type SoitRecord<R extends RecordValue = any> = Getter<R> &
  GuardUtils<R> &
  Iterable<R[keyof R]>;