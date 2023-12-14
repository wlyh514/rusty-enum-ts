"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intoResultPromise = exports.intoOptionPromise = exports.asyncMatch = exports.ifLet = exports.match = exports.Enum = void 0;
/**
 * Rust-styled enum in typescript;
 */
const core_1 = require("./core");
Object.defineProperty(exports, "Enum", { enumerable: true, get: function () { return core_1.enumFactory; } });
const utils_1 = require("./utils");
Object.defineProperty(exports, "match", { enumerable: true, get: function () { return utils_1.match; } });
Object.defineProperty(exports, "ifLet", { enumerable: true, get: function () { return utils_1.ifLet; } });
const async_1 = require("./async");
Object.defineProperty(exports, "asyncMatch", { enumerable: true, get: function () { return async_1.asyncMatch; } });
Object.defineProperty(exports, "intoOptionPromise", { enumerable: true, get: function () { return async_1.intoOptionPromise; } });
Object.defineProperty(exports, "intoResultPromise", { enumerable: true, get: function () { return async_1.intoResultPromise; } });
