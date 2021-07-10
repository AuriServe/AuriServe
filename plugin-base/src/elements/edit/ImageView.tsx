import * as Preact from 'preact';
import { useRef } from 'preact/hooks';
import { useActiveState } from 'editor/hooks';
import { AdminDefinition } from 'common/definition';
import { useData, QUERY_MEDIA } from 'editor/graph';
import { ComponentArea, Label, Text, Numeric, Toggle, Media, Card } from 'editor/components';

import { server, ImageView, Props as ImageViewProps } from '../ImageView';

import './ImageView.sss';

interface Props {
	props: ImageViewProps;
	setProps: (props: ImageViewProps) => void;
}

function EditImageView({ props, setProps }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const { hovered, active } = useActiveState();
	const [ { media } ] = useData(QUERY_MEDIA, []);

	return (
		<Preact.Fragment>
			<ImageView ref={elem => ref.current = elem?.parentElement} {...props}/>
			{(hovered || active) && <ComponentArea for={ref.current} active={active} indicator={true}>
				{active && <Card class='EditImageView-Props'>
					<Label label='Image'>
						<Media value={props.media.id} onValue={(id: string) =>
							setProps({ ...props, media: media.filter((media: any) => media.id === id)[0] })}/>
					</Label>
					<Label label='Description'>
						<Text value={props.alt} onValue={(alt: string) => setProps({ ...props, alt })}/>
					</Label>
					<Label label='Aspect Ratio'>
						<Numeric value={props.aspect} onValue={(aspect: number) => setProps({ ...props, aspect })}/>
					</Label>
					<Label label='Lightbox'>
						<Toggle value={props.lightbox} onValue={(lightbox: boolean) => setProps({ ...props, lightbox })}/>
					</Label>
					<Label label='Copy Protection'>
						<Toggle value={props.protect} onValue={(protect: boolean) => setProps({ ...props, protect })}/>
					</Label>
				</Card>}
			</ComponentArea>}
		</Preact.Fragment>
	);
}

export const admin: AdminDefinition = {
	...server,
	element: ImageView,
	editing: {
		focusRing: false,
		inlineEditor: EditImageView
	}
};
