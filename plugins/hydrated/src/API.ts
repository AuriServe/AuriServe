import Static from './Static';
import hydrated from './Hydrated';

export default interface API {
	hydrated: typeof hydrated;
	Static: typeof Static;
}

declare global {
	export interface AuriServeAPI {
		hydrated: API;
	}
}
