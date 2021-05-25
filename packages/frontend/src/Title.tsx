import * as Preact from 'preact';
import { Helmet } from 'react-helmet';
import { useQuery, QUERY_INFO } from './Graph';

interface Props {
	children: string;
}

export default function Title({ children: title }: Props) {
	const [ { info } ] = useQuery(QUERY_INFO, { loadOnMount: false });
	const titleStr = info?.name ? `${title} • ${info.name}` : `${title} • AuriServe`;

	return (
		<Helmet>
			<title>{titleStr}</title>
		</Helmet>
	);
}
