"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mime_1 = tslib_1.__importDefault(require("mime"));
const react_router_dom_1 = require("react-router-dom");
const hooks_1 = require("preact/hooks");
const Title_1 = tslib_1.__importDefault(require("../Title"));
const SavePopup_1 = tslib_1.__importDefault(require("../SavePopup"));
const Modal_1 = tslib_1.__importDefault(require("../structure/Modal"));
const MediaItem_1 = tslib_1.__importDefault(require("../media/MediaItem"));
const MediaView_1 = tslib_1.__importDefault(require("../media/MediaView"));
const Dropdown_1 = tslib_1.__importDefault(require("../structure/Dropdown"));
const Input_1 = require("../input/Input");
const CardHeader_1 = tslib_1.__importDefault(require("../structure/CardHeader"));
const SelectGroup_1 = tslib_1.__importDefault(require("../structure/SelectGroup"));
const MediaUploadForm_1 = tslib_1.__importDefault(require("../media/MediaUploadForm"));
const Graph_1 = require("../Graph");
require("./MediaPage.sass");
const SORTING_FUNCS = {
    size: (a, b) => a.bytes - b.bytes,
    name: (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }),
    uploader: (a, b) => a.user.localeCompare(b.user, undefined, { numeric: true }),
    date: (a, b) => a.created - b.created,
    type: () => 0
};
function titleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
function MediaPage() {
    var _a, _b, _c, _d, _e;
    let [data, , refresh] = Graph_1.useQuery([Graph_1.QUERY_INFO, Graph_1.QUERY_ALL_MEDIA, Graph_1.QUERY_QUOTAS, Graph_1.QUERY_USERS]);
    const deleteMedia = Graph_1.useMutation(Graph_1.MUTATE_DELETE_MEDIA);
    const [view, setView] = hooks_1.useState('grid');
    const [filter, setFilter] = hooks_1.useState('');
    const [sortDir, setSortDir] = hooks_1.useState('descending');
    const [sortType, setSortType] = hooks_1.useState('size');
    const [media, setMedia] = hooks_1.useState((_a = data.media) !== null && _a !== void 0 ? _a : []);
    const [deleted, setDeleted] = hooks_1.useState([]);
    const [selected, setSelected] = hooks_1.useState([]);
    const [viewing, setViewing] = hooks_1.useState(undefined);
    const [uploading, setUploading] = hooks_1.useState(false);
    const handleUploadMedia = () => {
        setSelected([]);
        setUploading(true);
    };
    const handleUploaded = () => {
        refresh();
        setUploading(false);
    };
    const handleDelete = (items) => {
        setDeleted([...deleted, ...items]);
        setViewing(undefined);
    };
    const handleSave = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield deleteMedia({ media: media.filter((_, i) => deleted.includes(i)).map(m => m.id) });
        yield refresh();
        setViewing(undefined);
        setDeleted([]);
    });
    hooks_1.useEffect(() => {
        var _a, _b;
        let newMedia = [...(_a = data.media) !== null && _a !== void 0 ? _a : []];
        let query = filter.toLowerCase();
        let mimes = ((_b = query.match(/#\w+\/?\w*/g)) !== null && _b !== void 0 ? _b : []).map(s => s.substr(1));
        query = query.replace(/#\w*\/?\w* */g, '');
        if (filter)
            newMedia = newMedia.filter(m => m.url.toLowerCase().includes(query) || m.name.toLowerCase().includes(query));
        if (mimes.length)
            newMedia = newMedia.filter(({ path: p }) => mimes.filter(m => { var _a; return (_a = mime_1.default.getType(p)) === null || _a === void 0 ? void 0 : _a.startsWith(m); }).length);
        if (sortDir === 'ascending')
            newMedia = newMedia.sort(SORTING_FUNCS[sortType]);
        else
            newMedia = newMedia.sort(SORTING_FUNCS[sortType]).reverse();
        setMedia(newMedia);
    }, [sortType, sortDir, data.media, filter]);
    hooks_1.useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.key === 'Delete')
                handleDelete(selected);
        };
        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [selected]);
    let viewingItem = (_b = data.media) === null || _b === void 0 ? void 0 : _b.filter(m => m.id === viewing)[0];
    return (<div class='Page MediaPage'>
			<Title_1.default>Media</Title_1.default>
			<section class='Page-Card'>
				<CardHeader_1.default icon='/admin/asset/icon/image-dark.svg' title='Manage Media' subtitle={'Create or remove user-uploaded media.'}/>

				<div class='MediaPage-Toolbar'>
					<div>
						<button class='MediaPage-ToolbarButton' onClick={handleUploadMedia}>
							<img src='/admin/asset/icon/add-dark.svg' alt=''/><span>Upload Media</span>
						</button>

						{selected.length > 0 && <button class='MediaPage-ToolbarButton' onClick={() => handleDelete(selected)}>
							<img src='/admin/asset/icon/trash-dark.svg' alt=''/>
							<span>{selected.length === 1 ? 'Delete' : 'Delete (' + selected.length + ')'}</span>
						</button>}
					</div>

					<div>
						<button class='MediaPageDropdown-Button' title='Refresh' aria-label='Refresh' onClick={refresh}>
							<img src='/admin/asset/icon/refresh-dark.svg' alt=''/>
						</button>

						<Dropdown_1.default class='MediaPageDropdown' buttonClass='MediaPage-ToolbarButton' buttonChildren={<img src={`/admin/asset/icon/view-${filter ? 'color' : 'dark'}.svg`} alt=''/>}>
							
							<button class='MediaPageDropdown-Button' onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
								<img src={`/admin/asset/icon/${view}-view-dark.svg`} alt=''/>
								<span>{titleCase(view)} View</span>
							</button>
							
							<div class='MediaPageDropdown-LabelIconPair'>
								<Input_1.Select class='MediaPageDropdown-IconWrap MediaPageDropdown-Input' multi={true} style={{ '--icon': 'url(/admin/asset/icon/sort-dark.svg)' }} options={{ name: 'Name', size: 'Size', uploader: 'Uploader', date: 'Upload Date', type: 'File Type' }} placeholder='No filter' value={sortType} setValue={setSortType}/>

								<button class='MediaPageDropdown-Button' title={titleCase(sortDir)} aria-label={titleCase(sortDir)} onClick={() => setSortDir(sortDir === 'ascending' ? 'descending' : 'ascending')}>
									<img src={`/admin/asset/icon/sort-${sortDir === 'ascending' ? 'desc' : 'asc'}-dark.svg`} alt=''/>
								</button>
							</div>

							<div class='MediaPageDropdown-IconWrap' style={{ '--icon': 'url(/admin/asset/icon/filter-dark.svg)' }}>
								<Input_1.Text class='MediaPageDropdown-Input' placeholder='No filter' value={filter} setValue={setFilter}/>
							</div>
						</Dropdown_1.default>

						<react_router_dom_1.NavLink className='MediaPage-ToolbarButton' title='Media Settings' aria-label='Media Settings' to='/settings/media'>
							<img src='/admin/asset/icon/settings-dark.svg' alt=''/>
						</react_router_dom_1.NavLink>
					</div>
				</div>

				{media.filter((_, i) => !deleted.includes(i)) &&
            <SelectGroup_1.default selected={selected} setSelected={setSelected} multi={true} enabled={true} class={'MediaPage-Media ' + (view === 'grid' ? 'Grid' : 'Stack')}>
						{media.map((a, i) => {
                    var _a;
                    return !deleted.includes(i) ? (<MediaItem_1.default ind={i} user={(_a = data.users) === null || _a === void 0 ? void 0 : _a.filter(u => u.id === a.user)[0]} item={a} key={a.identifier} onClick={() => setViewing(a.id)}/>) : null;
                }).filter(i => i)}
					</SelectGroup_1.default>}

				{!media ? <h2 class='MediaPage-Notice'>Loading media...</h2> :
            !media.filter((_, i) => !deleted.includes(i)).length ?
                <h2 class='MediaPage-Notice'>No media found.</h2> : null}
			</section>

			<Modal_1.default active={viewingItem !== undefined} onClose={() => setViewing(undefined)} defaultAnimation={true}>
				{viewingItem && <MediaView_1.default onDelete={() => handleDelete([data.media.map(a => a.id).indexOf(viewing)])} user={(_c = data.users) === null || _c === void 0 ? void 0 : _c.filter(u => u.id === viewingItem.user)[0]} item={viewingItem}/>}
			</Modal_1.default>

			<Modal_1.default active={uploading} defaultAnimation={true}>
				<CardHeader_1.default icon='/admin/asset/icon/document-dark.svg' title='Upload Media' subtitle={`Upload new media assets to ${(_e = (_d = data.info) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : ''}.`}/>
				<MediaUploadForm_1.default onCancel={() => setUploading(false)} onUpload={handleUploaded}/>
			</Modal_1.default>

			<SavePopup_1.default active={deleted.length !== 0} onSave={handleSave} onReset={() => setDeleted([])}/>
		</div>);
}
exports.default = MediaPage;
