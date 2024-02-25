"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumifyFn = exports.ifLet = exports.match = void 0;
const core_1 = require("./core");
function match(rustyEnum, handlerFns) {
    return rustyEnum.match(handlerFns);
}
exports.match = match;
function ifLet(rustyEnum, variant, cb) {
    if (rustyEnum._variant === variant) {
        return cb(rustyEnum._data);
    }
    return null;
}
exports.ifLet = ifLet;
function enumifyFn(fn) {
    return (...args) => {
        try {
            return (0, core_1.enumFactory)().Ok(fn(...args));
        }
        catch (e) {
            return (0, core_1.enumFactory)().Err(e);
        }
    };
}
exports.enumifyFn = enumifyFn;
