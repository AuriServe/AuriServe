import as from 'auriserve';
import Routes from './Routes';

export { BaseRoute } from './Route';
export type { Route } from './Route';
export type { default as Routes } from './Routes';

declare global {
	export interface AuriServeAPI {
		routes: Routes;
	}
}

as.routes = new Routes();
as.core.router.get('*', as.routes.handleGet);

const handle404 = as.routes.getErrorHandler(404);
setTimeout(() => as.core.router.get('*', handle404), 1);

as.core.once('cleanup', () => {
	as.core.router.remove(handle404);
	as.core.router.remove(as.routes.handleGet);
	as.unexport('routes');
});
