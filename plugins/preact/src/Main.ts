import as from 'auriserve';
import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import renderToString from 'preact-render-to-string';

declare global {
	export interface AuriServeAPI {
		preact: {
			preact: typeof preact;
			hooks: typeof hooks;
			renderToString: typeof renderToString;
		};
	}
}

as.preact = { preact, hooks, renderToString };
as.core.on('cleanup', () => as.unexport('preact'));
