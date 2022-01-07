export {};

import type { Routes } from './Server';

declare global {
	interface AuriServeAPI {
		routes: Routes;
	}
}
