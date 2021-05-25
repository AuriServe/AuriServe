import * as Preact from 'preact';

import RolesEditor from '../../roles/RolesEditor';
import { useQuery, QUERY_ROLES } from '../../Graph';

export default function RolesSettings() {
	const [ { roles } ] = useQuery(QUERY_ROLES);

	return (
		<div class='Settings RolesSettings'>
			{roles && <RolesEditor roles={roles} />}
		</div>
	);
}
