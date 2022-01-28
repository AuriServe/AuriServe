// import Mongoose from 'mongoose';

// /**
//  * A user role with a list of abilities.
//  */

// export interface IRole extends Mongoose.Document {
// 	creator: Mongoose.ObjectId;
// 	name: string;
// 	color: { h: number; s: number; v: number };
// 	abilities: string[];
// }

// export const RoleSchema = new Mongoose.Schema<IRole>({
// 	creator: { type: {}, required: true },
// 	name: { type: String, required: true },
// 	color: { type: {} },
// 	abilities: { type: [String], required: true },
// });

// export default Mongoose.model('Role', RoleSchema);
