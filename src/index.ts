type Literal = string | number | boolean;

type Options<O> = { options: readonly O[] };

type SubSoit<O extends Literal> = <S extends O[]>(
  ...subOptions: S
) => Soit<S[number]>;

type Soit<O extends Literal> = ((testedOption: Literal) => testedOption is O) &
  Options<O> & { sub: SubSoit<O> };

type LiteralOrOptions<L extends Literal = Literal> = Literal | Soit<L> | Options<L>;

export type Infer<O extends LiteralOrOptions> = O extends Options<Literal>
  ? O['options'][number]
  : O;

function Soit<T extends LiteralOrOptions, A extends T, R extends Literal[]>(
  optionA: A,
  ...restOptions: R
): Soit<Infer<A> | R[number]>;

function Soit<
  T extends LiteralOrOptions,
  A extends T,
  B extends T,
  R extends Literal[]
>(
  optionA: A,
  optionB: B,
  ...restOptions: R
): Soit<Infer<A> | Infer<B> | R[number]>;

function Soit<
  T extends LiteralOrOptions,
  A extends T,
  B extends T,
  C extends T,
  R extends Literal[]
>(
  optionA: A,
  optionB: B,
  optionC: C,
  ...restOptions: R
): Soit<Infer<A> | Infer<B> | Infer<C> | R[number]>;

function Soit<
  T extends LiteralOrOptions,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  R extends Literal[]
>(
  optionA: A,
  optionB: B,
  optionC: C,
  optionD: D,
  ...restOptions: R
): Soit<Infer<A> | Infer<B> | Infer<C> | Infer<D> | R[number]>;

function Soit(...inputOptions: readonly LiteralOrOptions[]) {
  const set: Set<Literal> = inputOptions.reduce(
    (acc: Set<Literal>, option: LiteralOrOptions) => {
      // Soit instances actually have the "function" type on runtime
      if (typeof option === 'function' || typeof option === 'object') {
        if ('options' in option) {
          return new Set([...Array.from(acc), ...option.options]);
        }
        return acc;
      }
      return new Set([...Array.from(acc), option]);
    },
    new Set([])
  );

  const options = Array.from(set);

  function check(tested: Literal): tested is typeof options[number] {
    return options.some(o => o === tested);
  }

  check.options = options;

  check.sub = Soit;

  return check;
}

export default Soit;
