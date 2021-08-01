type Primitive = string | number | boolean;

export type Infer<O extends Primitive | { options: readonly Primitive[]}> = O extends { options: readonly Primitive[]} ? O["options"][number]: O;

type SoitInstance<O extends Primitive> = ((testedOption: Primitive) => testedOption is O) & { options: readonly O[] };

/**
 * Max instances in arguments = 4
 * Unlimited primitive in arguments
 */
function Soit<T extends Primitive | { options: readonly Primitive[] }, A extends T, B extends T, R extends readonly Primitive[]>(optionA: A, optionB: B, ...restOptions: R): SoitInstance<Infer<A> | Infer<B> | R[number]>;
function Soit<T extends Primitive | { options: readonly Primitive[] }, A extends T, B extends T, C extends T, R extends readonly Primitive[]>(optionA: A, optionB: B, optionC: C, ...restOptions: R): SoitInstance<Infer<A> | Infer<B> | Infer<C> | R[number]>;
function Soit<T extends Primitive | { options: readonly Primitive[] }, A extends T, B extends T, C extends T, D extends T, R extends readonly Primitive[]>(optionA: A, optionB: B, optionC: C, optionD: D, ...restOptions: R): SoitInstance<Infer<A> | Infer<B> | Infer<C> | Infer<D> | R[number]>;

function Soit<T extends Primitive | { options: readonly Primitive[] }>(...inputOptions: readonly T[]) {
    const options: readonly Primitive[] = inputOptions.reduce((acc, option) => {
        if(typeof option === "object") {
            return [
                ...acc,
                ...option.options
            ]
        }
        else {
            return [
                ...acc,
                option
            ]
        }
    }, []);

    function check(testedOption: Primitive): testedOption is (typeof options[number]) {
        return options.some(o => o === testedOption);
    }

    check.options = options;

    return check;
}

export default Soit;