/**
 * Rust-styled enum in typescript; 
 */

type HandlerFns<S extends Schema, T> = {
  [V in keyof S]: S[V] extends any[] ? ((...p: S[V]) => T) : ((p: S[V]) => T);
}
type HandlerFnsWithDefault<S extends Schema, T> = Partial<HandlerFns<S, T>> & { "_": () => T };

type Schema = Record<string, any>;
type EnumType<S extends Schema, V extends keyof S = keyof S> = {
  readonly _variant: V,
  readonly _data: S[V],
  match<R>(handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): R;
} & {
    [V in keyof S as V extends string ? `is${V}` : never]: () => boolean;
  };

type Factory<S extends Schema> = {
  [V in keyof S as S[V] extends any[] ? V : never]: (...data: S[V]) => EnumType<S, V>;
} & {
    [V in keyof S as S[V] extends null ? V : never]: () => EnumType<S, V>;
  } & {
    [V in keyof S]: (data: S[V]) => EnumType<S, V>;
  }

function _match<S extends Schema, V extends keyof S, T>(this: EnumType<S, V>, handlerFns: Record<V | "_", CallableFunction | undefined>): T {
  if (typeof handlerFns[this._variant] !== "undefined") {
    if ((this._data as any) instanceof Array) {
      return handlerFns[this._variant]!(...this._data as any[]);
    } else {
      return handlerFns[this._variant]!(this._data);
    }
  } else {
    return handlerFns["_"]!();
  }
}

function create(...args: any[]) {
  return new Proxy({
    _variant: args[0],
    _data: args.length > 2 ? args.slice(1) : args[1],
    match: _match,
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

function enumFactory<S extends Schema>(): Factory<S> {
  return factoryProxy as Factory<S>;
}

function match<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): R {
  return rustyEnum.match<R>(handlerFns);
}

function ifLet<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, variant: V, cb: (val: S[V]) => R): R | null {
  if (rustyEnum._variant === variant) {
    return cb(rustyEnum._data!);
  }
  return null;
}

const factoryInstance: Factory<any> = {};

const factoryProxy = new Proxy(factoryInstance, {
  get(target, prop, receiver) {
    return (...args: any[]) => create(prop, ...args);
  }
});

type Option<T> = {
  Some: T,
  None: null,
}
type Result<T, E> = {
  Ok: T,
  Err: E
}

export { enumFactory, match, ifLet };
export type { EnumType, Option, Result };