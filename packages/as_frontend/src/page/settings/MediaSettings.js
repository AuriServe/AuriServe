"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("preact/hooks");
const as_common_1 = require("as_common");
const Input_1 = require("../../input/Input");
const Graph_1 = require("../../Graph");
require("./MediaSettings.sass");
function MediaSettings() {
    var _a, _b, _c, _d;
    const [{ media, quotas }] = Graph_1.useQuery([Graph_1.QUERY_ALL_MEDIA, Graph_1.QUERY_QUOTAS]);
    const [generateThumbnails, setGenerateThumbnails] = hooks_1.useState(false);
    const [useModernFormats, setUseModernFormats] = hooks_1.useState(false);
    return (<div class='Settings MediaSettings'>
			<Input_1.Label label='Media Statistics'/>

			<p>This site contains <strong>{(media !== null && media !== void 0 ? media : []).length} </strong>
				media items occupying a total of <strong>{as_common_1.Format.bytes((_a = quotas === null || quotas === void 0 ? void 0 : quotas.storage.used) !== null && _a !== void 0 ? _a : 0)}</strong> of storage.</p>

			<p>Media represents <strong>{Math.round(((_b = quotas === null || quotas === void 0 ? void 0 : quotas.storage.used) !== null && _b !== void 0 ? _b : 0) / ((_c = quotas === null || quotas === void 0 ? void 0 : quotas.storage.allocated) !== null && _c !== void 0 ? _c : 0) * 100)}% </strong>
				of the allocated <strong>{as_common_1.Format.bytes((_d = quotas === null || quotas === void 0 ? void 0 : quotas.storage.allocated) !== null && _d !== void 0 ? _d : 0)}</strong> of storage space.</p>

			<Input_1.Label label='Media Image Options'/>

			<Input_1.Annotation title='Generate Intermediaries' description={'Generates smaller versions of uploaded images to improve page load times. ' +
            'These images are cached to improve load times, so enabling this option consumes more storage space.'}>
				<Input_1.Checkbox value={generateThumbnails} setValue={setGenerateThumbnails}/>
			</Input_1.Annotation>

			<Input_1.Annotation title='Convert to Modern Formats' description={'Converts images to modern formats, which generally have better compression and result in quicker page loads. ' +
            'The original image is stored for older browsers, so this option will consume more storage on the server.'}>
				<Input_1.Checkbox value={useModernFormats} setValue={setUseModernFormats}/>
			</Input_1.Annotation>

			
		</div>);
}
exports.default = MediaSettings;
