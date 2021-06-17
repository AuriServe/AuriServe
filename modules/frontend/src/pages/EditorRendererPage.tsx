import * as Preact from 'preact';
import Helmet from 'react-helmet';
import { useAsyncMemo } from 'use-async-memo';

import EditorRenderer from '../editor/EditorRenderer';

import loadPlugins from '../editor/LoadPlugins';

export default function PageEditorRendererPage() {
	const elements = useAsyncMemo(() => loadPlugins({ scripts: true, styles: true, themes: true }), []);
	if (!elements) return <div/>;

	return (
		<Preact.Fragment>
			<Helmet><style>{'body { height: auto; overflow: auto; }'}</style></Helmet>
			<EditorRenderer defs={elements} />
		</Preact.Fragment>
	);
}
