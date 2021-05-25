import * as Preact from 'preact';
import { useState, useRef } from 'preact/hooks';
import { User } from 'as_common/graph/interface';

import UserCard from './UserCard';

import './UserTag.sass';
import { useImmediateRerender } from '../Hooks';

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
