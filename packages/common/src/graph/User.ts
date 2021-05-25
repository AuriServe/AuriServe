import { ID } from './Basic';

export interface Interface {
	id: ID;
	username: string;
	emails: string[];
	roles: ID[];
}

export const Schema = `
	type User {
		id: ID!
		username: String!
		emails: [String!]!
		roles: [ID!]!
	}
`;

export const Query = `
	{
		id
		username
		emails
		roles
	}
`;
