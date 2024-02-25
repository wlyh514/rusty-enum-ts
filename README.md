# Rusty Enum

A lightweight Rust/Haskell-like enum for Typescript, with some runtime overhead.

## Overview

`rusty-enum` aims to replicate the rust enum syntax, and chooses to provide an easy-to-use API. As a result, some runtime overhead is required. For a 0kb Rust-like enum for Typescript, see [unenum](https://github.com/peterboyer/unenum).

### Defining an Enum

```typescript
import {EnumType, Enum} from "rusty-enum"; 

/* Define an enum schema as an interface.  */
interface Message {
  Quit: null,
  Move: { x: number, y: number },
  Write: string,
  ChangeColor: [number, number, number]
};
/* Acquire a factory for your enum. This returns a global factory instance. */
const Message = Enum<Message>();

```

### Instantiation

```typescript
const quitMsg = Message.Quit();
const moveMsg = Message.Move({ x: 42, y: 64 });
const writeMsg = Message.Write("some text");
const changeColorMsg = Message.ChangeColor(102, 204, 255);
```

### Variant Matching

`rusty-enum` enforces compile-time exhaustive matching. You can either provide matching handlers for every possible variant

```typescript
function handleMsg(msg: EnumType<Message>) {
  return msg.match({
    Move: ({ x, y }) => `moved to (${x}, ${y})`,
    Write: (s) => `wrote '${s}'`,
    ChangeColor: (r, g, b) => `color changed to rgb(${r}, ${g}, ${b})`,
    Quit: () => "someone quit",
  });
  // Or equivalently
  return match(msg, {
    Move: ({ x, y }) => `moved to (${x}, ${y})`,
    Write: (s) => `wrote '${s}'`,
    ChangeColor: (r, g, b) => `color changed to rgb(${r}, ${g}, ${b})`,
    Quit: () => "someone quit",
  });
}
```

...or provide a wildcard handler.

```typescript
function handleMsgWithDefault(msg: EnumType<Message>) {
  return msg.match({
    Write: () => "a message is written",
    _: () => "nothing is written",
  });
}
```

By default, `rusty-enum` expects all arms to return the same type, unless a union type is provided explicitly.

```typescript
msg.match<number | string>({
  Write: () => 42, 
  _: () => "Fourty-two",
});

/* This does not compile */
msg.match({
  Write: () => 42, 
  _: () => "Fourty-two",
});
```

If you are only interested in a certain variant, you can use the `ifLet` util function.

```typescript
function ifLet(rustyEnum, variant, cb);

const moveX = ifLet(moveMsg, "Move", ({ x }) => x);
expect(moveX).toEqual(42);
```

If `rustyEnum` is of variant `variant`, `cb` is executed with `rustyEnum`'s data, and the return value is returned. Otherwise `null` is returned immediately.

To determine the variant of an enum without unwrapping its content, use `enum.is${Variant}()`.

```typescript
msg.isQuit();
msg.isMove();
msg.isWrite();
msg.isChangeColor();
```

Or directly access the `._variant` readonly attribute.

```typescript
msg._variant;
```

### Result and Option

`rusty-enum` comes with `Result<T, E>` and `Option<T>`.

```typescript
import {EnumType, Result} from "rusty-enum";

type QueryResult = Result<number, Error>;

function handleQueryResult(res: EnumType<QueryResult>) {
  res.match({
    Ok: (num) => console.log(num),
    Err: (err) => console.error(err),
  });
  return res.isOk();
}
```

### Enum in Promise and Async Matching

```typescript
async function msgPromise(): EnumPromise<Message> {
  return Message.Move({x: 42, y: 64});
}
```

An async function that returns an enum can have its return type as `EnumPromise<S>`, which is short for `Promise<EnumType<S>>`. An `EnumPromise<S>` can be processed by `asyncMatch`.

```typescript
const moveMsgPromise = msgPromise();
const x = await asyncMatch(moveMsgPromise, {
  Move({ x }) {
    return x;
  },
  _: () => 0
});

expect(x).toEqual(42);
```

### Converting JS Promises into Enums

A JS `Promise<T>` can be converted into `OptionPromise<T>` or `ResultPromise<T, E>`.

`intoOptionPromise(p: Promise<T>)` return `OptionPromise.Some(T)` if `p` is resolved, or `OptionPromise.None()` if it is rejected.

Similarly, `intoResultPromise(p: Promise<T>)` return `ResultPromise.Ok(T)` if `p` is resolved, or `ResultPromise.Err(err)` if it is rejected, where `err` is the reason of rejection with type `any`.

Additionally, `intoResultPromise` accepts a callback function, where the `any` typed `err` can be mapped into a given error type `E`.

```typescript
const rejectPromise: Promise<number> = new Promise((_, rej) => rej(42));
const rejectResult = await intoResultPromise<number, string>(rejectPromise, (err) => err.toString());
```

Read more in the library [test script](./tests/rusty-enum.test.ts).

### Converting Error-Throwing Functions into Result-Returning Functions

```typescript
function foo(arg: number) {
  if (isNaN(arg)) {
    throw "Sample error string";
  } else {
    return 42;
  }
}
const enumifiedFoo = enumifyFn<string, typeof foo>(foo);
// OR
const enumifiedFoo = enumifyFn(foo); // returns Result<number, unknown>

enumifiedFoo(43).match({
  Ok(res) {
    ...
  },
  Err(err) {
    ...
  }
})
```

## Runtime Costs

For creating enum instances, one and only one factory object is created by `rusty-enum`.

```typescript
const factoryInstance: Factory<any> = {};

const factoryProxy = new Proxy(factoryInstance, {
  get(target, prop, receiver) {
    return (...args: any[]) => create(prop, ...args);
  }
});
```

Every enum instance is proxied to support `.is${Variant}()` methods.

```typescript
function create(...args: any[]) {
  return new Proxy({
    _variant: args[0],
    _data: args.length > 2 ? args.slice(1) : args[1],
    match,
  }, {
    get(target, prop, receiver) {
      const propStr = prop.toString();
      if (propStr.startsWith("is")) {
        return () => target._variant === propStr.substring(2)
      }
      return Reflect.get(target, prop, receiver);
    }
  })
}
```
