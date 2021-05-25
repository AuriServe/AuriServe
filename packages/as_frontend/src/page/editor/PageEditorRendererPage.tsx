import * as Preact from 'preact';
import Helmet from 'react-helmet';
import { useAsyncMemo } from 'use-async-memo';

// import PageEditorRenderer from '../../editor/PageEditorRenderer';

import loadPlugins from '../../plugin/LoadPlugins';

export default function PageEditorRendererPage() {
	const elements = useAsyncMemo(() => loadPlugins({ scripts: true, styles: true, themes: true }), []);

	if (!elements) return;

	return (
		<Preact.Fragment>
			<Helmet><style>{'body { height: auto; overflow: auto; }'}</style></Helmet>
			{/* <PageEditorRenderer defs={elements} />*/}
		</Preact.Fragment>
	);
}
