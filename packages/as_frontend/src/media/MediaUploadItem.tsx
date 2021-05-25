import * as Preact from 'preact';

import './MediaUploadItem.sass';

import MediaIcon from './MediaIcon';
import Selectable from '../structure/Selectable';
import { UploadItemData } from './MediaUploadForm';

import { Format } from 'as_common';

interface Props {
	file: UploadItemData;
	ind: number;

	editable: boolean;

	onNameChange: (name: string) => void;
	onFilenameChange: (name: string) => void;
}

export default class MediaItem extends Preact.Component<Props, {}> {
	constructor(props: Props) {
		super(props);

		this.handleInputClick = this.handleInputClick.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleFilenameChange = this.handleFilenameChange.bind(this);
	}

	render() {
		const identifier = this.props.file.name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		return (
			<Selectable class="MediaUploadItem" ind={this.props.ind} doubleClickSelects={true}>
				<MediaIcon path={this.props.file.file.name} image={this.props.file.thumbnail} />
				<div className="MediaItem-Description">

					<input
						type="text"
						maxLength={32}
						disabled={!this.props.editable}

						class="MediaItem-Name"
						value={this.props.file.name}

						onChange={this.handleNameChange} onInput={this.handleNameChange} onMouseUp={this.handleInputClick}
					/>

					<input
						type="text"
						maxLength={32}
						disabled={!this.props.editable}

						class="MediaItem-FileName"
						placeholder={identifier}
						value={this.props.editable ? this.props.file.identifier : (identifier + '.' + this.props.file.ext)}
						
						onChange={this.handleFilenameChange}
						onInput={this.handleFilenameChange}
						onMouseUp={this.handleInputClick}
					/>

					<p className="MediaItem-Metadata">{`${Format.bytes(this.props.file.file.size)} • ` +
						`Last modified ${Format.date(this.props.file.file.lastModified)}`}</p>

				</div>
			</Selectable>
		);
	}

	private handleNameChange(e: any) {
		this.props.onNameChange(e.target.value);
	}

	private handleFilenameChange(e: any) {
		let target = e.target as HTMLInputElement;

		let start = target.selectionStart!;
		let end = target.selectionEnd!;

		let oldVal = target.value;
		target.value = target.value.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		
		if (oldVal.length > target.value.length) {
			start -= oldVal.length - target.value.length;
			end -= oldVal.length - target.value.length;
		}

		target.setSelectionRange(start, end);

		this.props.onFilenameChange(target.value);
	}

	private handleInputClick(e: any) {
		e.stopPropagation();
	}
}
