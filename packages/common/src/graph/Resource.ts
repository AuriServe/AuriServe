import { ID, Date } from './Basic';

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
