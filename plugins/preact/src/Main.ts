import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import renderToString from 'preact-render-to-string';

declare global {
	interface AuriServeAPI {
		preact: {
			preact: typeof preact;
			hooks: typeof hooks;
			renderToString: typeof renderToString;
		};
	}
}

import as from 'auriserve';

as.preact = { preact, hooks, renderToString };
