import { ID } from './Basic';

export interface Interface {
	// id: ID;
	// user: ID;
	// created: Date;

	name?: string;
	path: string;
	description?: string;
	
	layout?: ID;
	content?: string
}

export const Schema = `
	type Page implements Resource & TrackModifications {
		id: ID!
		user: ID
		created: Date!

		lastModified: Date
		lastModifier: ID

		path: String!
		name: String
		content: String!
		description: String
		layout: ID
	}
`;

export const MetaQuery = `
	{
		# id
		# user
		# created

		name
		path
		description
		
		layout
	}
`;

export const PageQuery = `
	{
		# id
		# user
		# created

		name
		path
		description
		
		layout
		content
	}
`;
