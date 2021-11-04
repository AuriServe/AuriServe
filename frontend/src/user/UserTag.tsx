import { h } from 'preact';
import { useRerender } from 'vibin-hooks';
import { useState, useEffect, useRef } from 'preact/hooks';

import { User } from 'common/graph/type';

import UserCard from './UserCard';

interface Props {
	user: User;
}

export default function UserTag({ user }: Props) {
	const rerender = useRerender();
	useEffect(() => rerender, []);

	const ref = useRef(null);
	const [ active, setActive ] = useState<boolean>(false);

	if (!user) return <span>[Unknown]</span>;

	return (
		<button ref={ref} onClick={() => setActive(true)}
			class='inline font-medium underline focus:outline-none text-blue-600 dark:text-blue-400
				dark:hover:text-blue-500 hover:text-blue-500 active:text-blue-400 dark:active:text-blue-600'>
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
