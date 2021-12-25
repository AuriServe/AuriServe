import { h } from 'preact';
import { useState } from 'preact/hooks';

import { Context, ContextData } from './Context';

interface Props {
	children: any | ((context: ContextData) => any);
}

function TileLayout(props: Props) {
	const [ editing, setEditing ] = useState(false);

	const handleSetEditing = (editing?: boolean) => {
		setEditing(last => editing ?? !last);
	};

	const data = {
		editing,
		setEditing: handleSetEditing
	};

	return (
		<Context.Provider value={data}>
			{typeof props.children === 'function' ? props.children(data) : props.children}
		</Context.Provider>
	);
}

import Grid from './Grid';
TileLayout.Grid = Grid;

import Tile from './Tile';
TileLayout.Tile = Tile;

export default TileLayout;

export { Context, ContextData } from './Context';
export { default as TileLayoutGrid } from './Grid';
