import { h } from 'preact';
import { hydrate } from 'hydrated';

interface ServerProps {
	id: number;
}

interface ClientProps {
	id: number;

	media: number[];
	tmp_image: string;
	content: string;
}

export type Props = ServerProps | ClientProps;

const identifier = 'indieweb:note';

function getClientProps(_id: number): ClientProps {
	return {} as ClientProps;
}

export function RawNote(rawProps: Props) {
	const props = ('content' in rawProps) ? rawProps : getClientProps(rawProps.id);


	return (
		<div
			class={`${identifier} ${props.tmp_image ? 'has_image' : ''}`}
			style={`--image: url(${props.tmp_image})`}>
			<div class='inner'>
				{props.tmp_image && <div class='image'/>}
				<div class='meta'>
					<div class='account'>
						<img src='/media/variant/profile_aurailus.128.webp'/>
						<span>Aurailus</span>
					</div>
					<span class='date'>22 minutes ago</span>
				</div>
				<div class='text element-prose' dangerouslySetInnerHTML={{ __html: props.content }}/>
				<div class='interactions'>
					<button class='hearts'>
						<span>52</span>
					</button>
					<button class='replies'>
						<span>3</span>
					</button>
				</div>
			</div>
		</div>
	);
}

// const Note = hydrate(identifier, RawNote, (props: Props) => getClientProps(props.id));

const Note = hydrate(identifier, RawNote, (props: Props) => props);

export default { identifier, component: Note };
