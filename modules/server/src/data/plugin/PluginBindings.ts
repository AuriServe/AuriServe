import { ServerDefinition } from 'common/definition';

export default class PluginBindings {
	elements: Map<string, ServerDefinition> = new Map();

	registerElement = (def: ServerDefinition): void => {
		this.elements.set(def.identifier, def);
	};
}
