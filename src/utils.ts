import { EnumType, HandlerFns, HandlerFnsWithDefault, Schema, enumFactory } from "./core";
import { Result } from "./enums";

function match<S extends Schema, R>(rustyEnum: EnumType<S, any>, handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): R {
  return rustyEnum.match<R>(handlerFns);
}

function ifLet<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, variant: V, cb: (val: S[V]) => R): R | null {
  if (rustyEnum._variant === variant) {
    return cb(rustyEnum._data!);
  }
  return null;
}

function enumifyFn<E, F extends (...args: any[]) => any>(fn: F): (...args: Parameters<F>) => EnumType<Result<ReturnType<F>, E>> {
  return (...args) => {
    try {
      return enumFactory<Result<ReturnType<F>, E>>().Ok(fn(...args));
    } catch (e) {
      return enumFactory<Result<ReturnType<F>, E>>().Err(e as E);
    }
  }
}

// function foo<E, F extends (...args: any[]) => any>(fn: F): {ok?: ReturnType<F>, err?: E} {
//   return {}
// }
// foo<Error>(sampleFn);

export { match, ifLet, enumifyFn };