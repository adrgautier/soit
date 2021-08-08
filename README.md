# Soit

 **Soit** (French for: either) aims to easily create type guards based on lists of literals.

## Motivation

The `enum` feature of typescript is not ideal. It does not provide type guards and is not iterable. 

I wanted a simple lib which provides a type guard function from a list of values and a easy way to iterate on this list. 

> Inspired from the [enum feature of zod](https://github.com/colinhacks/zod/tree/v1#zod-enums).

## Definitions

A *Soit* instance can be created by passing literals (string, number or boolean) in an array to the `Soit` function.

```ts
const isWarmColor = Soit(["red", "orange"]);
```

You can infer the corresponding union using the `Infer` "helper" provided by the lib.
```ts
type WarmColor = Infer<typeof isWarmColor>; // returns "red" | "orange"
```

You can pass any string, number or boolean you want.
```ts
const isColdColor = Soit(["one", 1, true]);
```

*Soit* instances are iterable and can be used to create new definitions.

```ts
const isColor = Soit([...isWarmColor, "green", "blue"]);

type Color = Infer<typeof isColor>; // returns "red" | "orange" | "green"
```

## Guard

The *Soit* instance is intended to be used as a type guard :
```ts
function handleColor(color: Color) {
    if(isWarmColor(color)) {
        // color can be "red" | "orange"
    }
    // color can be "blue" | "green"
}
```

You can also check a prop from an object :
```ts
function handleColor(car: Ferrari | Lamborghini) {
    if(isRedColor(car, "color")) {
        // car is Ferrari
    }
    // car is Lamborghini
}
```
> This aims to infer the type of the object.
> Doing `isRedColor(car.color)` would not work to infer car's type. 

## Array utils

Because the *Soit* instance is iterable, you can access the corresponding array:
```ts
const colors = Array.from(isColor);
```

`map` and `forEach` can be used without `Array.from()`. 
```ts
isColor.forEach((color) => console.log(color));
```

## Set utils

You can create subsets using the `subset` method.

```ts
const isWarmColor = isColor.subset(["red", "orange"]);
```

This checks on build time that `"red"` and `"orange"` do exist in the `isColor` instance.