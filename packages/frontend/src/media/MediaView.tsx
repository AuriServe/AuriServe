import * as Preact from 'preact';

import { Format } from 'common';
import { Media, User } from 'common/graph/type';

import UserTag from '../user/UserTag';
// import MediaReplaceForm from './MediaReplaceForm';
import MediaIcon, { mediaIsImage } from './MediaIcon';
import DimensionTransition from '../structure/DimensionTransition';

import './MediaView.sass';


interface Props {
	user: User;
	item: Media;
	onDelete?: () => void;
}

interface State {
	replacing: boolean;
}

export default class MediaView extends Preact.Component<Props, State> {
	constructor(p: Props) {
		super(p);
		this.state = { replacing: false };
	}

	render(props: Props) {
		console.log(props.item.id);
		return (
			<DimensionTransition duration={200} mode='height'>
				<div className='MediaView'>
					<div class='MediaView-Top'>
						<MediaIcon path={props.item.url} imageIcon={false} />
						<div class='MediaView-Info'>
							<h1 class='MediaView-Name'>{props.item.name}</h1>
							<h2 class='MediaView-Details'>{Format.bytes(props.item.bytes)} •
							Uploaded by <UserTag user={props.user} /> {Format.date(props.item.created)}</h2>
							<h3 class='MediaView-Path'>{props.item.url}</h3>
						</div>
					</div>

					<div class='MediaView-Toolbar'>
						<div>
							{this.props.onDelete && <button onClick={() => this.props.onDelete!()}>
								<img src='/admin/asset/icon/trash-dark.svg' alt=''/><span>Delete</span>
							</button>}
							<button onClick={this.handleReplace}>
								<img src='/admin/asset/icon/refresh-dark.svg' alt=''/>
								<span>{this.state.replacing ? 'Cancel' : 'Replace File'}</span>
							</button>
						</div>
					</div>

					{!this.state.replacing && <div class='MediaView-Preview'>
						{this.renderPreview()}
					</div>}

					{/* this.state.replacing &&
						<MediaReplaceForm
							replace={props.item.id}
							accept={'.' + props.item.extension}
							onSubmit={this.handleReplaceSubmit} /> */}
				</div>
			</DimensionTransition>
		);
	}

	private renderPreview() {
		if (mediaIsImage('.' + this.props.item.extension)) return <img src={this.props.item.url} alt=''/>;
		return <a class='MediaView-UnknownPreview' href={this.props.item.url} target='_blank' rel='noreferrer noopener'>View File</a>;
	}

	private handleReplace = () => {
		this.setState({ replacing: !this.state.replacing });
	};

	// private handleReplaceSubmit = () => {
	// 	/*
	// 	* EXTREMELY DIRTY HACK ALERT:
	// 	* To force updated images to refresh, we fetch the file without using the cache,
	// 	* and then find all img tags referencing it, and force them to re-render by clearing
	// 	* and setting their src parameter in quick succession.
	// 	*/

	// 	fetch(this.props.item.url, { method: 'GET', cache: 'no-cache' }).then(() => {
	// 		Array.from(document.getElementsByTagName('img')).forEach(e => {
	// 			if (e.src.endsWith(this.props.item.url)) {
	// 				e.src = '';
	// 				setTimeout(() => e.src = this.props.item.url, 0);
	// 			}
	// 		});
	// 		setTimeout(this.handleReplace, 16);
	// 	});
	// };
};
