import Routes from './Routes';
export { BaseRoute } from './Route';
export type { Route } from './Route';
export type { default as Routes } from './Routes';
declare global {
    export interface AuriServeAPI {
        routes: Routes;
    }
}
