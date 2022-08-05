import { createContext } from 'preact';

export interface ContextData {
	editing: boolean;
	setEditing: (editing?: boolean) => void;
}

export const Context = createContext<ContextData>(null as any);
