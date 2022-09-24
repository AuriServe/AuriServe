import path from 'path';

export const FILETYPE_IMAGE = [ 'png', 'jpg', 'webp', 'gif', 'bmp' ];
export const FILETYPE_AUDIO = [ 'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma' ];
export const FILETYPE_VIDEO = [ 'mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv' ];
export const FILETYPE_DOCUMENT =
	[ 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'txt', 'rtf' ];

export type FileType = 'image' | 'audiovideo' | 'document' | 'other';

export function getFileType(file: string): FileType {
	const ext = path.extname(file).slice(1);
	if (FILETYPE_IMAGE.includes(ext)) return 'image';
	if (FILETYPE_AUDIO.includes(ext)) return 'audiovideo';
	if (FILETYPE_VIDEO.includes(ext)) return 'audiovideo';
	if (FILETYPE_DOCUMENT.includes(ext)) return 'document';
	return 'other';
}
