import { h } from 'preact';

import RolesEditor from '../../roles/RolesEditor';
import { useData, QUERY_ROLES } from '../../Graph';

export default function RolesSettings() {
	const [ { roles } ] = useData(QUERY_ROLES, []);

	return (
		<div class='Settings RolesSettings'>
			{roles && <RolesEditor roles={roles} />}
		</div>
	);
}
