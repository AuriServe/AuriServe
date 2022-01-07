import type Router from './router';
import type Database from './database';

declare global {

	/**
	 * The API Registry interface, which is used to register and require APIs.
	 * To add your own API's type definitions to this interface,
	 * create a declarations.d.ts in your plugin with the following content:
	 *
	 * ```
	 * export {};
	 *
	 * declare global {
	 *   interface AuriServeAPIRegistry {
	 * 			/** [YOUR API'S DOCUMENTATION] *\/
	 *     [YOUR API NAME]: [YOUR API INTERFACE];
	 *   }
	 * }
	 * ```
	 *
	 * Replace [YOUR API'S DOCUMENTATION], [YOUR API NAME], and [YOUR API INTERFACE]
	 * with your own API documentation, name and interface. After that,
	 * people who depend on your typedefs module should be able to see your typedefs.
	 */

	interface AuriServeAPI {
		/** The Core AuriServe API. */
		core: Core;

		/**
		 * Registers an API to the API registry.
		 *
		 * @param identifier - The identifier of the API, should match the plugin API.
		 * @param api - The API object to register.
		 */

		export(identifier: string, api: any): void;

		/**
		 * Unregisters an API from the API registry.
		 *
		 * @param identifier - The identifier of the API to unregister.
		 */

		unexport(identifier: string): boolean;

		/**
		 * Checks if an API is registered.
		 *
		 * @param identifier - The identifier of the API to check.
		 * @returns a boolean indicating if the API is registered.
		 */

		has(identifier: string): boolean;
	}
}

/** The Core Auriserve API. */
export interface Core {

	/** Provides access to the API registry. */
	api: AuriServeAPI;

	/** Provides access to the underlying Router, for handling incoming requests. */
	router: Router;

	/** Provides access to the underlying MySQL database, for high-preformance data storage. */
	database: Database;

	/** Binds a callback to an event. */
	on(event: string, cb: (event: any) => void): void;

	/** Binds a callback to an event one time. */
	once(event: string, cb: (event: any) => void): void;

	/** Unbinds a callback from an event. */
	off(event: string, cb: (event: any) => void): void;

	/** Emits an event to event listeners. */
	emit(event: string, eventObj: any): void;
}

// Actually get the API context and export it.
// eslint-disable-next-line no-underscore-dangle
const api: AuriServeAPI = (globalThis as any)._CONTEXT;

if (!api) {
	throw new Error('Could not find AuriServe context!\n' +
		'Please make sure you are loading the \'AuriServe\' module synchronously at least once ' +
		'at the beginning of your plugin to catch the context.');
}

/** The AuriServe API Registry. */
export default api;
