import Plugin from '../../data/plugin/Plugin';

export const Schema = `
	type Plugin implements Resource {
		id: ID!
		user: ID
		created: Date!

		enabled: Boolean!

		name: String!
		identifier: String!
		description: String!
		author: String!
		coverPath: String
	}
`;


export class Resolver {
	constructor(private plugin: Plugin) {}

	// TODO: id, user, created

	enabled     = () => this.plugin.isEnabled();

	name 				= () => this.plugin.config.name;
	identifier  = () => this.plugin.config.identifier;
	description = () => this.plugin.config.description;
	author			= () => this.plugin.config.author;
	// TODO: coverPath
};
