export interface Interface {
	watchMode: boolean;
}

export const Schema = `
	type Developer {
		watchMode: Boolean
	}

	input InputDeveloper {
		watchMode: Boolean
	}
`;

export const Query = `
	{
		watchMode
	}
`;
