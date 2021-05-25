import * as Preact from 'preact';
import { useState, useRef } from 'preact/hooks';

import { User } from 'common/graph/type';

import UserCard from './UserCard';
import { useImmediateRerender } from '../Hooks';

import './UserTag.sass';

interface Props {
	user: User;
}

export default function UserTag({ user }: Props) {
	useImmediateRerender();
	const ref = useRef(null);
	const [ active, setActive ] = useState<boolean>(false);

	return (
		<button class="UserTag" ref={ref}
			onClick={() => setActive(true)}>
			{user.username}

			{ref.current && <UserCard
				user={user}
				visible={active}
				parent={ref.current!}
				onClose={() => setTimeout(() => setActive(false), 0)}/>
			}
		</button>
	);
}
