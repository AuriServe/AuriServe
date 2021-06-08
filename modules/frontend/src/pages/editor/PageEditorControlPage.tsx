import * as Preact from 'preact';
// import { Page } from 'auriserve-api';
// type Page = any;
// import { useAsyncMemo } from 'use-async-memo';
// import { useState, useEffect } from 'preact/hooks';
import { useLocation, Redirect } from 'react-router-dom';
// import PageEditorControl from '../../editor/PageEditorControl';

// import loadPlugins from '../../plugin/LoadPlugins';

// async function getPageData(page: string): Promise<Page> {
// 	try {
// 		const r = await fetch('/admin/pages/data/', {
// 			method: 'POST',
// 			cache: 'no-cache',
// 			headers: {'Content-Type': 'application/json'},
// 			body: JSON.stringify({ page: page })
// 		});
// 		if (r.status !== 200) throw 'Invalid credentials.';
// 		return await r.json();
// 	}
// 	catch (e) {
// 		location.href = '/admin';
// 		return {} as Page;
// 	}
// };

// function handleSave(path: string, page: Page) {
// 	fetch('/admin/pages/update', {
// 		method: 'POST', cache: 'no-cache',
// 		headers: {'Content-Type': 'application/json'},
// 		body: JSON.stringify({ path: path, body: page })
// 	}).then(() => window.location.href = '/admin/pages');
// }

export default function PageEditorControlPage() {
	const location = useLocation();
	const path = location.pathname.replace(/^\/pages\//g, '');
	// const [ page, setPage ] = useState<Page | undefined>(undefined);
	
	// useEffect(() => { if (path) getPageData(path).then(setPage); }, [ path ]);
	// const elements = useAsyncMemo(() => loadPlugins({ scripts: true, styles: true, themes: false }), []);

	return (
		<Preact.Fragment>
			{/*	{page && elements && <PageEditorControl
			path={path}
			page={page}

			defs={elements}

			onSave={(page) => handleSave(path, page)}
			/>}*/}
			{!path && <Redirect to='/pages' />}
		</Preact.Fragment>
	);
}
