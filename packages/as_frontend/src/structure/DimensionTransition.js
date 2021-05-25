"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("preact/hooks");
require("./DimensionTransition.sass");
function DimensionTransition(props) {
    const ref = hooks_1.useRef(null);
    const [dimensions, setDimensions] = hooks_1.useState({});
    hooks_1.useEffect(() => {
        const onChange = () => {
            const elem = ref.current;
            setDimensions({ x: elem.offsetWidth, y: elem.offsetHeight });
        };
        const observer = new MutationObserver(onChange);
        observer.observe(ref.current, { attributes: true, childList: true, subtree: true });
        window.requestAnimationFrame(() => onChange());
        return () => observer.disconnect();
    }, []);
    let appliedOuterStyles = {};
    if (props.mode !== 'height')
        appliedOuterStyles.width = dimensions === null || dimensions === void 0 ? void 0 : dimensions.x;
    if (props.mode !== 'width')
        appliedOuterStyles.height = dimensions === null || dimensions === void 0 ? void 0 : dimensions.y;
    let appliedInnerStyles = { width: 'min-content', height: 'min-content' };
    if (props.mode === 'height')
        appliedInnerStyles.width = 'auto';
    if (props.mode === 'width')
        appliedInnerStyles.height = 'auto';
    return <div className="DimensionTransition" style={Object.assign(appliedOuterStyles, props.style, {
            transition: `width ${(props.duration || 300) / 1000}s, height ${(props.duration || 300) / 1000}s`
        })}>
		<div className="DimensionTransition-Inner" style={appliedInnerStyles} ref={ref}>
			{props.children}
		</div>
	</div>;
}
exports.default = DimensionTransition;
