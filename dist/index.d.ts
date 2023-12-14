/**
 * Rust-styled enum in typescript;
 */
type HandlerFns<S extends Schema, T> = {
    [V in keyof S]: S[V] extends any[] ? ((...p: S[V]) => T) : ((p: S[V]) => T);
};
type HandlerFnsWithDefault<S extends Schema, T> = Partial<HandlerFns<S, T>> & {
    "_": () => T;
};
type Schema = Record<string, any>;
type EnumType<S extends Schema, V extends keyof S = keyof S> = {
    readonly _variant: V;
    readonly _data: S[V];
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
};
declare function enumFactory<S extends Schema>(): Factory<S>;
declare function match<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, handlerFns: HandlerFns<S, R> | HandlerFnsWithDefault<S, R>): R;
declare function ifLet<S extends Schema, V extends keyof S, R>(rustyEnum: EnumType<S, any>, variant: V, cb: (val: S[V]) => R): R | null;
type Option<T> = {
    Some: T;
    None: null;
};
type Result<T, E> = {
    Ok: T;
    Err: E;
};
export { enumFactory, match, ifLet };
export type { EnumType, Option, Result };
