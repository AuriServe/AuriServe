import as from 'auriserve';
import Routes from './Routes';

export { BaseRoute } from './Route';
export type { Route } from './Route';
export type { default as Routes } from './Routes';

const routes = new Routes();

as.export('routes', routes);
as.core.router.get('*', routes.handleGet);

const handle404 = routes.getErrorHandler(404);
setTimeout(() => as.core.router.get('*', handle404), 1);

as.core.once('cleanup', () => {
	as.unexport('routes');
	as.core.router.remove(handle404);
	as.core.router.remove(routes.handleGet);
});

