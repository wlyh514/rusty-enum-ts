"use strict";
/**
 * Rust-styled enum in typescript;
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumFactory = void 0;
function match(handlerFns) {
    if (typeof handlerFns[this._variant] !== "undefined") {
        if (this._data instanceof Array) {
            return handlerFns[this._variant](...this._data);
        }
        else {
            return handlerFns[this._variant](this._data);
        }
    }
    else {
        return handlerFns["_"]();
    }
}
function create(...args) {
    return new Proxy({
        _variant: args[0],
        _data: args.length > 2 ? args.slice(1) : args[1],
        match,
    }, {
        get(target, prop, receiver) {
            const propStr = prop.toString();
            if (propStr.startsWith("is")) {
                return () => target._variant === propStr.substring(2);
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}
function enumFactory() {
    return factoryProxy;
}
exports.enumFactory = enumFactory;
const factoryInstance = {};
const factoryProxy = new Proxy(factoryInstance, {
    get(target, prop, receiver) {
        return (...args) => create(prop, ...args);
    }
});
