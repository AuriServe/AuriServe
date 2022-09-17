import { assert, Version } from 'common';

interface InputPlugin {
	identifier: string;
	version: Version;
	depends: Record<string, string>;
}

interface PluginDependency {
	version: Version;
	dependencies: string[];
}

const ROOT_IDENTIFIER = '#ROOT#';

export default function pluginDependencyOrder(input: InputPlugin[]) {
	const plugins: Map<string, PluginDependency> = new Map([
		[ROOT_IDENTIFIER, { version: new Version('0.0.0'), dependencies: [] }],
		...(input.map((plugin) => [
			plugin.identifier,
			{ version: plugin.version, dependencies: [] },
		]) as [string, PluginDependency][]),
	]);


	for (const plugin of input) {
		for (const [ identifier, version ] of [ ...Object.entries(plugin.depends ?? {}), [ ROOT_IDENTIFIER, 'x' ] ]) {
			const parentDep = plugins.get(identifier);
			assert(
				parentDep && parentDep.version.matches(version),
				`Plugin '${plugin.identifier}' is missing dependency '${identifier} ${version}'.`
			);
			parentDep.dependencies.push(plugin.identifier);
		}
	}

	function resolve(identifier: string): string[] {
		return recursiveResolve(identifier);
	}

	function recursiveResolve(
		identifier: string,
		resolved: string[] = [],
		unresolved: string[] = []
	): string[] {
		unresolved.push(identifier);
		plugins.get(identifier)!.dependencies.forEach((dependency) => {
			if (resolved.indexOf(dependency) === -1) {
				assert(
					unresolved.indexOf(dependency) === -1,
					`Circular plugin dependency: '${identifier}' -> '${dependency}'.`
				);
				recursiveResolve(dependency, resolved, unresolved);
			}
		});
		resolved.push(identifier);
		unresolved.splice(unresolved.indexOf(identifier), 1);
		return resolved;
	}

	const order = resolve(ROOT_IDENTIFIER);
	order.pop();
	return order.reverse();
}
