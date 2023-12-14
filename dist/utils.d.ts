import { EnumType, HandlerFns, HandlerFnsWithDefault, Schema } from "./core";
declare function match<S extends Schema, R>(rustyEnum: EnumType<S, any>, handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): R;
declare function ifLet<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, variant: V, cb: (val: S[V]) => R): R | null;
export { match, ifLet };
