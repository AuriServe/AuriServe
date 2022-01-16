export default interface YAML {
	parse<T = any>(str: string): T;
	stringify(obj: any): string;
}
