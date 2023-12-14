"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifLet = exports.match = void 0;
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
