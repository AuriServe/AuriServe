import * as Preact from 'preact';
import { useState, useRef, useContext } from 'preact/hooks';

import FocusRing from './FocusRing';

import { RendererContext } from './Renderer';


interface ComponentContextData {
	/** The path of the current component. */
	path: string;

	/** Whether or not the current component is active. */
	active: boolean;
	
	/** Whether or not the current component is hovered. */
	hovered: boolean;
}


/**
 * A context wrapped around each component element, contains info
 * needed for the component hooks, which use `useContext`
 * under the hood to retrieve information.
 */

const ComponentContext = Preact.createContext<ComponentContextData>({
	path: '',
	active: false,
	hovered: false
});


interface Props {
	/** The component's path in the document. */
	path: string;
	
	/** The component to render. */
	component: any;

	/** The component's props. */
	props: any;

	/** True if the props should be directly spread onto the element instead of in the props key. */
	spreadProps?: boolean;

	/** Function to be called by the component when its props should be changed. */
	setProps?: (props: any) => void;

	/** Function to be called when the component is clicked. */
	onClick?: () => void;

	/** Rendered children for the component. */
	children: Preact.ComponentChildren;
}


/**
 * A wrapper function that stops an event's default action and propagation,
 * and then calls the provided callback with it.
 *
 * @param cb - The callback to call with the event.
 */

const cancel = (cb: (evt: any) => void) => {
	return (evt: any) => {
		evt.preventDefault();
		evt.stopPropagation();
		cb(evt);
	};
};


/**
 * Renders a component for the EditorRenderer,
 * wrapping it in a context object and managing the active state.
 */

export default function Component(props: Props) {
	const timeout = useRef<number>(0);
	const ref = useRef<HTMLButtonElement>(null);
	const ctx = useContext(RendererContext);
	const [ hovered, setHovered ] = useState<boolean>(false);

	const handleMouseOver = cancel(() => {
		window.clearTimeout(timeout.current);
		setHovered(true);
	});

	const handleMouseOut = cancel(() => timeout.current = window.setTimeout(() => setHovered(false), 16));

	const handleClick = cancel(() => props.onClick?.());

	const active = ctx.active === props.path;

	const Component = props.component;

	const componentProps = Object.assign({}, props.spreadProps ? props.props : {}, {
		props: props.spreadProps ? undefined : props.props,
		setProps: props.setProps,
		children: props.children
	});

	return (
		<button ref={ref} style={{ textAlign: 'unset', display: 'contents', cursor: 'pointer' }}
			onClick={handleClick}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}>
			<ComponentContext.Provider value={{ path: props.path, active, hovered }}>
				<Component {...componentProps}/>
				{(hovered || active) && <FocusRing for={ref.current!} active={active}/>}
			</ComponentContext.Provider>
		</button>
	);
}
