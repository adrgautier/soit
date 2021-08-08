# Soit

 **Soit** (French for: either) aims to easily create type guards from arrays of literals.

## Motivation

The `enum` feature of typescript is not ideal. It does not provide type guards and is not iterable. 

I wanted a simple lib which provides a type guard function from a list of values and which remains iterable. 

> Inspired from the [enum feature of zod](https://github.com/colinhacks/zod/tree/v1#zod-enums).

## Definition

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

*Soit* instances are iterable and can be used to create new definitions.
```ts
const isColor = Soit([...isWarmColor, "green", "blue"]);

type Color = Infer<typeof isColor>; // infers "red" | "orange" | "green" | "blue"
```

## Guard

A *Soit* instance is intended to be used as a type guard :
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

Because the *Soit* instance is iterable, you can access the corresponding array :
```ts
const colors = Array.from(isColor);
```

You may prefer this syntax :
```ts
const colors = [...isColor];
```

`map` and `forEach` can be used without `Array.from()`. 
```ts
isColor.forEach((color) => console.log(color));

const uppercaseColors = isColor.map(color => color.toUpperCase())
```

## Set utils

### `.subset([])`

You can create subsets using the `subset` method.
```ts
const isWarmColor = isColor.subset(["red", "orange"]);
```

> This checks on build time that `"red"` and `"orange"` do exist in the `isColor` instance.

### `.extend([])`

You can extend an existing soit instance using the `extend` method.
```ts
const isColor = isWarmColor.extend(["blue", "green"]);
```

### `.difference([])`
You can create a new intance without the specified values using the `difference` method.

```ts
const isColdColor = isColor.difference(["red", "orange", "yellow"]);
```

> The given array don't need to be a subset and can containt values that don't exist in the initial instance.