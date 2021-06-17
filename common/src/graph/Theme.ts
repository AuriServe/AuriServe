import { ID, Date, Layout } from './type';
import { Layout as LayoutQuery } from './Query';

export interface Interface {
	user: ID;
	created: Date;
	identifier: string;
	
	enabled: boolean;
	
	name: string;
	description: string;
	author: string;
	coverPath?: string;

	layouts: Layout[];
}

export const Schema = `
	type Theme {
		user: ID
		created: Date!
		identifier: String!

		enabled: Boolean!

		name: String!
		description: String!
		author: String!
		coverPath: String

		layouts: [Layout]!
		layout(identifier: String): Layout
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

		layouts ${LayoutQuery}
	}
`;
