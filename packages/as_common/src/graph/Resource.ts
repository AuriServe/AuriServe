import { ID, Date } from './Type';

export interface Interface {
	id: ID;
	user?: ID;
	created: Date;
}

export const Schema = `
	interface Resource {
		id: ID!
		user: ID
		created: Date!
	}
`;
