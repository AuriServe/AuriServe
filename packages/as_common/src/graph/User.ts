import { ID } from './Type';

export interface Interface {
	id: ID;
	username: string;
	emails: string[];
}

export const Schema = `
	type User {
		id: ID!
		username: String!
		emails: [String!]!
	}
`;

export const Query = `
	{
		id
		username
		emails
	}
`;
