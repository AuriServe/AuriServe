import { Resource } from './interface';

export interface Interface extends Resource {
	enabled: boolean;
	
	name: string;
	identifier: string;
	description: string;
	author: string;
	coverPath?: string;
}

export const Schema = `
	type Plugin implements Resource {
		id: ID!
		user: ID
		created: Date!

		enabled: Boolean!

		name: String!
		identifier: String!
		description: String!
		author: String!
		coverPath: String
	}
`;

export const Query = `
	{
		id
		user
		created

		enabled

		name
		identifier
		description
		author
		coverPath
	}
`;
