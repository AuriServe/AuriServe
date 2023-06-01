import { ComponentChildren, h } from 'preact';
import { tw, Button, Svg, useLocation } from 'dashboard';

interface Props {
	icon: string;
	name: string;
	unread: number;
	id: number;
	children?: ComponentChildren;
}

export default function SidebarItem(props: Props) {
	const location = useLocation();
	const largeUnread = props.unread < 10 || props.unread > 99;
	const active = location.pathname === `/forms/${props.id}`;

	return (
		<Button.Unstyled
			to={`/forms/${props.id}`}
			class={tw`w-full text-left flex gap-3 p-1.5 items-end rounded-md transition text-gray-200 hover:bg-gray-800/50
				${active && `!(bg-gray-800 text-accent-100)`}`}>
			<Svg src={props.icon} size={6} class={tw`ml-0.5 ${active && `icon-(p-accent-100 s-accent-300)`}`} />
			<p class={tw`leading-snug font-medium flex-grow`}>{props.name}</p>
			{props.unread > 0 && <div class={tw`w-[18px] h-[18px] bg-accent-400/50 rounded-full shrink-0
				ring-(2 offset-(1 gray-800) accent-500/25) mr-1 self-center`}>
				<span class={tw`text-accent-50 text-[${largeUnread ? props.unread > 99 ? 16 : 13 : 11}px]
					font-black align-top text-center block ${largeUnread ? '' : 'mt-0.5'}`}>
					{props.unread <= 99 ? props.unread : '*'}
				</span>
			</div>}
		</Button.Unstyled>
	);
}
