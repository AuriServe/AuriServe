"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
require("./InputMedia.sass");
const Popup_1 = tslib_1.__importDefault(require("../../structure/Popup"));
const Modal_1 = tslib_1.__importDefault(require("../../structure/Modal"));
const MediaIcon_1 = tslib_1.__importDefault(require("../../media/MediaIcon"));
const MediaView_1 = tslib_1.__importDefault(require("../../media/MediaView"));
const SearchableOptionPicker_1 = tslib_1.__importDefault(require("../SearchableOptionPicker"));
function InputMedia(props) {
    var _a;
    const media = [];
    const item = media ? media.filter(m => m.identifier === props.value)[0] : undefined;
    const wrapRef = hooks_1.useRef(null);
    const [search, setSearch] = hooks_1.useState('');
    const [focused, setFocused] = hooks_1.useState(false);
    const [viewing, setViewing] = hooks_1.useState(false);
    const handleSearch = (evt) => {
        var _a;
        setSearch((_a = evt.target.value) !== null && _a !== void 0 ? _a : '');
    };
    const handleSet = (identifier) => {
        props.setValue(identifier);
        setSearch('');
    };
    const handleFocus = (focused) => {
        setFocused(focused);
        if (props.onFocusChange)
            props.onFocusChange(focused);
    };
    return (<div class='InputMedia' style={props.style} ref={wrapRef}>
			<input value={search} onInput={handleSearch} onChange={handleSearch} type='text' disabled={props.disabled} placeholder={item ? item.name : 'Search Media Item'} class={('InputMedia-Input ' + (item ? 'Selected' : '')).trim()} onFocus={() => handleFocus(true)} onBlur={() => handleFocus(false)}/>

			{item &&
            <button title='View Image' onClick={() => setViewing(true)} class='InputMedia-ClickableIcon'>
					<MediaIcon_1.default class='InputMedia-Img' path={(_a = item === null || item === void 0 ? void 0 : item.publicPath) !== null && _a !== void 0 ? _a : ''}/>
				</button>}
			{!item && <img class='InputMedia-Img InputMedia-NoSelection' src='/admin/asset/icon/element-dark.svg' alt=''/>}

			<Popup_1.default z={6} active={!!search && focused} defaultAnimation={true}>
				<SearchableOptionPicker_1.default query={search} parent={wrapRef.current} options={(media !== null && media !== void 0 ? media : []).map(m => m.identifier)} setSelected={selected => handleSet(selected)} renderOption={({ option }) => {
            const item = (media !== null && media !== void 0 ? media : []).filter(m => m.identifier === option)[0];
            return (<div class='InputMedia-SearchOption'>
								<MediaIcon_1.default path={item.publicPath}/>
								<p>{item.name}</p>
							</div>);
        }}/>
			</Popup_1.default>

			<Modal_1.default active={viewing} onClose={() => setViewing(false)} defaultAnimation={true}>
				{item && <MediaView_1.default item={item} user={null}/>}
			</Modal_1.default>
		</div>);
}
exports.default = InputMedia;
