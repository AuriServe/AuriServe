import { useStore } from 'vibin-hooks';
import { useCallback, useRef } from 'preact/hooks';
import { EditorView } from 'prosemirror-view';
import { Fragment, h, RefObject } from 'preact';
import { TextSelection } from 'prosemirror-state';
import { Icon, Svg, tw, fuzzySearch } from 'dashboard';
import { closeAutocomplete } from 'prosemirror-autocomplete';
import { ActionKind, AutocompleteAction } from 'prosemirror-autocomplete';
import { NodeRange, ResolvedPos } from 'prosemirror-model';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import { useEditorEventCallback } from '@nytimes/react-prosemirror';

interface Props {
	onAction: RefObject<(action: AutocompleteAction) => boolean>;
}

interface Command {
	icon: string;
	title: string;
	description: string;
	aliases?: string[];
	action: (view: EditorView) => void;
}

function addNode(view: EditorView, node: string, attrs: Record<string, any> = {}, select = false) {
	const selection = view.state.selection.$anchor;
	const from = selection.before();
	const to = selection.pos;
	if (select) {
		view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, from))
			.replaceRangeWith(from, to, view.state.schema.nodes[node].create(attrs)));
	}
	else {
		view.dispatch(view.state.tr.replaceRangeWith(from, to, view.state.schema.nodes[node].create(attrs)));
	}
}

function changeBlockType(view: EditorView, node: string, attrs: Record<string, any> = {}, wrap = false) {
	const selection = view.state.selection.$anchor;
	const from = selection.before();
	const to = selection.after();

	if (wrap) {
		view.dispatch(view.state.tr.wrap(selection.blockRange()!, [ { type: view.state.schema.nodes[node], attrs } ]).deleteRange(from + 2, view.state.selection.$anchor.pos + 1))
	}
	else {
		view.dispatch(view.state.tr.setBlockType(from, to, view.state.schema.nodes[node], attrs).deleteRange(from + 1, view.state.selection.$anchor.pos));
	}
	setTimeout(() => closeAutocomplete(view));
}

function changeBlockToListType(view: EditorView, node: string) {
	const selection = view.state.selection.$anchor;
	const from = selection.before();

	view.dispatch(view.state.tr.wrap(selection.blockRange()!, [ { type: view.state.schema.nodes[node] }, { type: view.state.schema.nodes.list_item } ]).deleteRange(from + 3, view.state.selection.$anchor.pos + 2))
}

const SUGGEST_AMOUNT = 9;

const COMMANDS: Command[] = [
	{
		icon: Icon.image,
		title: 'Image',
		description: 'Add an image.',
		aliases: [ 'img' ],
		action: (view) => addNode(view, 'image', { src: 'https://placekitten.com/600/300' })
	},
	{
		icon: Icon.quote,
		title: 'Blockquote',
		aliases: [ 'quote' ],
		description: 'Add a blockquote.',
		action: (view) => changeBlockType(view, 'blockquote', {}, true)
	},
	{
		icon: Icon.remove,
		title: 'Divider',
		aliases: [ 'hr' ],
		description: 'Add a horizontal rule.',
		action: (view) => addNode(view, 'horizontal_rule')
	},
	{
		icon: Icon.heading_1,
		title: 'Heading 1',
		aliases: [ 'h1' ],
		description: 'Add a heading.',
		action: (view) => changeBlockType(view, 'heading', { level: 0 })
	},
	{
		icon: Icon.heading_2,
		title: 'Heading 2',
		aliases: [ 'h2' ],
		description: 'Add a sub-heading.',
		action: (view) => changeBlockType(view, 'heading', { level: 1 })
	},
	{
		icon: Icon.heading_3,
		title: 'Heading 3',
		aliases: [ 'h3' ],
		description: 'Add a sub-sub-heading.',
		action: (view) => changeBlockType(view, 'heading', { level: 2 })
	},
	{
		icon: Icon.code,
		title: 'Code Block',
		description: 'Add a block of code.',
		action: (view) => changeBlockType(view, 'codeblock')
	},
	{
		icon: Icon.ordered_list,
		title: 'Ordered List',
		aliases: [ 'ol' ],
		description: 'Add an ordered list.',
		action: (view) => changeBlockToListType(view, 'ordered_list')
	},
	{
		icon: Icon.unordered_list,
		title: 'Bulleted List',
		aliases: [ 'ul' ],
		description: 'Add an unordered list.',
		action: (view) => changeBlockToListType(view, 'bullet_list')
	},
	{
		icon: Icon.paragraph,
		title: 'Paragraph',
		aliases: [ 'p' ],
		description: 'Add a paragraph.',
		action: (view) => changeBlockType(view, 'paragraph')
	}
]

function toggleComment(view: EditorView) {
	let selectionRange = view.state.selection.$anchor.blockRange()!;
	let range = selectionRange;

	while (range.depth > 0) {
		if (range.depth === 1 && range.parent.type.name === 'comment') {
			const targetDepth = liftTarget(range);
			if (targetDepth == null) return;
			view.dispatch(view.state.tr.lift(range, targetDepth)
				.deleteRange(view.state.selection.$anchor.blockRange()!.$from.before(),
					view.state.selection.anchor - 1));
			return;
		}

		range = new NodeRange(view.state.doc.resolve(range.$from.pos - 1),
			view.state.doc.resolve(range.$to.pos + 1), range.depth - 1);
	}

	// let start = range.$from.pos - range.depth;
	// let end = range.$to.pos + range.depth;

	if (!findWrapping(range!, view.state.schema.nodes.comment)) return;
	// const childType = selection.blockRange()?.parent.child(selection.blockRange()?.startIndex!);
	// console.log(childType)

	// console.log(wrapping);
	view.dispatch(view.state.tr.wrap(range, [ { type: view.state.schema.nodes.comment } ])
		.deleteRange(view.state.selection.$anchor.blockRange()!.$from.before() + 2,
			view.state.selection.anchor + 1))

	// setTimeout(() => closeAutocomplete(view));
}

