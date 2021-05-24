import { ServerDefinition } from 'auriserve-api';

export default class Elements {
	private lists: Set<Map<string, ServerDefinition>> = new Set();

	addList(list: Map<string, ServerDefinition>): void {
		this.lists.add(list);
	}

	removeList(list: Map<string, ServerDefinition>): void {
		this.lists.delete(list);
	}

	getAllElements(): Map<string, ServerDefinition> {
		let map: Map<string, ServerDefinition> = new Map();
		for (let m of this.lists) {
			for (let [k, v] of m) map.set(k, v);
		}
		return map;
	}
}
