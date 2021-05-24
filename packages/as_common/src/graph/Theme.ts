import { Resource, Layout } from './Interface';
import { Layout as LayoutQuery } from './Query';

export interface Interface extends Resource {
	enabled: boolean;
	
	name: string;
	identifier: string;
	description: string;
	author: string;
	coverPath?: string;

	layouts: Layout[];
}

export const Schema = `
	type Theme implements Resource {
		id: ID!
		user: ID
		created: Date!

		enabled: Boolean!

		name: String!
		identifier: String!
		description: String!
		author: String!
		coverPath: String

		layouts: [Layout]!
		layout(identifier: String): Layout
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

		layouts ${LayoutQuery}
	}
`;
