import fs, { promises as fsp } from 'fs';
import crypto from 'crypto-js';
//eslint-disable-next-line
//@ts-ignore
import nbt from 'nbt';

const UUID_GROUP_SIZES = [8, 4, 4, 4, 12];

function parseUUID(hex: string) {
	const uuidBytes = new Uint8Array(16);
	const uuid = new DataView(uuidBytes.buffer);

	hex = hex.trim().split('-').map((g, i) => g.padStart(UUID_GROUP_SIZES[i], '0')).join('');

	uuid.setBigUint64(0, BigInt(`0x${hex.substring(0, 16)}`), false);
	uuid.setBigUint64(8, BigInt(`0x${hex.substring(16)}`), false);

	return new TextDecoder().decode(uuidBytes);
}

export async function readEverbook(path: string) {
	const file = await fsp.open(path, 'r');
	const uuid = path.split('everbook-')[1].split('.dat')[0];

	const iv = crypto.enc.Utf8.parse((await file.read(Buffer.alloc(16), 0, 16, 0)).buffer.toString('utf-8'));
	const data = (await file.readFile()).toString('utf-8');
	const key = crypto.enc.Utf8.parse(parseUUID(uuid));

	file.close();

	const decrypted = crypto.AES.decrypt(data, key, { iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });
	const val = decrypted.toString(crypto.enc.Utf8);

	await new Promise((resolve, reject) =>
		nbt.parse(val, (error: any, data: any) => error ? reject(error) : resolve(data)));

	// console.log(val);
}
