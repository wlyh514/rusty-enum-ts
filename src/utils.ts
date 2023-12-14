import { EnumType, HandlerFns, HandlerFnsWithDefault, Schema } from "./core";

function match<S extends Schema, R>(rustyEnum: EnumType<S, any>, handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): R {
  return rustyEnum.match<R>(handlerFns);
}

function ifLet<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, variant: V, cb: (val: S[V]) => R): R | null {
  if (rustyEnum._variant === variant) {
    return cb(rustyEnum._data!);
  }
  return null;
}

export { match, ifLet };