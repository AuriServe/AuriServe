import * as Preact from 'preact';
import Helmet from 'react-helmet';
import { useEffect } from 'preact/hooks';
import { useAsyncMemo } from 'use-async-memo';

import Renderer from '../editor/Renderer';

import loadPlugins from '../editor/LoadPlugins';

export default function PageEditorRendererPage() {
	const elements = useAsyncMemo(() => loadPlugins({ scripts: true, styles: true, themes: true }), []);
	if (!elements) return <div/>;

	useEffect(() => document.documentElement.classList.remove('AS_APP'));

	return (
		<Preact.Fragment>
			<Helmet><style>{'body { height: auto; overflow: auto; }'}</style></Helmet>
			<div class='AS_ROOT text-gray-100 dark:text-gray-800 bg-gray-900 dark:bg-gray-50'/>
			<Renderer defs={elements} />
		</Preact.Fragment>
	);
}
