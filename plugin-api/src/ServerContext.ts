import { Context } from 'preact';
import { useContext } from 'preact/hooks';

export interface ServerContextData {
	path: string;
	cookies: Record<string, string>;
}

export const ServerContext: Context<ServerContextData> =
	(global as any)._AS_?.pages_manager_context; // eslint-disable-line

export function useServerContext() {
	if (ServerContext) return useContext(ServerContext);
	throw 'Attempted to use the ServerContext in a non-server component.';
}
