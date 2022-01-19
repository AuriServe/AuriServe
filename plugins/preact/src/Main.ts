import as from 'auriserve';
import * as preact from 'preact';
import * as hooks from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import renderToString from 'preact-render-to-string';

declare global {
	export interface AuriServeAPI {
		preact: {
			preact: typeof preact;
			hooks: typeof hooks;
			forwardRef: typeof forwardRef;
			renderToString: typeof renderToString;
		};
	}
}

(global as any).__AS_PREACT = preact;
(global as any).__AS_PREACT_HOOKS = hooks;
(global as any).__AS_PREACT_COMPAT = { forwardRef };

as.preact = { preact, hooks, forwardRef, renderToString };
as.core.on('cleanup', () => {
	as.unexport('preact');

	delete (global as any).__AS_PREACT;
	delete (global as any).__AS_PREACT_HOOKS;
	delete (global as any).__AS_PREACT_COMPAT;
});
