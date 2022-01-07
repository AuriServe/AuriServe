import { useContext } from 'preact/hooks';

import { ComponentContext } from './Component';
import { RendererContext } from '../pages/EditorRendererPage';

interface ActiveState {
	active: boolean;
	hovered: boolean;
	setActive: () => void;
}

export function useActiveState(): ActiveState {
	const { setActive } = useContext(RendererContext);
	const { path, active, hovered } = useContext(ComponentContext);

	return {
		active,
		hovered,
		setActive: setActive.bind(undefined, path),
	};
}
