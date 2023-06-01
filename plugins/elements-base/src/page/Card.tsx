import { h } from 'preact';
// import { ServerDefinition } from 'plugin-api';

// import { Media } from 'common/graph/type';
// import { merge } from 'common/util';

// import { HydratedImageView } from './ImageView';

// import './PersonCard.sss';

// interface Props {
// 	name?: string;
// 	title?: string;
// 	description?: string;

// 	image: Media;

// 	class?: string;
// }

export default { identifier: 'base:person-card', component: () => <div /> };

// /**
//  * Renders a Person Card, consisting of a portrait, name, title, and short quote.
//  */

// function PersonCard(props: Props) {
// 	return (
// 		<figure class={merge('PersonCard', props.class)} key={props.name}>
// 			<HydratedImageView class='PersonCard-Image' media={props.image} protect aspect={100}/>
// 			<figcaption class='PersonCard-Details'>
// 				{props.name && <h2 class='PersonCard-Name'>{props.name}</h2>}
// 				{props.title && <h3 class='PersonCard-Title'>{props.title}</h3>}
// 				{props.description && <div class='PersonCard-Description'
// 					dangerouslySetInnerHTML={{ __html: props.description }}/>}
// 			</figcaption>
// 		</figure>
// 	);
// }

// export const server: ServerDefinition = {	identifier: 'PersonCard', element: PersonCard };
