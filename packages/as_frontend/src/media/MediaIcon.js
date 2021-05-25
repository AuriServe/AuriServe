"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaIsImage = void 0;
require("./MediaIcon.sass");
const IMAGE_EXTS = ['png', 'svg', 'jpg', 'jpeg', 'svg', 'gif'];
const ICON_PREFIX = '/admin/asset/icon/ext-';
const ICONS = {
    unknown: ICON_PREFIX + 'unknown-color.svg',
    md: ICON_PREFIX + 'txt-color.svg',
    txt: ICON_PREFIX + 'txt-color.svg',
    pdf: ICON_PREFIX + 'pdf-color.svg',
    doc: ICON_PREFIX + 'document-color.svg',
    docx: ICON_PREFIX + 'document-color.svg',
    xls: ICON_PREFIX + 'sheet-color.svg',
    xlsx: ICON_PREFIX + 'sheet-color.svg',
    ppt: ICON_PREFIX + 'slideshow-color.svg',
    pptx: ICON_PREFIX + 'slideshow-color.svg',
    image: ICON_PREFIX + 'image-color.svg'
};
function mediaIsImage(path) {
    return IMAGE_EXTS.filter((p) => path.endsWith('.' + p)).length > 0;
}
exports.mediaIsImage = mediaIsImage;
function MediaIcon(props) {
    var _a, _b, _c, _d, _e;
    const isImage = (_a = props.image) !== null && _a !== void 0 ? _a : mediaIsImage(props.path);
    const showImage = (props.imageIcon === undefined || props.imageIcon);
    if (isImage && showImage)
        return (<img class={('MediaIcon Image ' + ((_b = props.class) !== null && _b !== void 0 ? _b : '')).trim()} src={(props.image ? props.image : props.path + '?res=thumbnail')} alt='' loading='lazy'/>);
    let iconUrl = ICONS.unknown;
    if (isImage)
        iconUrl = (showImage ? (_c = props.image) !== null && _c !== void 0 ? _c : props.path : ICONS.image);
    else
        iconUrl = (_d = ICONS[props.path.substr(props.path.lastIndexOf('.') + 1)]) !== null && _d !== void 0 ? _d : iconUrl;
    return (<img class={('MediaIcon Icon ' + ((_e = props.class) !== null && _e !== void 0 ? _e : '')).trim()} src={iconUrl} alt=''/>);
}
exports.default = MediaIcon;
