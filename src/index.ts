/**
 * Rust-styled enum in typescript; 
 */
import { enumFactory } from "./core";
import type { EnumType } from "./core";
import { match, ifLet } from "./utils";
import { asyncMatch, intoOptionPromise, intoResultPromise } from "./async";
import type { EnumPromise } from "./async";

export { enumFactory as Enum, match, ifLet, asyncMatch, intoOptionPromise, intoResultPromise };
export type { EnumType, EnumPromise };