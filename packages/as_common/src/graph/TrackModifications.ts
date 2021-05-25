import { ID, Date } from './Type';

export interface Interface {
	lastModified?: Date;
	lastModifier?: ID;
}

export const Schema = `
	interface TrackModifications {
		lastModified: Date
		lastModifier: ID
	}
`;
