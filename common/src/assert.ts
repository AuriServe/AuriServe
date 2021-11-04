/*!
 * Assertion functions to streamline sanitization and validation.
 */

/** An error caused by a failed assertion. */
export class AssertError extends Error {
	constructor(...params: any[]) {
		super(...params);
		if (Error.captureStackTrace) Error.captureStackTrace(this, AssertError);
		this.name = 'AssertError';
	}
}

/**
 * Throws an AssertError if the condition is false.
 *
 * @param condition - The condition to test.
 * @param message - The message to store in the AssertError.
 */

export function assert(condition: any, message: string): asserts condition;

/**
 * Throws an Error of type `error` if the condition is false.
 *
 * @param condition - The condition to test.
 * @param message - The message to store in the error.
 * @param error - The type of error to throw.
 */

export function assert(condition: any, message: string, error: any): asserts condition;

/**
 * Throws an Error of type `error` if the condition is false,
 * provides the `message` and `params` to the error's constructor.
 *
 * @param condition - The condition to test.
 * @param message - The message to store in the error.
 * @param error - The type of error to throw.
 * @param params - The parameters to pass to the error's constructor after 'message'.
 */

export function assert(condition: any, message: string, error: any, ...params: any[]): asserts condition;

/**
 * Implementation of assert, as defined by the above overloads.
 *
 * @param condition - The condition to test.
 * @param message - The message to store in the error.
 * @param other - The first value is the custom error type, if any, and the remainder are additional parameters.
 */

export function assert(condition: any, message: string, ...other: any[]): asserts condition {
	if (!condition) throw new (other[0] ?? AssertError)(message, ...(other.length > 1 ? other.slice(1) : []));
}

/**
 * Throws an AssertError if `a` and `b` are not equivalent.
 *
 * @param a - The first value to check.
 * @param b - The second value to check.
 * @param message - The message to store in the AssertError.
 */

 export function assertEq(a: any, b: any, message: string): void;

/**
 * Throws an Error of type `error` if `a` and `b` are not equivalent.
 *
 * @param a - The first value to check.
 * @param b - The second value to check.
 * @param message - The message to store in the error.
 * @param error - The type of error to throw.
 */

 export function assertEq(a: any, b: any, message: string, error: any): void;

/**
 * Throws an Error of type `error` if `a` and `b` are not equivalent.
 * provides the `message` and `params` to the error's constructor.
 *
 * @param a - The first value to check.
 * @param b - The second value to check.
 * @param message - The message to store in the error.
 * @param error - The type of error to throw.
 * @param params - The parameters to pass to the error's constructor after 'message'.
 */

export function assertEq(a: any, b: any, message: string, error: any, ...params: any[]): void;

/**
 * Implementation of assertEq, as defined by the above overloads.
 *
 * @param a - The first value to check.
 * @param b - The second value to check.
 * @param message - The message to store in the error.
 * @param other - The first value is the custom error type, if any, and the remainder are additional parameters.
 */

export function assertEq(a: any, b: any, message: string, ...other: any[]) {
	// @ts-ignore
	if (a !== b) return assert(false, message + ` (${a} != ${b})`, ...other);
}

/**
 * A primitive type name for use in `isType`.
 * Note that these types do note exactly match Javascript primitives, with an important
 * distinction being that undefined is considered a primitive, and does not satisfy 'object'.
 */

type Primitive = 'string' | 'number' | 'boolean' | 'object' | 'null' | 'undefined';

/**
 * Given a primitive type name or prototype, checks if the arguments provided are of the given type.
 * If the type is a primitive type name, it will perform a `typeof` check, with the special case that `undefined`
 * will not be considered of type 'object', use 'undefined' to check for undefined values.
 * Otherwise, it will perform an instanceof check on the arguments.
 *
 * @param type - A primitive type name (e.g, string, number, boolean, undefined), or a prototype.
 * @param args - The arguments to check against the type.
 * @returns true if the arguments are all of the given type, false otherwise.
 */

export function isType(type: Primitive | Function, ...args: any[]) {
	if (typeof type === 'string') {
		if (type === 'undefined') for (const val of args) if (typeof val !== undefined) return false;
		else for (const val of args) if (typeof val !== type || val === undefined) return false;
	}
	else for (const val of args) if (!(val instanceof (type as any))) return false;
	return true
}
