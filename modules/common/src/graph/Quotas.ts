export interface Interface {
	storage: { used: number; allocated: number };
}

export const Schema = `
	type Quota {
		used: Float,
		allocated: Float
	}

	type Quotas {
		storage: Quota!
	}
`;

export const QuotaQuery = '{ used, allocated }'

export const Query = `
	{
		storage ${QuotaQuery}
	}
`;
