import { ID } from './Type';

export interface Interface {
	domain: string;
	favicon?: ID;
	name: string;
	description: string;
}

export const Schema = `
	type Info {
		domain: String!
		favicon: ID
		name: String!
		description: String!
	}

	input InputInfo {
		domain: String
		favicon: ID
		name: String
		description: String
	}
`;

export const Query = `
	{
		domain
		favicon
		name
		description
	}
`;
