import { ID, Date } from './Type';

export interface Interface {
	id: ID;
	user: ID;
	created: Date;

	name: string;
	description: string;
	layout: ID;
}

export const Schema = `
	type Page implements Resource & TrackModifications {
		id: ID!
		user: ID
		created: Date!

		lastModified: Int
		lastModifier: ID

		name: String!
		description: String!
		layout: ID
	}
`;

export const Query = `
	{
		id
		user
		created

		name
		description
		layout
	}
`;
