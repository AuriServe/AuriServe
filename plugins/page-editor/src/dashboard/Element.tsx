import { Node } from 'pages';
import { tw } from 'dashboard';
import { assert } from 'common';
import { h, createContext } from 'preact';
import { useRef, useContext } from 'preact/hooks';
import { elements, UndefinedElement } from 'elements';

// import ElementMenu from './ElementMenu';
import { EditorContext } from './Editor';
import getBoundingBox from './BoundingBox';

export interface ElementContextData {
	path: string;
	setProps(props: any): void;
}

export const ElementContext = createContext<ElementContextData>(null as any);

export interface Props {
	node: Node;
	path: string;
}

// interface InteractState {
// 	bounds: WHBox;
// 	clickPos: { top: number; left: number };
// }

export default function Element({ node, path }: Props) {
	const editor = useContext(EditorContext);

	assert('element' in node, 'Not an element node');
	const Elem = elements.get(node.element)?.component;

	const ctx = { path, setProps: (props: any) => console.warn(props) };

	const wrapperRef = useRef<HTMLDivElement>(null);

	// const [intState, setIntState] = useState<InteractState | null>(null);

	// const handleInteract = (evt: MouseEvent) => {
	// 	evt.preventDefault();
	// 	evt.stopPropagation();

	// 	// const offset = wrapperRef.current!.offsetP;

	// 	setIntState({
	// 		bounds: getBoundingBox(wrapperRef.current as HTMLElement),
	// 		clickPos: {
	// 			top: evt.clientY + window.scrollY,
	// 			left: evt.clientX + window.scrollX,
	// 		},
	// 	});
	// };

	// const handleInteractEnd = () => {
	// 	setIntState(null);
	// };

	if (!Elem) {
		return <UndefinedElement elem={node.element} />;
	}

	function handleClick(evt: Event) {
		console.log('hi!');
		evt.preventDefault();
		evt.stopPropagation();
		editor.focusElement(path, getBoundingBox(wrapperRef.current!));
	}

	function handleOver(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		editor.hoverElement(path, getBoundingBox(wrapperRef.current!));
	}

	function handleOut(evt: Event) {
		if (evt.target !== wrapperRef.current) return;
		evt.preventDefault();
		evt.stopPropagation();
		editor.unhoverElement(path);
	}

	return (
		<ElementContext.Provider value={ctx}>
			<div class={tw`ContextGrabber~(contents)`} ref={wrapperRef}
				onClick={handleClick} onMouseOver={handleOver} onMouseOut={handleOut}>
				{/*onContextMenu={handleInteract}>*/}
				<Elem {...(node.props as any)}>
					{(node.children ?? []).map((child, i) => (
						<Element key={i} node={child} path={`${path}.children[${i}]`} />
					))}
				</Elem>
			</div>
			{/* <ElementMenu
				path={path}
				onClose={handleInteractEnd}
				position={intState?.clickPos}
			/> */}
		</ElementContext.Provider>
	);
}
