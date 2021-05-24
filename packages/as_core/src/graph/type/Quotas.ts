import Properties from '../../data/model/Properties';

export const Schema = `
	type Quota {
		used: Float,
		allocated: Float
	}

	type Quotas {
		storage: Quota!
	}
`;

export const Resolver = {
	storage: async () => {
		let usage = (await Properties.findOne({}))!.usage;
		return { used: usage.media_used, allocated: usage.media_allocated };
	}
};
