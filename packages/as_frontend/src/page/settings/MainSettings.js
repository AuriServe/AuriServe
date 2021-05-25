"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
const SavePopup_1 = tslib_1.__importDefault(require("../../SavePopup"));
const Input = tslib_1.__importStar(require("../../input/Input"));
const Graph_1 = require("../../Graph");
require("./MainSettings.sass");
function MainSettings() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [data] = Graph_1.useQuery(Graph_1.QUERY_INFO);
    const updateData = Graph_1.useMutation(Graph_1.MUTATE_INFO);
    const [info, setInfo] = hooks_1.useReducer((info, newInfo) => (Object.assign(Object.assign({}, info), newInfo)), { name: (_a = data.info) === null || _a === void 0 ? void 0 : _a.name, domain: (_b = data.info) === null || _b === void 0 ? void 0 : _b.domain,
        description: (_c = data.info) === null || _c === void 0 ? void 0 : _c.description, favicon: (_d = data.info) === null || _d === void 0 ? void 0 : _d.favicon });
    const handleReset = () => {
        var _a, _b, _c, _d, _e, _f, _g;
        return setInfo({ name: (_b = (_a = data.info) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '', domain: (_d = (_c = data.info) === null || _c === void 0 ? void 0 : _c.domain) !== null && _d !== void 0 ? _d : '',
            description: (_f = (_e = data.info) === null || _e === void 0 ? void 0 : _e.description) !== null && _f !== void 0 ? _f : '', favicon: (_g = data.info) === null || _g === void 0 ? void 0 : _g.favicon });
    };
    hooks_1.useEffect(() => handleReset(), [data]);
    const isDirty = info.name !== ((_e = data.info) === null || _e === void 0 ? void 0 : _e.name) || info.domain !== ((_f = data.info) === null || _f === void 0 ? void 0 : _f.domain) ||
        info.description !== ((_g = data.info) === null || _g === void 0 ? void 0 : _g.description) || info.favicon !== ((_h = data.info) === null || _h === void 0 ? void 0 : _h.favicon);
    const handleSave = () => updateData({ info });
    return (<div class='Settings MainSettings'>
			<form onSubmit={e => e.preventDefault()}>
				<div class='MainSettings-Columns' style={{ paddingBottom: 16 }}>
					<div>
						<Input.Annotation title='Site Name' description='A name for your site, used by browers and search engines.'>
							<Input.Text placeholder={'An AuriServe Website'} value={info.name} setValue={name => setInfo({ name })}/>
						</Input.Annotation>
					</div>
					<div>
						<Input.Annotation title='Site Domain' description='The domain of your site. Used by plugins and links.'>
							<Input.Text placeholder={'https://example.com'} value={info.domain} setValue={domain => setInfo({ domain })}/>
						</Input.Annotation>
					</div>
				</div>

				<Input.Annotation title='Site Description' description='A short, consise description of your website, used in search engine results.'>
					<Input.Text long={true} placeholder='Description' value={info.description} setValue={description => setInfo({ description })}/>
				</Input.Annotation>

				<div class='MainSettings-Columns' style={{ paddingTop: 16 }}>
					<div>
						<Input.Annotation title='Site Favicon' description='An icon for your site, displayed in the corner of tabs.'>
							<Input.Media type='image' value={info.favicon} setValue={favicon => setInfo({ favicon })}/>
						</Input.Annotation>
						
					</div>
					<div>
					</div>
				</div>
				<SavePopup_1.default active={isDirty} onSave={handleSave} onReset={handleReset}/>
			</form>
		</div>);
}
exports.default = MainSettings;
