export type Literal = string | number | boolean;

/* Ensures that the input type is a finite primitive. */
export type Primitive<T> = string extends T
  ? never
  : number extends T
  ? never
  : boolean extends T
  ? never
  : unknown;

export type Guard<V extends Literal> = {
  /**
   * Uses the `Soit` instance as a type guard:
   * ```ts
   * const is123 = Soit([1, 2, 3]);
   * if(is123(value)) { ... }
   * ```
   *
   * @param {Literal} value
   * @returns {boolean} true or false
   */
  (testedValue: Literal): testedValue is V;
};

export type ArrayUtils<V extends Literal> = Pick<Array<V>, 'forEach' | 'map'>;

export type SetUtils<V extends Literal> = {
  /**
   * Creates a subset of the current set.
   *
   * @param values (array of Literals)
   * @returns `Soit` instance
   */
  subset: <S extends V & Primitive<S>>(subsetValues: readonly S[]) => Soit<S>;
  /**
   * Creates a extended set from the current set.
   *
   * @param values (array of Literals)
   * @returns `Soit` instance
   */
  extend: <A extends Literal & Primitive<A>>(
    additionalValues: readonly A[]
  ) => Soit<A | V>;
  /**
   * Creates a new set from the current set by excluding values.
   *
   * @param values (array of Literals)
   * @returns `Soit` instance
   */
  difference: <D extends Literal & Primitive<D>>(
    differenceValues: readonly D[]
  ) => Soit<Exclude<V, D>>;
};

/* This type aims to display an alias when manipulating a Soit instance. */
export type Soit<V extends Literal = Literal> = Guard<V> &
  Iterable<V> &
  ArrayUtils<V> &
  SetUtils<V>;
