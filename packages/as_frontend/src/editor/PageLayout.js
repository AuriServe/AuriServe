"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Preact = tslib_1.__importStar(require("preact"));
const compat_1 = require("preact/compat");
const hooks_1 = require("preact/hooks");
require("./PageLayout.sass");
function PageLayout(props) {
    const [layout, setLayout] = hooks_1.useState('');
    const [layoutRoots, setLayoutRoots] = hooks_1.useState(undefined);
    hooks_1.useEffect(() => {
        if (!props.layout)
            return;
        let set = true;
        (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const r = yield fetch('/admin/themes/layout/', {
                method: 'POST', cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ layout: props.layout })
            });
            const layout = yield r.text();
            if (r.status !== 200)
                return console.error(layout);
            else if (!set)
                return;
            setLayout(layout);
            setLayoutRoots(undefined);
        }))();
        return () => set = false;
    }, [props.layout]);
    hooks_1.useEffect(() => {
        if (!layout)
            return;
        let root = document.createElement('div');
        root.innerHTML = layout.trim().replace(/\<body/g, '<div').replace(/\<\/body/g, '</div');
        root = root.childNodes[0];
        const preClasses = document.body.className.split(' ');
        const classes = root.className.split(' ').filter(c => !preClasses.includes(c));
        let newLayoutRoots = {};
        root.querySelectorAll('[data-include]').forEach(e => {
            var _a;
            const section = (_a = e.getAttribute('data-include')) !== null && _a !== void 0 ? _a : '';
            e.removeAttribute('data-include');
            if (!props.elements[section])
                e.remove();
            else if (!newLayoutRoots[section])
                newLayoutRoots[section] = e;
        });
        const nodes = Array.from(root.childNodes);
        nodes.forEach(child => document.body.appendChild(child));
        classes.forEach(c => document.body.classList.add(c));
        console.warn('Rendering Layout');
        setLayoutRoots(newLayoutRoots);
        return () => {
            nodes.forEach(e => e.remove());
            classes.forEach(c => document.body.classList.remove(c));
        };
    }, [layout]);
    return (<Preact.Fragment>
			{!layoutRoots && <h1 class='PageLayout-Loading' style={{ position: 'absolute', top: '50vh', left: '50vw',
                transform: 'translate(-50%, -100%)', fontFamily: 'sans-serif', opacity: 0.2 }}>Loading Layout...</h1>}
				
			{layoutRoots && Object.keys(layoutRoots).map(section => {
            if (!props.elements[section])
                return undefined;
            return compat_1.createPortal(props.elements[section], layoutRoots[section]);
        })}
		</Preact.Fragment>);
}
exports.default = PageLayout;
