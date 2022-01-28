// import * as path from 'path';
// import { ObjectId } from 'mongodb';
// import { UploadedFile } from 'express-fileupload';
// import { promises as fs, constants as fsc } from 'fs';

// import MediaModel, { IMedia } from './model/Media';

// /**
//  * Handles media elements, including image optimization and file uploading.
//  */

// export default class Media {
// 	constructor(private dataPath: string) {
// 		// Create media folder
// 		fs.access(path.join(this.dataPath, 'media'), fsc.R_OK).catch((_) =>
// 			fs.mkdir(path.join(this.dataPath, 'media'))
// 		);
// 		// Create media cache folder
// 		fs.access(path.join(this.dataPath, 'media', '.cache'), fsc.R_OK).catch((_) =>
// 			fs.mkdir(path.join(this.dataPath, 'media', '.cache'))
// 		);
// 	}

// 	/**
// 	 * Gets a media document from its id.
// 	 *
// 	 * @param id - The media elements's id.
// 	 * @returns the media document, or null if there is no media element with that id.
// 	 */

// 	async getMedia(id: ObjectId) {
// 		return MediaModel.findById(id);
// 	}

// 	/**
// 	 * Lists all media documents.
// 	 *
// 	 * @returns an array of media documents.
// 	 */

// 	listMedia = (): Promise<IMedia[]> => MediaModel.find({}) as any;

// 	/**
// 	 * Adds a new media element to the database, or replaces an existing one.
// 	 *
// 	 * @param uploader - The user to attribute this media element to.
// 	 * @param upload - The media file to accept.
// 	 * @param name - The name of the file, if this is undefined and replace is set, the old name will be preserved.
// 	 * @param fileName - The file's fileName, if this is undefined and replace is set, the old fileName will be preserved.
// 	 * @param replace - If set, this media element will be updated instead of creating a new media element.
// 	 * @returns a promise to a boolean indicating success.
// 	 */

// 	async addMedia(
// 		uploader: ObjectId,
// 		upload: UploadedFile,
// 		name: string | undefined,
// 		fileName: string | undefined,
// 		replace?: ObjectId
// 	): Promise<boolean> {
// 		if ((fileName && fileName.length > 32) || (name && name.length > 32)) return false;

// 		// TODO: Implement fullness check.
// 		const full = false;
// 		if (full) return false;

// 		const media: IMedia =
// 			(replace ? await MediaModel.findById(replace) : null) ?? new MediaModel({});
// 		if (media.isNew && (!fileName || !name)) return false;

// 		media.name = name ?? media.name;
// 		media.fileName = fileName ?? media.fileName;

// 		const res = await media.acceptUpload(
// 			upload,
// 			uploader,
// 			path.join(this.dataPath, 'media')
// 		);
// 		if (res) await media.save();
// 		return res;
// 	}

// 	/**
// 	 * Removes a media element by its id.
// 	 *
// 	 * @param id - The id of the media element to remove.
// 	 * @param deleteFile - Whether or not the file on the hard drive should be deleted as well. Default true.
// 	 * @returns the deleted media document, or null if it did not exist.
// 	 */

// 	async removeMedia(id: ObjectId, deleteFile = true) {
// 		const media = await MediaModel.findByIdAndDelete(id);
// 		if (!media) return null;
// 		if (deleteFile) {
// 			try {
// 				await fs.unlink(
// 					path.join(this.dataPath, 'media', `${media.fileName  }.${  media.extension}`)
// 				);
// 			} catch (e) {
// 				/** The file doesn't exist. This is safe to ignore. */
// 			}
// 		}
// 		return media;
// 	}
// }
