export default interface User {
	identifier: string;
	name: string;
	emails: string[];
	roles: string[];
}

export type Token = string;
