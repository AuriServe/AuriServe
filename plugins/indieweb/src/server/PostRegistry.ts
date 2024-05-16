import { assert } from 'common';

export interface ServerPostType {
	/** The post's type. */
	type: string;

	/** Called when a post is created. Must return a post data object. */
	onCreate: () => Record<string, any>;

	/** Called by the post mutator. Must return the post's new data object. */
	onUpdate: (currentData: Record<string, any>, update: unknown) => Record<string, any>;
}

const POST_TYPES = new Map<string, ServerPostType>();

export function register(type: ServerPostType) {
	assert(type.type, 'Post type must not be an empty string.');
	assert(!POST_TYPES.has(type.type), `Post type '${type.type}' already exists.`);
	POST_TYPES.set(type.type, type);
}

export function get(type: string): ServerPostType | null {
	return POST_TYPES.get(type) ?? null;
}

export function remove(type: string) {
	POST_TYPES.delete(type);
}

export function list() {
	return Array.from(POST_TYPES.keys());
}
