// import * as Preact from 'preact';

// import { ImageProp } from '../ImageGallery';
// // import { SelectGroupContext } from '../../../../../../../admin/src/components/SelectGroup';

// // import Selectable from '../../../../../../../admin/src/components/Selectable';

// interface Props {
// 	ind: number;
// 	image: ImageProp;
// 	draggable: boolean;
// }

// export default class EditImageGalleryItem extends Preact.Component<Props, {}> {
// 	render() {
// 		return (
// 			<SelectGroupContext.Consumer>{ctx =>
// 				<li key={this.props.image.src}
// 					class={'EditImageGalleryItem' +
// 						(this.props.draggable ? ' draggable' : '') +
// 						(ctx.selected[this.props.ind] ? ' selected' : '')}>
// 					<img class='EditImageGalleryItem-Hook' src='/plugin/base/res/select_chevron_dark.svg' alt='' />
// 					<div class='EditImageGalleryItem-Content'>
// 						<Selectable class='EditImageGalleryItem-ImageButton'
// 							ind={this.props.ind} callbacks={{}} doubleClickSelects={true}>
// 							<img class='EditImageGalleryItem-Image'
// 								src={this.props.image.src} alt={this.props.image.alt || this.props.image.name || ''} />
// 						</Selectable>
// 						<div class='EditImageGalleryItem-Description'>
// 							<p class='EditImageGalleryItem-Name'>{this.props.image.name ?? 'Untitled'}</p>
// 							<p class='EditImageGalleryItem-Desc'>{this.props.image.desc ?? <em>No description.</em>}</p>
// 						</div>
// 					</div>
// 				</li>
// 			}</SelectGroupContext.Consumer>
// 		);
// 	}
// }
