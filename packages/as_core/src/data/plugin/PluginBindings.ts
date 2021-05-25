import { ServerDefinition } from 'as_common/definition';

export default class PluginBindings {
	elements: Map<string, ServerDefinition> = new Map();

	registerElement = (def: ServerDefinition): void => {
		this.elements.set(def.identifier, def);
	};
}
