import Properties from '../../data/model/Properties';

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

export const Resolver = {
	name:			 	 async () => (await Properties.findOne({}))!.info.name,
	domain:			 async () => (await Properties.findOne({}))!.info.domain,
	favicon:		 async () => (await Properties.findOne({}))!.info.favicon,
	description: async () => (await Properties.findOne({}))!.info.description
};
