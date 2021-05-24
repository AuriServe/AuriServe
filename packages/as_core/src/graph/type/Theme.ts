import Theme from '../../data/theme/Theme';

import { Resolver as Layout } from './Layout';

export const Schema = `
	enum ThemeFormat {
		CSS, SASS
	}

	type Theme implements Resource {
		id: ID!
		user: ID
		created: Date!

		enabled: Boolean!

		name: String!
		identifier: String!
		description: String!
		author: String!
		coverPath: String

		layouts: [Layout]!
		layout(identifier: String): Layout
		format: ThemeFormat!
	}
`;

export class Resolver {
	constructor(private theme: Theme) {}

	// TODO: id, user, created

	enabled = () => this.theme.isEnabled();

	name 				= () => this.theme.config.name;
	identifier  = () => this.theme.config.identifier;
	description = () => this.theme.config.description;
	author			= () => this.theme.config.author;
	// TODO: coverPath

	layouts = () => {
		const layouts = this.theme.getLayouts();
		return [ ...layouts.keys() ].map(l => Layout(l, layouts.get(l)!));
	};
	layout = ({ identifier }: { identifier: string }) => {
		const layout = this.theme.getLayouts().get(identifier);
		return layout ? Layout(identifier, layout) : undefined;
	};
	format = () => this.theme.config.preprocessor.toUpperCase();
};
