import { useRenderContext } from 'elements'

export interface PageContext {
	path: string;
	query: Record<string, string>;
	params: Record<string, string>;
}

export function usePageContext(): PageContext | null {
	return useRenderContext() as PageContext;
}
