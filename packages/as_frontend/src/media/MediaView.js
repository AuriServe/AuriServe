"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const as_common_1 = require("as_common");
require("./MediaView.sass");
const UserTag_1 = tslib_1.__importDefault(require("../user/UserTag"));
const MediaIcon_1 = tslib_1.__importStar(require("./MediaIcon"));
const DimensionTransition_1 = tslib_1.__importDefault(require("../structure/DimensionTransition"));
class MediaView extends Preact.Component {
    constructor(p) {
        super(p);
        this.handleReplace = () => {
            this.setState({ replacing: !this.state.replacing });
        };
        this.state = { replacing: false };
    }
    render(props) {
        console.log(props.item.id);
        return (<DimensionTransition_1.default duration={200} mode='height'>
				<div className='MediaView'>
					<div class='MediaView-Top'>
						<MediaIcon_1.default path={props.item.url} imageIcon={false}/>
						<div class='MediaView-Info'>
							<h1 class='MediaView-Name'>{props.item.name}</h1>
							<h2 class='MediaView-Details'>{as_common_1.Format.bytes(props.item.bytes)} •
							Uploaded by <UserTag_1.default user={props.user}/> {as_common_1.Format.date(props.item.created)}</h2>
							<h3 class='MediaView-Path'>{props.item.url}</h3>
						</div>
					</div>

					<div class='MediaView-Toolbar'>
						<div>
							{this.props.onDelete && <button onClick={() => this.props.onDelete()}>
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

					
				</div>
			</DimensionTransition_1.default>);
    }
    renderPreview() {
        if (MediaIcon_1.mediaIsImage('.' + this.props.item.extension))
            return <img src={this.props.item.url} alt=''/>;
        return <a class='MediaView-UnknownPreview' href={this.props.item.url} target='_blank' rel='noreferrer noopener'>View File</a>;
    }
}
exports.default = MediaView;
;
