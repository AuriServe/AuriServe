export const Schema = `
	type Layout {
		identifier: String!
		html: String!
	}
`;

export const Resolver = (identifier: string, html: string) => ({ identifier, html });
