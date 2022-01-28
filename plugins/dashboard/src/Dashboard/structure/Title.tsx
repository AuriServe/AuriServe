import { useEffect } from 'preact/hooks';

import { useData, QUERY_INFO } from '../Graph';

interface Props {
	children: string;
}

export default function Title({ children: title }: Props) {
	const [{ info }] = useData(QUERY_INFO, []);

	useEffect(() => {
		// Spaces around bullets are em-spaces.
		// eslint-disable-next-line no-irregular-whitespace
		document.title = `${title} • ${info?.name ?? 'Dashboard'}`;
	}, [title, info?.name]);

	return null;
}
