import { IMedia } from '../../data/model/Media';

// export const Schema = `
// 	type Media implements Resource & TrackModifications {
// 		id: ID!
// 		user: ID!
// 		created: Date!

// 		lastModified: Int
// 		lastModifier: User

// 		name: String!
// 		description: String!

// 		bytes: Int!
// 		extension: String!
// 		path: String!
// 		url: String!
// 		size: Vec2
// 	}
// `;

export class Resolver {
	constructor(private media: IMedia) {}

	id  				= () => this.media._id.toString();
	user 				= () => this.media.uploader;
	created 		= () => this.media._id.getTimestamp();
	// TODO: lastModified, lastModifier

	name 				= () => this.media.name;
	description = () => this.media.description;

	bytes       = () => this.media.bytes;
	extension   = () => this.media.extension;
	path				= () => this.media.fileName;
	url         = () => '/media/' + this.media.fileName + '.' + this.media.extension;
	
	size = () => {
		let size = this.media.size;
		if (!size) return null;
		return { x: size.width, y: size.height };
	};
}
