import Mongoose from 'mongoose';

/**
 * Contains site information, such as
 * the name, domain, description, and favicon.
 */

export interface IInfo {
	name: string;
	description: string;
	domain: string;
	favicon: Mongoose.ObjectId;
}

/**
 * A document containing site properties.
 */

export interface IProperties extends Mongoose.Document {
	info: IInfo;
	usage: {
		media_allocated: number;
		media_used: number;
	};
	enabled: {
		themes: string[];
		plugins: string[];
	};
}

export const PropertiesSchema = new Mongoose.Schema<IProperties>({
	info: {
		name: { type: String, default: '' },
		description: { type: String, default: '' },
		domain: { type: String, default: '' },
		favicon: { type: {} },
	},
	usage: {
		media_allocated: { type: Number, required: true },
		media_used: { type: Number, default: 0 },
	},
	enabled: {
		themes: { type: [String], required: true },
		plugins: { type: [String], required: true },
	},
});

export default Mongoose.model('Properties', PropertiesSchema);
