"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.intoResultPromise = exports.intoOptionPromise = exports.asyncMatch = void 0;
const core_1 = require("./core");
function asyncMatch(enumPromise, handlerFns) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield enumPromise).match(handlerFns);
    });
}
exports.asyncMatch = asyncMatch;
function intoOptionPromise(promise) {
    return promise
        .then(val => core_1.factoryProxy.Some(val))
        .catch(_ => core_1.factoryProxy.None());
}
exports.intoOptionPromise = intoOptionPromise;
function intoResultPromise(promise, mapErr) {
    return promise
        .then(val => core_1.factoryProxy.Ok(val))
        .catch(err => {
        if (mapErr) {
            return core_1.factoryProxy.Err(mapErr(err));
        }
        return core_1.factoryProxy.Err(err);
    });
}
exports.intoResultPromise = intoResultPromise;
