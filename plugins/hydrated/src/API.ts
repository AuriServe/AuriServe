import Static from './Static';
import hydrate from './Hydrate';

export default interface API {
	hydrate: typeof hydrate;
	Static: typeof Static;
}

declare global {
	export interface AuriServeAPI {
		hydrated: API;
	}
}
