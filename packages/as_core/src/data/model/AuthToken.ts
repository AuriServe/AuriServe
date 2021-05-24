import Mongoose from 'mongoose';


/**
 * A temporary authentication token for a single user.
 */

export interface IAuthToken extends Mongoose.Document {
	token: string;
	user: Mongoose.ObjectId;
	until: number;
}

export const AuthTokenSchema = new Mongoose.Schema<IAuthToken>({
	token: { type: String, required: true },
	user: { type: {}, required: true },
	until: { type: Number, required: true }
});

export default Mongoose.model('AuthToken', AuthTokenSchema);
