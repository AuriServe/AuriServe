import { h } from 'preact';
import { Helmet } from 'react-helmet';
import { useData, QUERY_INFO } from '../Graph';

interface Props {
	children: string;
}

export default function Title({ children: title }: Props) {
	const [{ info }] = useData(QUERY_INFO, []);
	// Spaces around bullets are em-spaces.
	// eslint-disable-next-line no-irregular-whitespace
	const titleStr = info?.name ? `${title} • ${info.name}` : `${title} • AuriServe`;

	return (
		<Helmet>
			<title>{titleStr}</title>
		</Helmet>
	);
}
