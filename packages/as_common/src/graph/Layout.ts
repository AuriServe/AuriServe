export interface Interface {
	identifier: string;
	html: String;
}

export const Schema = `
	type Layout {
		identifier: String!
		html: String!
	}
`;

export const Query = `
	{
		identifier
		html
	}
`;
