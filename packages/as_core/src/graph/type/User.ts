import { IUser } from '../../data/model/User';

export const Schema = `
	type User {
		id: ID!
		username: String!
		emails: [String!]!
		roles: [Role!]!
		media: [Media!]!
		themes: [Theme!]!
		plugins: [Plugin!]!
	}
`;

export function Resolver(user: IUser) {
	return {
		id: user._id.toString(),
		username: user.username,
		emails: user.emails,
		roles: user.roles
	};
}
