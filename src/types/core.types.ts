export type Primitive = string | number | boolean;

/* Ensures that the input type is a fixed literal. */
export type Literal<T> = string extends T
  ? never
  : number extends T
  ? never
  : boolean extends T
  ? never
  : unknown;

export type Passthrough<V extends Primitive> = {
  /**
   * Uses the `Soit` object as a passthrough.
   * Only accepts values in the set.
   * ```ts
   * const WarmColor = Soit(['red', 'orange]);
   * WarmColor('blue');
   *           ^^^^^^
   * ```
   *
   * @param {Primitive} value
   * @returns {Primitive} value
   */
  <S extends V>(value: S): S;
}

export type GuardUtils<V extends Primitive> = {
  /**
   * Uses the `Soit` object as a type guard:
   * ```ts
   * const WarmColor = Soit(['red', 'orange]);
   * if(WarmColor.guard(value)) { ... }
   * ```
   *
   * @param {Primitive} value
   * @returns {boolean} true or false
   */
  guard: (testedValue: Primitive) => testedValue is V;
};

export type SetUtils<V extends Primitive> = {
  /**
   * Creates a subset of the current set.
   *
   * @param values (array of Literals)
   * @returns `Soit` object
   */
  subset: <S extends V & Literal<S>>(subsetValues: readonly S[]) => Soit<S>;
  /**
   * Creates a extended set from the current set.
   *
   * @param values (array of Literals)
   * @returns `Soit` object
   */
  extend: <A extends Primitive & Literal<A>>(
    additionalValues: readonly A[]
  ) => Soit<A | V>;
  /**
   * Creates a new set from the current set by excluding values.
   *
   * @param values (array of Literals)
   * @returns `Soit` object
   */
  difference: <D extends Primitive & Literal<D>>(
    differenceValues: readonly D[]
  ) => Soit<Exclude<V, D>>;
};

/* This type aims to display an alias when manipulating a Soit object. */
export type Soit<V extends Primitive = Primitive> = Passthrough<V> &
  GuardUtils<V> &
  Iterable<V> &
  SetUtils<V>;
