import { get as getProperty } from 'dot-prop';

type Literal = string | number | boolean;

type ValueStructure<
  Key extends string,
  Value extends Literal = Literal,
> = Key extends `${infer SupKey}.${infer SubKey}`
  ? Record<SupKey, ValueStructure<SubKey, Value>>
  : Record<Key, Value>;

type PossibleKey<ObjectType extends Record<string | number, unknown>> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends Record<
    string,
    unknown
  >
    ? `${Key}.${PossibleKey<ObjectType[Key]>}`
    : ObjectType[Key] extends Literal | undefined
    ? Key
    : never;
}[keyof ObjectType & string];

/* This type ensures that the input type is not a set of unknown values. */
type SubLiteral<T> = string extends T
  ? never
  : number extends T
  ? never
  : boolean extends T
  ? never
  : Literal;

type Guard<V extends Literal> = {
  /**
   * Uses the `Soit` instance as a type guard:
   * ```ts
   * const is123 = Soit([1, 2, 3]);
   * if(is123(value)) { ... }
   * ```
   *
   *You can also check a prop from an object (up to the fourth key-level):
   *```ts
   *isRedColor(car, "look.exterior.colors.main");
   *```
   *
   * @param {Literal| object} values
   * @param {string} key dot path
   * @returns {boolean} true or false
   */
  (testedValue: Literal): testedValue is V;
  <
    TKey extends PossibleKey<TValue>,
    TValue extends Record<string | number, unknown>,
  >(
    testedValue: TValue,
    key: TKey
  ): testedValue is TValue & ValueStructure<TKey, V>;
};

type ArrayUtils<V extends Literal> = Pick<Array<V>, 'forEach' | 'map'>;

type SetUtils<V extends Literal> = {
  /**
   * Creates a subset of the current set.
   *
   * @param values (array of Literals)
   * @returns `Soit` instance
   */
  subset: <S extends V>(subsetValues: readonly S[]) => Soit<S>;
  /**
   * Creates a extended set from the current set.
   *
   * @param values (array of Literals)
   * @returns `Soit` instance
   */
  extend: <A extends SubLiteral<A>>(
    additionalValues: readonly A[]
  ) => Soit<A | V>;
  /**
   * Creates a new set from the current set by excluding values.
   *
   * @param values (array of Literals)
   * @returns `Soit` instance
   */
  difference: <D extends SubLiteral<D>>(
    differenceValues: readonly D[]
  ) => Soit<Exclude<V, D>>;
};

/* This type aims to display an alias when manipulating a Soit instance. */
type Soit<V extends Literal = Literal> = Guard<V> &
  Iterable<V> &
  ArrayUtils<V> &
  SetUtils<V>;

function _soit<V extends Literal>(values: readonly V[]) {
  const _set = new Set(values);

  const _values = Array.from(_set);

  function _guard(testedValue: Literal): testedValue is V;

  function _guard<K extends string, T extends { [k in K]?: Literal }>(
    testedValue: T,
    key: K
  ): testedValue is T & { [k in K]: V };

  function _guard<
    K1 extends string,
    K2 extends string,
    T extends { [k in K1]?: { [k in K2]?: Literal } },
  >(
    testedValue: T,
    key: `${K1}.${K2}`
  ): testedValue is T & { [k in K1]: { [k in K2]: V } };

  function _guard<
    K1 extends string,
    K2 extends string,
    K3 extends string,
    T extends { [k in K1]?: { [k in K2]?: { [k in K3]?: Literal } } },
  >(
    testedValue: T,
    key: `${K1}.${K2}.${K3}`
  ): testedValue is T & { [k in K1]: { [k in K2]: { [k in K3]: V } } };

  function _guard<
    K1 extends string,
    K2 extends string,
    K3 extends string,
    K4 extends string,
    T extends {
      [k in K1]?: { [k in K2]?: { [k in K3]?: { [k in K4]?: Literal } } };
    },
  >(
    testedValue: T,
    key: `${K1}.${K2}.${K3}.${K4}`
  ): testedValue is T & {
    [k in K1]: { [k in K2]: { [k in K3]: { [k in K4]: V } } };
  };

  function _guard(testedValue: Literal | object, key?: string): boolean {
    if (key && typeof testedValue === 'object') {
      return values.some(o => o === getProperty(testedValue, key));
    }
    return values.some(o => o === testedValue);
  }

  const _arrayUtils: ArrayUtils<V> = {
    forEach: (...args) => _values.forEach(...args),
    map: (...args) => _values.map(...args),
  };

  const _setUtils: SetUtils<V> = {
    subset: subsetValues => _soit(subsetValues),
    extend: additionalValues => _soit([..._values, ...additionalValues]),
    // we cannot rely on filter and includes typings
    difference: differenceValues =>
      _soit(
        _values.filter(value => !differenceValues.includes(value as any)) as any
      ),
  };

  const _iterable: Iterable<V> = {
    [Symbol.iterator]: () => _set[Symbol.iterator](),
  };

  return Object.assign(_guard, _iterable, _setUtils, _arrayUtils);
}

/**
 * Creates a new `Soit` instance with the given set of values.
 *
 * ```ts
 * const is123 = Soit([1, 2, 3]);
 * if(is123(value)) { ... }
 * ```
 *
 * @param values array of Literals
 * @returns `Soit` instance
 */
function Soit<V extends SubLiteral<V>>(values: readonly V[]): Soit<V> {
  return _soit(values);
}

export type Infer<S extends Soit> = S extends Soit<infer V> ? V : never;

export default Soit;
