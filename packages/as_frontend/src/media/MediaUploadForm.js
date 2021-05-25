"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const as_common_1 = require("as_common");
const hooks_1 = require("preact/hooks");
require("./MediaUploadForm.sass");
const MediaUploadItem_1 = tslib_1.__importDefault(require("./MediaUploadItem"));
const SelectGroup_1 = tslib_1.__importDefault(require("../structure/SelectGroup"));
const DimensionTransition_1 = tslib_1.__importDefault(require("../structure/DimensionTransition"));
var MediaUploadState;
(function (MediaUploadState) {
    MediaUploadState[MediaUploadState["SELECTING"] = 0] = "SELECTING";
    MediaUploadState[MediaUploadState["UPLOADING"] = 1] = "UPLOADING";
    MediaUploadState[MediaUploadState["COMPLETED"] = 2] = "COMPLETED";
})(MediaUploadState || (MediaUploadState = {}));
function MediaUploadForm(props) {
    const [grid, setGrid] = hooks_1.useState(true);
    const [selected, setSelected] = hooks_1.useState([]);
    const [files, setFiles] = hooks_1.useState([]);
    const [state, setState] = hooks_1.useState(MediaUploadState.SELECTING);
    const handleClose = (e) => {
        e.preventDefault();
        props.onCancel();
    };
    const handleUpload = () => {
        setState(MediaUploadState.UPLOADING);
        setSelected([]);
        const THREADS = 6;
        let success = [];
        let promises = [];
        for (let i = 0; i < THREADS; i++) {
            let ind = i;
            promises.push(new Promise((resolve) => {
                const f = () => {
                    if (ind >= files.length)
                        return resolve();
                    const file = files[ind];
                    let data = new FormData();
                    data.append('file', file.file);
                    data.append('name', file.name);
                    data.append('identifier', file.identifier);
                    fetch('/admin/media/upload', {
                        method: 'POST', cache: 'no-cache', body: data
                    }).then((r) => {
                        if (r.status === 202)
                            success.push(as_common_1.Format.sanitize(file.identifier || file.name));
                        ind += THREADS;
                        f();
                    });
                };
                f();
            }));
        }
        ;
        Promise.all(promises).then(() => props.onUpload());
    };
    const handleRemoveFiles = () => {
        let newFiles = [...files];
        selected.reverse().forEach((ind) => newFiles.splice(ind, 1));
        setFiles(newFiles);
    };
    const handleAddFiles = (e) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let newFiles = [...files];
        let addedFiles = [...(e.target.files || [])];
        e.target.value = '';
        yield Promise.all(addedFiles.map(file => new Promise((resolve) => {
            const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
            const isImage = ext === 'png' || ext === 'jpeg' || ext === 'jpg' || ext === 'svg' || ext === 'gif';
            const cleanName = as_common_1.Format.fileNameToName(file.name, 32);
            const resolveFile = (image) => {
                if (!newFiles.map(f => f.name).includes(cleanName)) {
                    newFiles.push({
                        file, ext,
                        name: cleanName,
                        identifier: '',
                        thumbnail: image
                    });
                }
                resolve();
            };
            if (isImage) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolveFile(reader.result);
            }
            else {
                resolveFile();
            }
        })));
        setFiles(newFiles);
    });
    const handleNameChange = (ind, name) => {
        let newFiles = [...files];
        newFiles[ind] = Object.assign(Object.assign({}, newFiles[ind]), { name });
        setFiles(newFiles);
    };
    const handleFilenameChange = (ind, name) => {
        const cleanName = name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        let newFiles = [...files];
        newFiles[ind] = Object.assign(Object.assign({}, newFiles[ind]), { identifier: cleanName });
        setFiles(newFiles);
    };
    hooks_1.useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.key === 'Delete')
                handleRemoveFiles();
        };
        window.addEventListener('keyup', handleKeyUp);
        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [handleRemoveFiles]);
    const uploadItems = files.map((f, i) => <MediaUploadItem_1.default file={f} ind={i} key={f.file.name} editable={state === MediaUploadState.SELECTING} onNameChange={(name) => handleNameChange(i, name)} onFilenameChange={(filename) => handleFilenameChange(i, filename)}/>);
    return (<form class="MediaUploadForm" onSubmit={(e) => e.preventDefault()}>
			<div class={'MediaUploadForm-InputWrap' + (state !== MediaUploadState.SELECTING ? ' disabled' : '')}>
				<input type="file" multiple autoFocus class="MediaUploadForm-Input" onChange={handleAddFiles} disabled={state !== MediaUploadState.SELECTING}/>
				<h2>Click or drag files here to upload.</h2>
			</div>

			{files.length > 0 && <div class="MediaUploadForm-Toolbar">
				<div>
					{selected.length > 0 && <button class="MediaUploadForm-Toolbar-Button" onClick={handleRemoveFiles}>
						<img src="/admin/asset/icon/trash-dark.svg"/>
						<span>{selected.length === 1 ? 'Remove' : 'Remove (' + selected.length + ')'}</span>
					</button>}
				</div>
				<div>
					

					<button class="MediaUploadForm-Toolbar-Button" onClick={() => setGrid(!grid)}>
						<img src={`/admin/asset/icon/${grid ? 'grid' : 'list'}-view-dark.svg`}/>
					</button>
				</div>
			</div>}

			<DimensionTransition_1.default duration={150}>
				{state === MediaUploadState.SELECTING &&
            <SelectGroup_1.default class={'MediaUploadForm-Files ' + (grid ? 'Grid' : 'Stack')} selected={selected} setSelected={setSelected} multi={true}>
						{uploadItems}
					</SelectGroup_1.default>}

				{state === MediaUploadState.UPLOADING &&
            <div class={'MediaUploadForm-Files ' + (grid ? 'Grid' : 'Stack')}>
						{uploadItems}
					</div>}
			</DimensionTransition_1.default>

			<div class="MediaUploadForm-ActionBar">
				<div>
					<button onClick={handleClose} class="MediaUploadForm-ActionBar-Button" disabled={state === MediaUploadState.UPLOADING}>
						Cancel
					</button>
				</div>
				<div>
					{files.length > 0 && <button onClick={handleUpload} class="MediaUploadForm-ActionBar-Button Upload" disabled={state === MediaUploadState.UPLOADING}>
						{`Upload File${files.length > 1 ? 's' : ''}`}
					</button>}
				</div>
			</div>
		</form>);
}
exports.default = MediaUploadForm;
