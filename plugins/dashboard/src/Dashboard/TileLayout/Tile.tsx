import { useContext } from 'preact/hooks';
import { ComponentChildren, h } from 'preact';

import Button from '../Button';
import { Context } from './Context';

import icon_edit from '@res/icon/edit.svg';
import icon_remove from '@res/icon/trash.svg';

interface Props {
	width: number;
	height: number;

	children: ComponentChildren;
}

export default function Tile(props: Props) {
	const { editing } = useContext(Context);

	return (
		<div
			class='relative group-e'
			style={{
				gridColumn: `span ${props.width}`,
				gridRow: `span ${props.height}`,
			}}>
			{editing && (
				<div
					class='absolute -inset-2 border-2 border-accent-600 rounded-lg ring-2
				ring-accent-600/40 transition opacity-0 scale-[99.5%] group-e-hover:will-change-transform
				group-e-hover:opacity-100 group-e-hover:scale-100'>
					<div class='flex gap-2 absolute -top-4 -mt-px right-2 w-max interact-auto'>
						<Button.Primary small label='Edit' icon={icon_edit} />
						<Button.Primary small label='Remove' icon={icon_remove} iconOnly />
					</div>
					{/* <div class='absolute inset-0 rounded-md ring-2 ring-inset ring-accent-600/40'/> */}
				</div>
			)}
			{props.children}
		</div>
	);
}
