import { h } from 'preact';
import { merge } from 'common';
import type { ComponentChildren } from 'preact';
import { getOptimizedImage } from 'media';
import { usePageContext } from 'pages';

interface Props {
	url?: string;
	media?: number;
	label?: string;

	target?: 'new';
	width?: number;

	class?: string;
	children?: ComponentChildren;
}

const identifier = 'base:button';

function Button(props: Props) {
	const ctx = usePageContext();
	let active = false;
	if (props.url) {
		const requestPath = ((ctx?.path ?? '!!').replace(/^\//, '').replace(/#.*/, '').replace(/\/$/, ''));
		active = (props.url ?? '!!').replace(/^\//, '').replace(/#.*/, '').replace(/\/$/, '') === requestPath;
	}

	return (
		<a
			rel='noreferrer noopener'
			href={props.url}
			title={props.media != null ? props.label : undefined}
			aria-label={props.media != null ? props.label : undefined}
			target={props.target === 'new' ? '_blank' : undefined}
			class={merge(identifier, props.class, props.media != null && 'image', active && 'active')}>
			{props.media == null && <span>{props.label}</span>}
			{props.media != null && (
				<img
					src={`/media/${getOptimizedImage(props.media, 'svg_min')?.path}`}
					width={props.width}
					height={props.width}
					alt=''
				/>
			)}
		</a>
	);
}

export default { identifier, component: Button };
