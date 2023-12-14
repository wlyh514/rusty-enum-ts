import { EnumType, HandlerFns, HandlerFnsWithDefault, Schema, factoryProxy } from "./core";
import { Option, Result } from "./enums";

type EnumPromise<S extends Schema, V extends keyof S = keyof S> = Promise<EnumType<S, V>>;
async function asyncMatch<S extends Schema, R>(enumPromise: EnumPromise<S, any>, handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): Promise<R> {
  return (await enumPromise).match(handlerFns);
}

type ResultPromise<T, E, V extends keyof Result<T, E> = keyof Result<T, E>> = EnumPromise<Result<T, E>, V>;
type OptionPromise<T, V extends keyof Option<T> = keyof Option<T>> = EnumPromise<Option<T>, V>;

function intoOptionPromise<T>(promise: Promise<T>): OptionPromise<T> {
  return promise
    .then(val => factoryProxy.Some(val) as any as OptionPromise<T, "Some">)
    .catch(_ => factoryProxy.None() as any as OptionPromise<T, "None">);
}

function intoResultPromise<T, E>(promise: Promise<T>, mapErr: (err: any) => E): ResultPromise<T, E>;
function intoResultPromise<T>(promise: Promise<T>): ResultPromise<T, any>;

function intoResultPromise<T, E = any>(promise: Promise<T>, mapErr?: (err: any) => E): ResultPromise<T, E> {
  return promise
    .then(val => factoryProxy.Ok(val) as any as ResultPromise<T, any, "Ok">)
    .catch(err => {
      if (mapErr) {
        return factoryProxy.Err(mapErr(err)) as any as ResultPromise<T, E, "Err">
      }
      return factoryProxy.Err(err) as any as ResultPromise<T, any, "Err">
    });
}

export { asyncMatch, intoOptionPromise, intoResultPromise };
export type { EnumPromise, ResultPromise, OptionPromise }