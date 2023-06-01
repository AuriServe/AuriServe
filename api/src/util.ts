/**
 * Merges string CSS classes. Anything falsey will be ignored.
 */

export declare function merge(...classes: any[]): string;

/**
 * An error thrown by `ensure`.
 */

// eslint-disable-next-line
export default interface EnsureError extends Error {};

/**
 * Asserts a condition, throwing an ensure error if the condition is false.
 */

export declare function ensure(condition: any, message?: string): asserts condition;
