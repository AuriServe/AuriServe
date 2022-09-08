import { Node } from 'pages';
import { tw } from 'dashboard';
import { assert } from 'common';
import { h, createContext } from 'preact';
import { elements, UndefinedElement } from 'elements';
import { useRef, useContext, useCallback } from 'preact/hooks';

import { useEditor } from './Editor';

export interface ElementContextData {
	hovered: boolean;
	focused: boolean;
	path: string;
	setProps(props: any): void;
}

export const ElementContext = createContext<ElementContextData>(null as any);

export function useElement() {
	return useContext(ElementContext);
}

export interface Props {
	node: Node;
	path: string;
}

export default function Element({ node, path }: Props) {
	const editor = useEditor();

	assert('element' in node, 'Not an element node');
	const Elem = elements.get(node.element)?.component;

	const editorSetProps = editor.setProps;
	const setProps = useCallback((props: any) => editorSetProps(path, props), [ path, editorSetProps ]);

	const ctx = {
		path,
		hovered: editor.hovered === path,
		focused: editor.focused === path,
		setProps
	};

	const wrapperRef = useRef<HTMLDivElement>(null);

	if (!Elem) {
		return <UndefinedElement elem={node.element} />;
	}

	function handleClick(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		editor.focusElement(path);
	}

	function handleOver(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		editor.hoverElement(path);
	}

	function handleOut(evt: Event) {
		if (evt.target !== wrapperRef.current) return;
		evt.preventDefault();
		evt.stopPropagation();
		editor.unhoverElement(path);
	}

	function handleContextMenu(evt: MouseEvent) {
		console.log('ctx menu :sparkles:');
		evt.preventDefault();
		evt.stopPropagation();
		editor.focusElement(path);
		editor.openElementMenu(path, evt.clientX + window.scrollX, evt.clientY + window.scrollY);
	}

	return (
		<ElementContext.Provider value={ctx}>
			<div class={tw`dash_elem_container A~(contents)`} ref={wrapperRef} id={path}
				onClick={handleClick} onMouseOver={handleOver} onMouseOut={handleOut} onContextMenu={handleContextMenu}>
				<Elem {...(node.props as any)}>
					{(node.children ?? []).map((child, i) => (
						<Element key={i} node={child} path={`${path}.children[${i}]`} />
					))}
				</Elem>
			</div>
		</ElementContext.Provider>
	);
}
