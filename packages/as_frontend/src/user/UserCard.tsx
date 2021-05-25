import * as Preact from 'preact';
import { useRef } from 'preact/hooks';
import { Link } from 'react-router-dom';
import { User } from 'as_common/graph/interface';

import { usePopupCancel } from '../Hooks';

import './UserCard.sass';

import Popup from '../structure/Popup';
import UserRolesList from './UserRolesList';

interface Props {
	user: User;
	visible: boolean;
	parent: HTMLElement;

	onClose: () => void;
}

export default function UserCard(props: Props) {
	const ref = useRef<HTMLDivElement>(null);
	usePopupCancel(ref, props.onClose, () => props.visible, [ props.visible ]);
	
	return (
		<Popup active={props.visible} defaultAnimation={true}>
			<div class='UserCard' ref={ref} style={{
				top: props.parent.getBoundingClientRect().bottom + 'px',
				left: ((props.parent.getBoundingClientRect().left +
					props.parent.getBoundingClientRect().right) / 2) + 'px'}}>

				<div class='UserCard-Header'>
					<img src='/admin/asset/icon/user-color.svg' />
					<h1 class='UserCard-Name' title={props.user.username}>{props.user.username}</h1>
					<h2 class='UserCard-Identifier' title={props.user.id}>{props.user.id}</h2>
				</div>
				<div class='UserCard-Body'>
					<UserRolesList user={props.user} wrap={true} edit={true} />
					<Link to={'/users/' + props.user.id} className='UserCard-Full'>View Profile</Link>
				</div>
			</div>
		</Popup>
	);
};
