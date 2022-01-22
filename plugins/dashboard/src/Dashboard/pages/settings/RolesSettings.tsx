import { h } from 'preact';

import Card from '../../Card';
// import RolesEditor from '../../roles/RolesEditor';

// import { useData, QUERY_ROLES } from '../../Graph';

import icon_roles from '@res/icon/role.svg';

export default function RolesSettings() {
	// const [{ roles }] = useData(QUERY_ROLES, []);

	return (
		<Card>
			<Card.Header icon={icon_roles} title='Roles' subtitle='Manage user roles.' />
			<Card.Body class='h-48'><p>WIP</p></Card.Body>
		</Card>
	);
}
