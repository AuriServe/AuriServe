import { GraphQLSchema } from 'graphql';
import { RequestHandler } from 'auriserve/router';

type CleanupFn = () => void;

export default interface API {
	internal: {
		schemaStrings: Set<string>;
		routeHandlers: RequestHandler[];
		schema?: GraphQLSchema;

		init(): Promise<void>;
		cleanup(): void;
	};

	gqlResolver: any;
	gqlContext: any;

	extendGQLSchema(schema: string): CleanupFn;
}

declare global {
	export interface AuriServeAPI {
		dashboard: API;
	}
}
