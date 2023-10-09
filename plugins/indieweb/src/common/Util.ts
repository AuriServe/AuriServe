export function range(a: number, b = 0): number[] {
	const from = Math.min(a, b);
	const to = Math.max(a, b);
	return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
