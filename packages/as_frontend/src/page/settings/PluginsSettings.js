"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hooks_1 = require("preact/hooks");
const SavePopup_1 = tslib_1.__importDefault(require("../../SavePopup"));
const Input_1 = require("../../input/Input");
const Graph_1 = require("../../Graph");
require("./PluginsSettings.sass");
function PluginItem({ plugin, active, onClick }) {
    return (<li class='PluginsSettings-PluginItemWrap' key={plugin.identifier}>
			<button class='PluginsSettings-PluginItem' onClick={onClick}>
				<div class='PluginsSettings-PluginItem-Cover'>
					{plugin.coverPath && <img src={'/admin/plugins/cover/' + plugin.identifier + '.jpg'} alt=''/>}
					<span class={'PluginsSettings-PluginItem-Tag ' + (active ? 'Enabled' : 'Disabled')}>
						{active ? 'Enabled' : 'Disabled'}
					</span>
				</div>

				<div class='PluginsSettings-PluginItem-Content'>
					<h2 class='PluginsSettings-PluginItem-Title'>{plugin.name}</h2>
					<p class='PluginsSettings-PluginItem-Author'>{plugin.author}</p>
					<p class='PluginsSettings-PluginItem-Description'>{plugin.description}</p>
				</div>
			</button>
		</li>);
}
function PluginsSettings() {
    var _a, _b;
    const [data] = Graph_1.useQuery(Graph_1.QUERY_PLUGINS);
    const updateEnabled = Graph_1.useMutation(Graph_1.MUTATE_PLUGINS);
    const [plugins, setPlugins] = hooks_1.useState((_a = data.plugins) !== null && _a !== void 0 ? _a : []);
    hooks_1.useEffect(() => { var _a; return setPlugins((_a = data.plugins) !== null && _a !== void 0 ? _a : []); }, [data.plugins]);
    const enabled = plugins.filter(p => p.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
    const disabled = plugins.filter(p => !p.enabled).sort((a, b) => a.identifier < b.identifier ? -1 : 1);
    const isDirty = JSON.stringify(((_b = data.plugins) !== null && _b !== void 0 ? _b : []).map(p => p.enabled)) !== JSON.stringify(plugins.map(p => p.enabled));
    const handleToggle = (toggle) => {
        const newplugins = JSON.parse(JSON.stringify(plugins));
        const theme = newplugins.filter(p => p.identifier === toggle)[0];
        if (theme)
            theme.enabled = !theme.enabled;
        setPlugins(newplugins.sort((a, b) => a.identifier < b.identifier ? -1 : 1));
    };
    const handleSave = () => tslib_1.__awaiter(this, void 0, void 0, function* () { return updateEnabled({ enabled: enabled.map(p => p.identifier) }); });
    return (<div class='Settings PluginsSettings'>
			<Input_1.Label label='Enabled Plugins'/>
			<ul class='PluginsSettings-PluginsList'>
				{enabled.map((plugin) => <PluginItem plugin={plugin} active={true} onClick={() => handleToggle(plugin.identifier)}/>)}
				{!enabled.length && <div class='PluginsSettings-PluginsListEmpty'>
					<h2>No enabled plugins.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>

			<Input_1.Label label='Disabled Plugins'/>
			<ul class='PluginsSettings-PluginsList'>
				{disabled.map((plugin) => <PluginItem plugin={plugin} active={false} onClick={() => handleToggle(plugin.identifier)}/>)}
				{!disabled.length && <div class='PluginsSettings-PluginsListEmpty'>
					<h2>No disabled plugins.</h2>
					<p>Try refreshing if you believe this is an error.</p>
				</div>}
			</ul>

			<SavePopup_1.default active={isDirty} onSave={handleSave} onReset={() => { var _a; return setPlugins((_a = data.plugins) !== null && _a !== void 0 ? _a : []); }}/>
		</div>);
}
exports.default = PluginsSettings;
