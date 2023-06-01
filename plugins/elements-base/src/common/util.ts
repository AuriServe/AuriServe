export function randomIdentifier() {
	return `i${Math.random().toString(36).substring(7)}`;
}

export function merge(...args: any[]) {
	return args.filter(Boolean).join(' ');
}

export function mergeStyles(...args: any[]) {
	return `${args.filter(Boolean).join(';')};`;
}

export function joinClass(identifier: string) {
	return (strings: TemplateStringsArray) => strings[0].split(' ').map(s => `${identifier}-${s}`).join(' ');
}

export function checkServer<C, S>(props: C | S): props is S {
	return !('window' in globalThis);
}
