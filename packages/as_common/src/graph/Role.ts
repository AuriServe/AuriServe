import { ID, Color } from './Type';
import { Resource, TrackModifications } from './interface';

export interface Interface extends Resource, TrackModifications {
	name: string;
	color: Color;
	abilities: string[];
	users: ID[];
}

export const Schema = `
	type Role implements Resource & TrackModifications {
		id: ID!
		user: ID
		created: Date!

		lastModified: Date
		lastModifier: ID
		
		name: String!
		color: Color
		abilities: [String!]!
		users: [ID!]!
	}
`;

export const Query = `
	{
		id
		user
		created

		name
		color
		abilities
		users
	}
`
