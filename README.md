# Soit

 **Soit** (French for: either) aims to easily create type guards based on lists of literals.

## Motivation

The `enum` feature of typescript is not ideal. It does not provide type guards and is not iterable. 

I wanted a simple lib which provides a type guard function from a list of values and a easy way to iterate on this list. 

> Inspired from the [enum feature of zod](https://github.com/colinhacks/zod/tree/v1#zod-enums).

## Definitions

A *Soit* instance can be created by passing literals (string, number or boolean) as arguments to the `Soit` function.

```ts
const isWarmColor = Soit("red", "orange");
```

You can infer the corresponding union using the `Infer` "helper" provided by the lib.
```ts
type WarmColor = Infer<typeof isWarmColor>; // returns "red" | "orange"
```

You can pass as many literals as you want.
```ts
const isColdColor = Soit("blue", "cyan", "teal");
```

You can also use other *Soit* instances to create new definitions.

```ts
const isColor = Soit(isWarmColor, isColdColor, "green");

type Color = Infer<typeof isColor>; // returns "red" | "orange" | "blue" | "cyan" | "teal" | "green"
```

> Note: due to typescript limits, you can pass up to 4 *Soit* instances.
> However there are no limits for literals. 


## Guard

The *Soit* instance is intended to be used as a type guard :
```ts
function describeColor(color: Color) {
    if(isWarmColor(color)) {
        // color can be "red" | "orange"
        return "This is a warm color.";
    }
    // color can be "blue" | "cyan" | "teal" | "green"
    return "This is a cold color.";
}
```

## Options

You can also access the array of options from the *Soit* instance :

```ts
isColor.options.forEach((color) => console.log(color));
```