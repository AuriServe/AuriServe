export function merge(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(s => s).join(' ');
}

export function sign(num: number) {
	return num < 0 ? -1 : num > 0 ? 1 : 0;
}
