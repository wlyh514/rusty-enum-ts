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
    readonly _data?: S[V];
    match<T>(handlerFns: HandlerFns<S, T> | HandlerFnsWithDefault<S, T>): T;
} & {
    [V in keyof S as V extends string ? `is${V}` : never]: () => boolean;
};
type Option<T> = {
    Some: T;
    None: null;
};
type Result<T, E> = {
    Ok: T;
    Err: E;
};
type Factory<S extends Schema> = {
    [V in keyof S as S[V] extends any[] ? V : never]: (...data: S[V]) => EnumType<S, V>;
} & {
    [V in keyof S as S[V] extends null ? V : never]: () => EnumType<S, V>;
} & {
    [V in keyof S]: (data: S[V]) => EnumType<S, V>;
};
declare function enumFactory<S extends Schema>(): Factory<S>;
export { enumFactory };
export type { EnumType, Option, Result };
