"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
const SavePopup_1 = tslib_1.__importDefault(require("../../SavePopup"));
const Input_1 = require("../../input/Input");
const Graph_1 = require("../../Graph");
require("./ThemesSettings.sass");
function ThemeItem({ theme, active, onClick }) {
    return (<li class='ThemesSettings-ThemeItemWrap' key={theme.identifier}>
			<button class='ThemesSettings-ThemeItem' onClick={onClick}>
				<div class='ThemesSettings-ThemeItem-Cover'>
					{theme.coverPath && <img src={'/admin/themes/cover/' + theme.identifier + '.jpg'} alt=''/>}
					<span class={'ThemesSettings-ThemeItem-Tag ' + (active ? 'Enabled' : 'Disabled')}>
						{active ? 'Enabled' : 'Disabled'}
					</span>
				</div>

				<div class='ThemesSettings-ThemeItem-Content'>
					<h2 class='ThemesSettings-ThemeItem-Title'>{theme.name}</h2>
					<p class='ThemesSettings-ThemeItem-Author'>{theme.author}</p>
					<p class='ThemesSettings-ThemeItem-Description'>{theme.description}</p>
				</div>
			</button>
		</li>);
}
function ThemesSettings() {
    var _a, _b;
    const [data] = Graph_1.useQuery(Graph_1.QUERY_THEMES);
    const updateEnabled = Graph_1.useMutation(Graph_1.MUTATE_THEMES);
    const [themes, setThemes] = hooks_1.useState((_a = data.themes) !== null && _a !== void 0 ? _a : []);
    hooks_1.useEffect(() => { var _a; return setThemes((_a = data.themes) !== null && _a !== void 0 ? _a : []); }, [data.themes]);
    const enabled = themes.filter(t => t.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
    const disabled = themes.filter(t => !t.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
    const isDirty = JSON.stringify(((_b = data.themes) !== null && _b !== void 0 ? _b : []).map(t => t.enabled)) !== JSON.stringify(themes.map(t => t.enabled));
    const handleToggle = (toggle) => {
        const newThemes = JSON.parse(JSON.stringify(themes));
        const theme = newThemes.filter(t => t.identifier === toggle)[0];
        if (theme)
            theme.enabled = !theme.enabled;
        setThemes(newThemes.sort((a, b) => a.identifier < b.identifier ? -1 : 1));
    };
    const handleSave = () => tslib_1.__awaiter(this, void 0, void 0, function* () { return updateEnabled({ enabled: enabled.map(t => t.identifier) }); });
    return (<div class='Settings ThemesSettings'>
			<Input_1.Label label='Enabled Themes'/>
			<ul class='ThemesSettings-ThemesList'>
				{enabled.map((theme) => <ThemeItem theme={theme} active={true} onClick={() => handleToggle(theme.identifier)}/>)}
				{!enabled.length && <div class='ThemesSettings-ThemesListEmpty'>
					<h2>No enabled themes.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>
			
			<Input_1.Label label='Disabled Themes'/>
			<ul class='ThemesSettings-ThemesList'>
				{disabled.map((theme) => <ThemeItem theme={theme} active={false} onClick={() => handleToggle(theme.identifier)}/>)}
				{!disabled.length && <div class='ThemesSettings-ThemesListEmpty'>
					<h2>No disabled themes.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>

			<SavePopup_1.default active={isDirty} onSave={handleSave} onReset={() => { var _a; return setThemes((_a = data.themes) !== null && _a !== void 0 ? _a : []); }}/>
		</div>);
}
exports.default = ThemesSettings;
