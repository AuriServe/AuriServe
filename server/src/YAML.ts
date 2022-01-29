import yaml from 'js-yaml';
import { assert } from 'common';

export function parse<T = any>(str: string): T {
	try {
		return yaml.load(str, { schema: yaml.FAILSAFE_SCHEMA }) as T;
	} catch (e) {
		assert(e instanceof yaml.YAMLException, `YAML module error: ${e}`);
		assert(false, `Invalid YAML: ${e.reason} at ${e.mark.line}:${e.mark.column}`);
	}
}

export function stringify(obj: any): string {
	try {
		return yaml.dump(obj, {
			schema: yaml.FAILSAFE_SCHEMA,
			indent: 2,
			noRefs: true,
			noCompatMode: true,
		});
	} catch (e) {
		assert(e instanceof yaml.YAMLException, `YAML module error: ${e}`);
		assert(false, `Invalid Object: ${e.reason} at ${e.mark.line}:${e.mark.column}`);
	}
}

export default {
	parse,
	stringify,
};
