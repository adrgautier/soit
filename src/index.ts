type Literal = string | number | boolean;

type Options<O> = { options: readonly O[] };

type Soit<O extends Literal> = ((testedOption: Literal) => testedOption is O) &
  Options<O>;

type LiteralOrOptions = Literal | Soit<Literal> | Options<Literal>;

export type Infer<O extends LiteralOrOptions> = O extends Options<Literal>
  ? O['options'][number]
  : O;

function soit<T extends LiteralOrOptions, A extends T, R extends Literal[]>(
  optionA: A,
  ...restOptions: R
): Soit<Infer<A> | R[number]>;

function soit<
  T extends LiteralOrOptions,
  A extends T,
  B extends T,
  R extends Literal[]
>(
  optionA: A,
  optionB: B,
  ...restOptions: R
): Soit<Infer<A> | Infer<B> | R[number]>;

function soit<
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

function soit<
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

function soit(...inputOptions: readonly LiteralOrOptions[]) {
  const options: Literal[] = inputOptions.reduce(
    (acc: Literal[], option: LiteralOrOptions) => {
      // soit instances actually have the "function" type on runtime
      if (typeof option === 'function' || typeof option === 'object') {
        if ('options' in option) {
          return [...acc, ...option.options];
        }
        return acc;
      }
      return [...acc, option];
    },
    []
  );

  function check(tested: Literal): tested is typeof options[number] {
    return options.some(o => o === tested);
  }

  check.options = options;

  return check;
}

export default soit;
