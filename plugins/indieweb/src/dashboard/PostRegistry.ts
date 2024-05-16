import { assert } from 'common';
import { ComponentChildren, FunctionalComponent } from 'preact';

import { Post } from '../common/Type';

import BlogPostType from './post_type/BlogPost';
import NotePostType from './post_type/NotePost';
import UnknownPostType from './post_type/UnknownPost';

export interface DashboardPostType<Data extends Record<string, any> = Record<string, any>> {
	/** The post's type. */
	type: string;

	/** The post type's friendly label. */
	label?: string;

	/** The post type icon. */
	icon: string;

	/** A function to return the post type preview. */
	preview: (data: Post<Data>) => ComponentChildren;

	/** The post type's editor component. */
	editor: FunctionalComponent<{}>;
}

const POST_TYPES = new Map<string, DashboardPostType<Record<string, any>>>();

export function register<T extends Record<string, any>>(type: DashboardPostType<T>) {
	assert(type.type, 'Post type must not be an empty string.');
	assert(!POST_TYPES.has(type.type), `Post type '${type.type}' already exists.`);
	POST_TYPES.set(type.type, type as any);
}

export function get(type: string): DashboardPostType | null {
	return POST_TYPES.get(type) ?? null;
}

export function remove(type: string) {
	POST_TYPES.delete(type);
}

export function list() {
	return Array.from(POST_TYPES.keys());
}

export const unknown = UnknownPostType;
register(unknown);

// Add the default post types to the post registry.

register(BlogPostType);
register(NotePostType);
