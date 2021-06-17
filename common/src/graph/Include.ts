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
	type Include implements Resource & TrackModifications {
		id: ID!
		user: ID
		created: Date!

		lastModified: Date
		lastModifier: ID

		path: String!
		content: String!
	}
`;

export const Query = `
	{
		# id
		# user
		# created

		path
		content
	}
`;
