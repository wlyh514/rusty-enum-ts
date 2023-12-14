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
declare const factoryProxy: Factory<any>;
declare function enumFactory<S extends Schema>(): Factory<S>;
export { factoryProxy, enumFactory };
export type { EnumType, Schema, HandlerFns, HandlerFnsWithDefault, Factory };
