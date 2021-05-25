"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
require("./MediaUploadItem.sass");
const MediaIcon_1 = tslib_1.__importDefault(require("./MediaIcon"));
const Selectable_1 = tslib_1.__importDefault(require("../structure/Selectable"));
const as_common_1 = require("as_common");
class MediaItem extends Preact.Component {
    constructor(props) {
        super(props);
        this.handleInputClick = this.handleInputClick.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFilenameChange = this.handleFilenameChange.bind(this);
    }
    render() {
        const identifier = this.props.file.name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        return (<Selectable_1.default class="MediaUploadItem" ind={this.props.ind} doubleClickSelects={true}>
				<MediaIcon_1.default path={this.props.file.file.name} image={this.props.file.thumbnail}/>
				<div className="MediaItem-Description">

					<input type="text" maxLength={32} disabled={!this.props.editable} class="MediaItem-Name" value={this.props.file.name} onChange={this.handleNameChange} onInput={this.handleNameChange} onMouseUp={this.handleInputClick}/>

					<input type="text" maxLength={32} disabled={!this.props.editable} class="MediaItem-FileName" placeholder={identifier} value={this.props.editable ? this.props.file.identifier : (identifier + '.' + this.props.file.ext)} onChange={this.handleFilenameChange} onInput={this.handleFilenameChange} onMouseUp={this.handleInputClick}/>

					<p className="MediaItem-Metadata">{`${as_common_1.Format.bytes(this.props.file.file.size)} • ` +
                `Last modified ${as_common_1.Format.date(this.props.file.file.lastModified)}`}</p>

				</div>
			</Selectable_1.default>);
    }
    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }
    handleFilenameChange(e) {
        let target = e.target;
        let start = target.selectionStart;
        let end = target.selectionEnd;
        let oldVal = target.value;
        target.value = target.value.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        if (oldVal.length > target.value.length) {
            start -= oldVal.length - target.value.length;
            end -= oldVal.length - target.value.length;
        }
        target.setSelectionRange(start, end);
        this.props.onFilenameChange(target.value);
    }
    handleInputClick(e) {
        e.stopPropagation();
    }
}
exports.default = MediaItem;