const GRID_VIEW_WIDTH = 3;
const COMMAND_PALETTE_APPEAR_DELAY = 150;

export default function SlashCommandPopup(props: Props) {
	const position = useStore<[ number, number ]>([ 0, 0 ]);
	const active = useStore(false);
	const index = useStore<number>(0);
	const query = useStore<string>('');
	const activeTimeout = useRef<number>(0);

	const commands = query() ? fuzzySearch(query(), COMMANDS, [ 'title', 'aliases' ], 0.4) :
		COMMANDS.slice(0, SUGGEST_AMOUNT);

	const handleActivate = useEditorEventCallback((view: EditorView | null, index: number) => {
		if (!view) return;
		let command = commands[index];
		command?.action?.(view);
		setTimeout(() => view.focus());
	});

	function setActive(newActive: boolean, now = false) {
		window.clearTimeout(activeTimeout.current);
		if (!newActive) active(false);
		else {
			if (now) active(true);
			else activeTimeout.current = setTimeout(() => active(true), COMMAND_PALETTE_APPEAR_DELAY) as any as number;
		}
	}

	props.onAction.current = useCallback((action: AutocompleteAction) => {
		switch (action.kind) {
			default:
				return false;
			case ActionKind.open: {
				const coords = action.view.coordsAtPos(action.range.from);
				setActive(true);
				position([ coords.left + window.scrollX - 56, coords.top + window.scrollY ]);
				index(0);
				query('');
				return true;
			}
			case ActionKind.filter: {
				index(0);
				if (action.filter === '/') {
					toggleComment(action.view);
					return false;
				}
				else {
					if (!active()) setActive(true, true);
				}

				if (action.filter?.endsWith(' ')) {
					closeAutocomplete(action.view);
					return false;
				}
				query(action.filter ?? '');
				return true;
			}
			case ActionKind.close: {
				setActive(false);
				return true;
			}
			case ActionKind.enter: {
				setActive(false);
				let command = commands[index()];
				command?.action?.(action.view);
				return true;
			}
			case ActionKind.down: {
				const newIndex = index() + (query() ? 1 : GRID_VIEW_WIDTH);
				if (newIndex >= commands.length) return false;
				index(newIndex);
				return true;
			}
			case ActionKind.up: {
				const newIndex = index() - (query() ? 1 : GRID_VIEW_WIDTH);
				if (newIndex < 0) return false;
				index(newIndex);
				return true;
			}
			case ActionKind.left: {
				if (query()) return false;
				let x = index() % GRID_VIEW_WIDTH;
				if (x == 0) return closeAutocomplete(action.view);
				index(index() - 1);
				return true;
			}
			case ActionKind.right: {
				if (query()) return false;
				let x = index() % GRID_VIEW_WIDTH;
				if (x == GRID_VIEW_WIDTH - 1) return false;
				index(index() + 1);
				return true;
			}
		}
	}, [ commands ]);

	const gridView = query().length === 0;

	return (
		<div
			class={tw`absolute w-max -translate-x-3 translate-y-10 ${!active() && 'pointer-events-none'}`}
			disabled={!active()}
			onMouseDown={(evt) => (evt.stopPropagation(), evt.preventDefault())}
			onMouseUp={(evt) => (evt.stopPropagation(), evt.preventDefault())}
			style={{ left: `${position()[0]}px`, top: `${position()[1]}px` }}>
			<div class={tw`relative ${active() ? 'animate-rise-fade-in' : 'opacity-0'}
				transition duration-100 bg-gray-750 shadow-lg rounded-lg isolate w-72 group
				before:(-z-10 content-[_] w-3 h-3 bg-white absolute top-[-0.3333rem]
					left-[calc(1rem-0.3333rem)] rotate-45 bg-[color:inherit])
				${gridView ? 'grid-(& cols-3) p-2' : 'flex-(& col) p-1.5'}
			`}>
				{commands.length > 0 ?
					<Fragment>
						{commands.map((c, i) => (
							<button
								key={`${c.title}_${i}`}
								type='button'
								onClick={() => handleActivate(i)}
								class={tw`flex ${gridView ? 'flex-col gap-2 items-center p-3 px-1 pb-2' : 'gap-4 p-2'}
									w-full text-left rounded-md
									!outline-none hover:!bg-gray-600/40 active:!bg-gray-600/60
									${index() === i && 'bg-gray-600/40 group-hover:bg-gray-600/20'}`}>
								<Svg
									class={tw`${gridView ? 'w-7 h-7' : 'w-6 h-6'} rounded bg-gray-(${index() === i ? 600 : 700}) p-2`}
									src={c.icon}
								/>
								<div class={tw`flex flex-col self-center overflow-hidden max-w-full`}>
									<p class={tw`truncate leading-5 font-semibold max-w-full text-sm
										${gridView && 'text-([13px] center gray-200/75)'}`}>{c.title}</p>
									{!gridView && c.description && (
										<p class={tw`truncate leading-5 text-gray-200 text-[13px]`}>
											{c.description}
										</p>
									)}
								</div>
							</button>
						))}
					</Fragment> :
					<Fragment>
						<div class={tw`overflow-hidden`}>
							<p class={tw`text-gray-300 mt-px -mb-px text-center py-3.5`}>No results found.</p>
						</div>
					</Fragment>
				}
			</div>
		</div>
	);
}
