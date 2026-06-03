/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as baskets from "../baskets.js";
import type * as files from "../files.js";
import type * as matching from "../matching.js";
import type * as products from "../products.js";
import type * as receipts from "../receipts.js";
import type * as seedData from "../seedData.js";
import type * as trips from "../trips.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  baskets: typeof baskets;
  files: typeof files;
  matching: typeof matching;
  products: typeof products;
  receipts: typeof receipts;
  seedData: typeof seedData;
  trips: typeof trips;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
