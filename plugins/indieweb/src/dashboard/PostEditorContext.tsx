import { EventEmitter } from 'dashboard';
import { createContext } from 'preact';

import { Post } from '../common/Type';

export type SaveState = 'saving' | 'saved' | 'idle';
export type SaveReason = 'debounce' | 'interval' | 'immediate'

export interface PostEditorContextData {
	/** The server post. */
	serverPost: Post;

	/** The local post copy. */
	post: Post;

	/** Sets the post immediately, or using a debounced function callback, which will only execute occasionally. */
	setPost: (post: Post | (() => Post), forceImmediate?: boolean) => boolean;

	/** Sets whether or not the post sidebar should be displayed. */
	setSidebarVisible: (visible: boolean) => void;

	/** An event emitter for post events. */
	event: EventEmitter<{ save: (state: SaveState, reason: SaveReason) => void; }>;
}

export const PostEditorContext = createContext<PostEditorContextData>(null as any);
