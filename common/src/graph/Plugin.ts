import { ID, Date } from './type';

export interface Interface {
	user: ID;
	created: Date;
	identifier: string;

	enabled: boolean;
	
	name: string;
	description: string;
	author: string;
	coverPath?: string;
}

export const Schema = `
	type Plugin {
		user: ID
		created: Date!
		identifier: String!

		enabled: Boolean!

		name: String!
		description: String!
		author: String!
		coverPath: String
	}
`;

export const Query = `
	{
		user
		# created
		identifier

		enabled

		name
		description
		author
		coverPath
	}
`;
