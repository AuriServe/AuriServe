import { useContext } from 'preact/hooks';

import { RendererContext } from './Renderer';
import { ComponentContext } from './Component';

interface ActiveState {
	active: boolean;
	hovered: boolean;
	setActive: () => void;
}

export function useActiveState(): ActiveState {
	const { setActive } = useContext(RendererContext);
	const { path, active, hovered } = useContext(ComponentContext);
	
	return {
		active, hovered,
		setActive: setActive.bind(undefined, path)
	};
}
