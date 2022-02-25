import { h } from 'preact';

import Card from '../Card';

// import { tw } from '../../Twind';

import * as Icon from '../../Icon';
// import Svg from '../Svg';

export default function UserSettings() {
	return (
		<Card>
			<Card.Header
				icon={Icon.role}
				title='Roles'
				subtitle='Add, remove, and modify roles.'
			/>
			<Card.Body />
		</Card>
	);
}
