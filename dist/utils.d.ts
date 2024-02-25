import { EnumType, HandlerFns, HandlerFnsWithDefault, Schema } from "./core";
import { Result } from "./enums";
declare function match<S extends Schema, R>(rustyEnum: EnumType<S, any>, handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): R;
declare function ifLet<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, variant: V, cb: (val: S[V]) => R): R | null;
declare function enumifyFn<E, F extends (...args: any[]) => any>(fn: F): (...args: Parameters<F>) => EnumType<Result<ReturnType<F>, E>>;
export { match, ifLet, enumifyFn };
