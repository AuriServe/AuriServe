import { useEffect } from 'preact/hooks';

import { useData, QUERY_INFO } from '../Graph';

interface Props {
	children: string;
}

export default function Title({ children: title }: Props) {
	const [{ info }] = useData(QUERY_INFO, []);
	// Spaces around bullets are em-spaces.
	// eslint-disable-next-line no-irregular-whitespace
	const titleStr = info?.name ? `${title} • ${info.name}` : `${title} • AuriServe`;

	useEffect(() => {
		const title = document.createElement('title');
		title.innerText = titleStr;
		document.head.appendChild(title);
		return () => document.head.removeChild(title);
	}, [titleStr]);

	return null;
}
