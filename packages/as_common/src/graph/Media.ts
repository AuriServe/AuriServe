import { Vec2, Vec2Query } from './Type';
import { Resource, TrackModifications } from './interface';

export interface Interface extends Resource, TrackModifications {
	name: string;
	description: string;

	bytes: number;
	extension: string;
	path: string;
	url: string;
	size?: Vec2;
}

export const Schema = `
	type Media implements Resource & TrackModifications {
		id: ID!
		user: ID!
		created: Date!

		lastModified: Date
		lastModifier: ID

		name: String!
		description: String!

		bytes: Int!
		extension: String!
		path: String!
		url: String!
		size: Vec2
	}
`;

export const Query = `
	{
		id
		user
		created

		name
		description
		
		bytes
		extension
		path
		url
		size ${Vec2Query}
	}
`;
