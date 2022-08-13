import { assert } from 'common';
import { getRoles, init as databaseInit } from './Database';

export interface Role {
	identifier: string;
	name: string;
	permissions: string[];
}

databaseInit();

export const roles = getRoles();

export function addRole(identifier: string, ind: number, name: string, permissions: string[]) {
	assert(
		roles.findIndex((role) => role.identifier === identifier) === -1,
		`Role '${identifier}' already exists.`
	);
	roles.splice(ind, 0, { identifier, name, permissions });
}

export function removeRole(identifier: string): boolean {
	const ind = roles.findIndex((roles) => roles.identifier === identifier);
	if (ind === -1) return false;
	roles.splice(ind, 1);
	return true;
}
