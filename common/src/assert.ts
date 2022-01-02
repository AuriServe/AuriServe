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
 * Given a primitive type name or prototype, checks if the value provided is of the given type.
 * If the type is a primitive type name, it will perform a `typeof` check, with the special case that `undefined`
 * will not be considered of type 'object', use 'undefined' to check for undefined values.
 * Otherwise, it will perform an instanceof check on the value.
 *
 * @param val - The value to check the type of.
 * @param type - A primitive type name (e.g, string, number, boolean, undefined), or a prototype.
 * @returns true if the value is the given type, false otherwise.
 */

 export function isType(val: any, type: Primitive | Function) {
	if (typeof type === 'string') {
		if (type === 'undefined' && typeof val !== undefined) return false;
		else if (type !== 'undefined' && (typeof val !== type || val === undefined)) return false;
	}
	else if (!(val instanceof (type as any))) return false;
	return true
}

type PrimitiveArray = `${Primitive}[]`;

export interface Schema {
	[ key: string ]: (Primitive | PrimitiveArray | Schema) | (Primitive | PrimitiveArray | Schema)[];
}

export function isRawObject(obj: any): obj is Object {
	return obj && obj.constructor === Object || false;
}

function isSchema(val: Primitive | PrimitiveArray | Schema): val is Schema {
	return isRawObject(val);
}

function isPrimitiveArray(str: Primitive | PrimitiveArray): str is PrimitiveArray {
	return str.includes('[]');
}

export function matchesSchema(object: any, schema: Schema, path: string = ''): true | string {
	if (!isRawObject(object)) return 'Not an object.';
	for (const [ key, validation ] of Object.entries(schema)) {
		const validations = Array.isArray(validation) ? validation : [ validation ];

		let extraKeys = Object.keys(object).filter(key => schema[key] === undefined).map(key => `'${path}${key}'`);
		if (extraKeys.length > 0) {
			const keysStr = extraKeys.length === 1
				? extraKeys[0]
				: extraKeys.length === 2
					? `${extraKeys[0]} and ${extraKeys[1]}`
					: `${extraKeys.slice(0, -1).join(', ')}, and ${extraKeys.slice(-1)}`;

			return `Unknown propert${extraKeys.length >= 2 ? 'ies' : 'y'} ${keysStr}.`;
		}

		let anyValid = false;
		for (let validation of validations) {
			if (isSchema(validation)) {
				const matches = matchesSchema(object[key], validation as Schema, `${path}${key}.`);
				if (matches === true) {
					anyValid = true;
					break;
				}
			}
			else if (isPrimitiveArray(validation)) {
				const nonArrayPrimitive = validation.replace('[]', '') as Primitive;
				if (Array.isArray(object[key])) {
					let valid = true;
					for (const val of object[key]) {
						if (!isType(val, nonArrayPrimitive)) {
							valid = false;
							break;
						}
					}
					if (valid) {
						anyValid = true;
						break;
					}
				}
			}
			else {
				if (isType(object[key], validation)) {
					anyValid = true;
					break;
				}
			}
		}

		if (!anyValid) {
			const typesArr = validations.map(v => isRawObject(v) ? '[subschema]' : (v as any).toString());
			const typesStr = typesArr.length === 1
				? typesArr[0]
				: typesArr.length === 2
					? `${typesArr[0]} or ${typesArr[1]}`
					: `${typesArr.slice(0, -1).join(', ')}, or ${typesArr.slice(-1)}`;

			return `'${path}${key}' must be ${typesStr}.`;
		}

	}
	return true;
}

export function assertSchema<T = any>(object: any, schema: Schema, message: string, ...other: any[]):
	asserts object is T {
	const matches = matchesSchema(object, schema);
	// @ts-ignore
	if (typeof matches === 'string') assert(false, message + `: ${matches}`, ...other);
}
