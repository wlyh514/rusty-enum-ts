/**
 * Rust-styled enum in typescript; 
 */
import { enumFactory } from "./core";
import type { EnumType } from "./core";
import { match, ifLet, enumifyFn } from "./utils";
import { asyncMatch, intoOptionPromise, intoResultPromise } from "./async";
import type { EnumPromise } from "./async";
import type { Result, Option } from "./enums";

export { enumFactory as Enum, match, ifLet, asyncMatch, intoOptionPromise, intoResultPromise, enumifyFn };
export type { EnumType, EnumPromise, Result, Option };