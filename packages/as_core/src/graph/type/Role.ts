import { IRole } from '../../data/model/Role';

export const Schema = `
	type Role implements Resource & TrackModifications {
		id: ID!
		user: ID
		created: Date!

		lastModified: Int
		lastModifier: User

		name: String!
		color: Color
		abilities: [String!]!
		users: [User!]!
	}
`;

export class Resolver {
	constructor(private role: IRole) {}

	id  				= () => this.role._id.toString();
	user 				= () => this.role.creator;
	created 		= () => this.role._id.getTimestamp();

	// TODO: lastModified, lastModifier

	name				= () => this.role.name;
	color 			= () => this.role.color;
	abilities		= () => this.role.abilities;
};
