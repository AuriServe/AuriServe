import { Context } from 'preact';
import { useContext } from 'preact/hooks';

export interface ServerContextData {
	path: string;
	cookies: Record<string, string>;
}

export const ServerContext: Context<ServerContextData> =
	(global as any)._AS_?.pages_manager_context; // eslint-disable-line

export function useServerContext(): ServerContextData {
	if (ServerContext) return useContext(ServerContext);
	// console.error('Attempted to use the ServerContext in a non-server component.');
	return {} as ServerContextData;
	// throw 'Attempted to use the ServerContext in a non-server component.';
}
