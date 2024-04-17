# ![Soit](./Soit.svg)

 ![typescript](https://img.shields.io/badge/written%20for-typescript-3178c6?style=flat-square) [![codecov](https://img.shields.io/codecov/c/github/adrgautier/soit?style=flat-square&token=IPTGBDRRJE)](https://codecov.io/gh/adrgautier/soit) ![prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4?style=flat-square) [![npm](https://img.shields.io/npm/v/soit?style=flat-square)](https://www.npmjs.com/package/soit)

**Soit** (French for: either) is like an enhanced [Set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) function which provides **type narrowing** and **template** <sup>`beta`</sup> utils.

## Motivation

One of the main goal of TypeScript is to deal with **uncertainty**, to ensure that all possibilities have been taken into account during compilation. Sometimes the type itself can be uncertain (e.g. is it a `string` or a  `number`?), but it is also common to know all possible values before runtime.

The simplest way to declare all possible values is to write a union:
```ts
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
```

Another approach is to use the enum feature of TypeScript:
```ts
enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
```

Whatever approach you use, you won't be able (easily) to [narrow a type down](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) to this set of values or to [get an array from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) this set of values.

I created *Soit* to be a simple lib that provide the features aforementioned.

## Declaration

A *Soit* instance can be created by passing an array of *literals* to the `Soit()` function.
```ts
import Soit from "soit";

const isHTTPMethod = Soit(["GET", "POST", "PUT", "DELETE"]);
```

A [literal](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) is a specific string, number or boolean.
```ts
const isOne = Soit(["1", "one", 1, true]);
```

You can infer the corresponding type using the `Infer` generic provided by the lib.
```ts
import { Infer } from "soit";

type HTTPMethod = Infer<typeof isHTTPMethod>; // infers "GET" | "POST" | "PUT" | "DELETE"
```

## Guard behavior

A *Soit* instance is intended to be used as a type guard:
```ts
function handleHTTPMethod(method: string) {
    if(isHTTPMethod(method)) {
        // method's value is "GET", "POST", "PUT" or "DELETE"
    }
    throw new Error("Unknown HTTP method.");
}
```

## Iterable behavior

Because the *Soit* instance is **iterable**, you can access the corresponding array:
```ts
const HTTPMethodArray = Array.from(isHTTPMethod);
```

You may prefer this syntax:
```ts
const HTTPMethodArray = [...isHTTPMethod];
```

## Array methods <sup>`deprecated`</sup>

A *Soit* instance gives access to two Array methods : `map` and `forEach`

```ts
isHTTPMethod.forEach(method => console.log(method));

const lowerCaseHTTPMethodArray = isHTTPMethod.map(method => method.toLowerCase());
```

> `map` and `forEach` are simple shortcuts, e.g. : 
> ```ts
> [...isHTTPMethod].forEach(method => console.log(method));
> ```
>
> The map method for instance can be confusing because it does not return a new *Soit* instance.
> For this reason, both methods will be removed with the next major release.

## Set methods

Set methods aim to create new *Soit* instances by adding or subtracting values from an existing instance.

> I created these methods before the new [composition methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#set_composition) where added to the **Set** object.
> This new API will certainly influence the naming of *Soit* methods in the next major release.

### `.subset([])`

You can create subsets using the `subset` method.
```ts
const isHTTPMutationMethod = isHTTPMethod.subset(["POST", "PUT", "DELETE"]);
```

> This checks on build time that `"POST"`, `"PUT"` and `"DELETE"` do exist in the `isHTTPMethod` instance.

### `.extend([])`

You can extend an existing *Soit* instance using the `extend` method.
```ts
const isHTTPMethod = isHTTPMutationMethod.extend(["GET"]);
```

### `.difference([])`

You can create a new instance without the specified values using the `difference` method.

```ts
const isHTTPQueryMethod = isHTTPMethod.difference(["POST", "PUT", "DELETE"]);
```

> The given array don't need to be a subset and can contain values that don't exist in the initial instance.

## Template <sup>`beta`</sup>

The template feature allows mimicking the [template literal type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#handbook-content) mechanism, but with runtime utils.
Let's take the following template literal type:

```ts
type TimeGetter = `get${"Seconds" | "Minutes" | "Hours"}`;
```

The `TimeGetter` type will only accept the following values: `"getSeconds"`, `"getMinutes"` and `"getHours"`.

Here is how you would use the template feature from *Soit*:

```ts
const isUnit = Soit(["Seconds", "Minutes", "Hours"]);
const isTimeGetter = Soit.Template("get", isUnit);
```
The `Template()` function is able to construct the corresponding template using the strings as the "static" parts and the *Soit* instances as the "dynamic" parts. 

You can get the corresponding type with the usual `Infer` generic.

```ts
type TimeGetter = Infer<typeof isTimeGetter>;
```

### Guard behavior

Like a *Soit* instance, a *SoitTemplate* is intended to be used as a type guard:
```ts
if(isTimeGetter(method)) { ... }
```
The `isTimeGetter` guard will only accept the following values: `"getSeconds"`, `"getMinutes"` and `"getHours"`.

### Capture method 🪄

A *SoitTemplate* instance offers the `capture` method to retrieve the "dynamic" parts of the template from a string. 

```ts
const [unit] = isTimeGetter.capture("getSeconds"); // unit === "Seconds"
```

### Iterable behavior and Array method

A *SoitTemplate* instance is iterable.

```ts
const timeGetterMethods = [...isTimeGetter]; // ["getSeconds", "getMinutes", "getHours"]
```

As with a regular *Soit* instance, you get the `map` and `forEach` shortcuts. 

## Using *Soit* with other tools

### [TS-Pattern](https://github.com/gvergnaud/ts-pattern)

You can easily integrate *Soit* instances to your patterns using the [P.when](https://github.com/gvergnaud/ts-pattern?tab=readme-ov-file#pwhen-patterns) util :

```ts
import { P } from "ts-pattern";

const pattern = P.when(isHTTPMethod);
```

The inference will work as expected with TS-Pattern logic :

```ts
type Pattern = P.infer<typeof pattern>; // infers "GET" | "POST" | "PUT" | "DELETE"
```

### [Zod](https://github.com/colinhacks/zod)

You can integrate *Soit* instances to your Zod schemas using the [custom](https://zod.dev/?id=custom-schemas) util:

```ts
import * as z from "zod";
import { Infer } from "soit";

type HTTPMethod = Infer<typeof isHTTPMethod>;

const HTTPMethodSchema = z.custom<HTTPMethod>(isHTTPMethod);
```

Zod is not able to infer the type on its own, therefore you need to pass the corresponding type (inferred beforehand) in the generic.

## Troubleshoot

### `Type 'string' is not assignable to type 'never'.` ts(2345)

You are maybe trying to create a new *Soit* instance using a named array.

```ts
const HTTPMutationMethods = ["POST", "PUT", "DELETE"];
const isHTTPMutationMethods = Soit(HTTPMutationMethods); // error ts(2345)
```

*Soit* throw this error to prevent passing an unknown set of value (i.e. `string[]`). The solution here is to use the `as const` declaration in order to freeze the values and allow a proper type inference.

```ts
const HTTPMutationMethods = ["POST", "PUT", "DELETE"] as const;
const isHTTPMutationMethods = Soit(HTTPMutationMethods);
```

The `Template()` function also requires freezing the values to allow a proper type inference :
```ts
const template = ['get', Soit(['Seconds', 'Minutes', 'Hours'])] as const;
const isTimeGetter = Soit.Template(...template);
```

This error can also occur if you pass a *Soit* instance directly to a template. You can use `as const` as follows:
```ts
const isTimeGetter = Soit.Template('get', Soit(['Seconds', 'Minutes', 'Hours'] as const));
```