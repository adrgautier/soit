# ![Soit](./Soit.svg)

 ![typescript](https://img.shields.io/badge/written%20for-typescript-3178c6?style=flat-square) [![codecov](https://img.shields.io/codecov/c/github/adrgautier/soit?style=flat-square&token=IPTGBDRRJE)](https://codecov.io/gh/adrgautier/soit) ![prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4?style=flat-square) [![npm](https://img.shields.io/npm/v/soit?style=flat-square)](https://www.npmjs.com/package/soit)

**Soit** (French for: either) is like an enhanced [Set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) function which simplifies **type narrowing** and aims to replace TypeScript enums.

## Motivation

The `enum` feature of TypeScript is not ideal. It does not provide type guards and is not iterable. 

I wanted a simple lib which provides a way to [narrow type](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) to a given set of values and can be iterated. 

> Inspired from the [enum feature of zod](https://github.com/colinhacks/zod/tree/v1#zod-enums).

## Declaration

A *Soit* instance can be created by passing literals (string, number or boolean) in an array to the `Soit` function.
```ts
const isWarmColor = Soit(["red", "orange"]);
```

You can infer the corresponding union using the `Infer` "helper" provided by the lib.
```ts
type WarmColor = Infer<typeof isWarmColor>; // infers "red" | "orange"
```

You can pass any string, number or boolean you want.
```ts
const isColdColor = Soit(["one", 1, true]);
```

*Soit* instances are **iterable** and can be used to create new definitions.
```ts
const isColor = Soit([...isWarmColor, "green", "blue"]);

type Color = Infer<typeof isColor>; // infers "red" | "orange" | "green" | "blue"
```

## Guard

A *Soit* instance is intended to be used as a type guard:
```ts
function handleColor(color: Color) {
    if(isWarmColor(color)) {
        // color can be "red" | "orange"
    }
    // color can be "blue" | "green"
}
```

## Array utils

Because the *Soit* instance is **iterable**, you can access the corresponding array:
```ts
const colors = Array.from(isColor);
```

You may prefer this syntax:
```ts
const colors = [...isColor];
```

`map` and `forEach` can be used without `Array.from()`. 
```ts
isColor.forEach((color) => console.log(color));

const uppercaseColors = isColor.map(color => color.toUpperCase());
```

## Set utils

### `.subset([])`

You can create subsets using the `subset` method.
```ts
const isWarmColor = isColor.subset(["red", "orange"]);
```

> This checks on build time that `"red"` and `"orange"` do exist in the `isColor` instance.

### `.extend([])`

You can extend an existing *Soit* instance using the `extend` method.
```ts
const isColor = isWarmColor.extend(["blue", "green"]);
```

### `.difference([])`
You can create a new instance without the specified values using the `difference` method.

```ts
const isColdColor = isColor.difference(["red", "orange", "yellow"]);
```

> The given array don't need to be a subset and can contain values that don't exist in the initial instance.

## Troubleshoot

### `Type 'string' is not assignable to type 'never'.` ts(2345)

You are maybe trying to create a new *Soit* instance using a named array.

```ts
const warmColors = ["red", "orange"];
const isWarmColor = Soit(warmColors); // error ts(2345)
```

*Soit* throw this error to prevent passing an unknown set of value (i.e. `string[]`). The solution here is to use the `as const` declaration in order to freeze the values and allow a proper type inference.

```ts
const warmColors = ["red", "orange"] as const;
const isWarmColor = Soit(warmColors);
```
