import { ServerDefinition } from 'common/definition';

import { PageBuilderContext } from '../PageBuilder';

import Preact from 'preact';
import Hooks from 'preact/hooks';

/** @ts-ignore Globals to avoid duplicate Preact instances. */
global._AS_ = {
	preact: Preact,
	preact_hooks: Hooks,
	pages_manager_context: PageBuilderContext
};

export default class PluginBindings {
	elements: Map<string, ServerDefinition> = new Map();

	registerElement = (def: ServerDefinition): void => {
		this.elements.set(def.identifier, def);
	};
}
