import * as path from 'path';
import sizeOf from 'image-size';
import Mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { UploadedFile } from 'express-fileupload';
import { promises as fs, constants as fsc } from 'fs';


/**
 * A temporary authentication token for a single user.
 */

export interface IMedia extends Mongoose.Document {
	uploader?: ObjectId;

	lastModified: number;
	lastModifier: ObjectId;

	name: string;
	description: string;
	fileName: string;
	bytes: number;
	extension: string;

	size?: {
		width?: number;
		height?: number;
	};

	acceptUpload(upload: UploadedFile, uploader: ObjectId, destPath: string): boolean;
}

export const MediaSchema = new Mongoose.Schema<IMedia>({
	uploader: { type: {} },

	lastModified: { type: Number },
	lastModifier: { type: {} },

	name: { type: String, default: '' },
	fileName: { type: String, default: '' },
	description: { type: String, default: '' },
	bytes: { type: Number, default: 0 },
	extension: { type: String, default: '' },

	size: {
		width: { type: Number },
		height: { type: Number }
	}
});


/**
 * Accepts an uploaded file, updates this document to refer to it,
 * and moves it to the destination provided.
 *
 * @param upload - The file to accept.
 * @param uploader - The user who uploaded the file.
 * @param destPath - The destination to put the uploaded file at.
 * @returns a promise to a boolean indicating success.
 */

MediaSchema.method('acceptUpload', async function(this: IMedia, upload: UploadedFile, uploader: ObjectId, destPath: string) {
	const extension = upload.name.substr(upload.name.lastIndexOf('.') + 1);
	const fullPath = path.join(destPath, this.fileName + '.' + extension);

	try { await fs.access(fullPath, fsc.R_OK); return false; }
	catch (e) { /* An exception here indicates that no file has this file's path. */ }

	await upload.mv(fullPath);

	this.bytes = upload.size;
	this.extension = extension;

	try { this.size = await sizeOf(fullPath); }
	catch (e) { this.size = {}; }
	this.markModified('size');

	this.uploader = uploader;
	this.lastModifier = uploader;
	this.lastModified = Date.now();

	return true;
});

export default Mongoose.model('Media', MediaSchema);
