import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { User } from 'common/graph/type';

import { usePopupCancel } from '../Hooks';
import UserRolesList from './UserRolesList';
import { Popup, Card, Button } from '../structure';

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
			<Card class='fixed w-56 h-auto !p-0 pointer-events-auto overflow-hidden !shadow-lg !my-2' ref={ref} style={{
				top: props.parent.getBoundingClientRect().bottom + 'px',
				left: ((props.parent.getBoundingClientRect().left +
					props.parent.getBoundingClientRect().right) / 2) - (56 * 2) + 'px'}}>

				<div class='px-2 py-4'>
					<img src='/admin/asset/icon/user-color.svg'
						class='my-2 mb-1 w-32 h-32 mx-auto rounded-full border-4 bg-blue-600
							border-blue-600 bg-blue-600/50 ring-4 ring-blue-600/25'/>
					<h2 class='mt-4 mb-1 f-head text-xl text-center' title={props.user.username}>{props.user.username}</h2>
					<h3 class='mb-2 text-center text-sm font-medium text-gray-600 truncate'
						title={props.user.id}>{props.user.id.slice(0, 12)}</h3>
				</div>
				<div class='bg-gray-200 p-3'>
					<UserRolesList user={props.user} wrap={true} edit={true} />
					<Button class='w-full !bg-gray-300 text-center' to={'/users/' + props.user.id} label='View Profile'/>
				</div>
			</Card>
		</Popup>
	);
};
