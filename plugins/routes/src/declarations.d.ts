export {};

import type { Routes } from './Main';

declare global {
	interface AuriServeAPI {
		routes: Routes;
	}
}
