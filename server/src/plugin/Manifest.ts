export default interface Manifest {
	identifier: string;
	name?: string;
	description?: string;
	author: string;
	version: string;

	entry: {
		server?: string | { script?: string };
		client?: string | { script?: string; style?: string };
	};

	watch?: string[];
}
