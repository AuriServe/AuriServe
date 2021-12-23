export function merge(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(s => s).join(' ');
}
