// import { h } from 'preact';
// import { Format } from 'auriserve-api';

// import './MediaReplaceForm.sass';

// import MediaIcon from './MediaIcon';

// enum FormState {
// 	SELECTING,
// 	UPLOADING,
// 	COMPLETED
// }

// interface Props {
// 	replace: string;
// 	accept?: string;

// 	onSubmit: () => void;
// }

// interface State {
// 	file?: File;
// 	imagePreview?: string;
// 	state: FormState;
// }

// export default class MediaUploadForm extends Preact.Component<Props, State> {
// 	constructor(props: any) {
// 		super(props);

// 		this.state = { state: FormState.SELECTING };
// 	}

// 	render() {
// 		return (
// 			<form class='MediaReplaceForm' onSubmit={(e) => e.preventDefault()}>
// 				<div class={'MediaReplaceForm-InputWrap' +
// 					(this.state.file ? this.state.state === FormState.UPLOADING ? ' Hidden' : ' Back' : '')}>
// 					{!this.state.file && <Preact.Fragment>
// 						<input type='file' autoFocus accept={this.props.accept}
// 							class='MediaReplaceForm-Input'
// 							onChange={this.handleFileSelect} />
// 						<h2>Click or drag a replacement file here.</h2>
// 					</Preact.Fragment>}
// 					{this.state.file && <button onClick={this.handleFileRemove}
// 						class='MediaReplaceForm-IconButton MediaReplaceForm-BackButton' >
// 						<img src='/admin/asset/icon/back-dark.svg' alt='' />
// 						<span>Change File</span>
// 					</button>}
// 				</div>

// 				<div class={'MediaReplaceForm-Preview' + (this.state.file ? ' Expand' : '')}>
// 					{this.state.file && <Preact.Fragment>
// 						<MediaIcon path={this.state.file.name} image={this.state.imagePreview} />
// 						<div class='MediaReplaceForm-PreviewDescription'>
// 							<p class='MediaReplaceForm-PreviewTitle'>{Format.cleanName(this.state.file.name)}</p>
// 							<p class='MediaReplaceForm-PreviewAuthor'>{this.state.file.name}</p>
// 							<p class='MediaReplaceForm-PreviewSize'>{Format.bytes(this.state.file.size)} •
// 							Last modified {Format.date(this.state.file.lastModified)}</p>
// 						</div>
// 					</Preact.Fragment>}
// 				</div>

// 				<button onClick={this.handleUpload}
// 					class='MediaReplaceForm-IconButton MediaReplaceForm-SubmitButton'
// 					disabled={!this.state.file || this.state.state === FormState.UPLOADING}>
// 					<img src='/admin/asset/icon/check-dark.svg' alt='' />
// 					<span>Replace</span>
// 				</button>
// 			</form>
// 		);
// 	}

// 	private handleUpload = () => {
// 		this.setState({ state: FormState.UPLOADING });

// 		let data = new FormData();
// 		data.append('file', this.state.file!);
// 		data.append('replace', this.props.replace);

// 		fetch('/admin/media/replace', {
// 			method: 'POST',
// 			cache: 'no-cache',
// 			body: data
// 		}).then(() => {
// 			this.context.refreshSiteData('media');
// 			this.props.onSubmit();
// 		});
// 	};

// 	private handleFileSelect = async (e: any) => {
// 		const target = e.target as HTMLInputElement;
// 		const file = (target.files && target.files.length) ? target.files[0] : undefined;
// 		target.value = '';

// 		if (!file) return this.handleFileRemove();

// 		const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
// 		if (ext === 'png' || ext === 'jpeg' || ext === 'jpg' || ext === 'svg' || ext === 'gif') {
// 			const reader = new FileReader();
// 			reader.readAsDataURL(file);
// 			reader.onload = () => this.setState({ imagePreview: reader.result as string });
// 		}

// 		this.setState({ file: file });
// 	};

// 	private handleFileRemove = () => {
// 		this.setState({ file: undefined, imagePreview: undefined });
// 	};
// }

// MediaUploadForm.contextType = AppContext;
