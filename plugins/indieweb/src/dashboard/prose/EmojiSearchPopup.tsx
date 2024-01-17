import { useStore } from 'vibin-hooks';
import { useCallback, useMemo, useRef } from 'preact/hooks';
import { EditorView } from 'prosemirror-view';
import { Fragment, h, RefObject } from 'preact';
import { TextSelection } from 'prosemirror-state';
import { Icon, Svg, tw, fuzzySearch } from 'dashboard';
import { FromTo, closeAutocomplete } from 'prosemirror-autocomplete';
import { ActionKind, AutocompleteAction } from 'prosemirror-autocomplete';
import { NodeRange, ResolvedPos } from 'prosemirror-model';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import { useEditorEventCallback } from '@nytimes/react-prosemirror';
import emoji_data from 'unicode-emoji-json';

let ALL_EMOJI: { emoji: string, name: string }[] = [];

interface Props {
	onAction: RefObject<(action: AutocompleteAction) => boolean>;
}

const SUGGEST_AMOUNT = 5;
const MIN_LENGTH = 2;

function searchEmoji(query: string): { emoji: string, name: string }[] {
	if (!ALL_EMOJI.length) {
		ALL_EMOJI = Object.entries(emoji_data).map(
			([ emoji, { slug: name }]: [ string, any ]) => ({ name, emoji }));
		ALL_EMOJI.push({ emoji: '❤️', name: 'heart' });
	}

	return fuzzySearch(query, ALL_EMOJI, [ 'name' ], 0.25).slice(0, SUGGEST_AMOUNT);
}

export default function EmojiSearchPopup(props: Props) {
	const position = useStore<[ number, number ]>([ 0, 0 ]);
	const index = useStore<number>(0);
	const query = useStore<string>('');

	const results: { emoji: string, name: string }[] = useMemo(() =>
		query().length >= MIN_LENGTH ? searchEmoji(query()) : [], [ query() ]);

	const handleClick = useEditorEventCallback((view: EditorView | null, index: number) => {
		if (!view) return;
		const from = view.state.selection.$anchor.pos - query().length - 1;
		const to = view.state.selection.$anchor.pos;
		setEmoji(view, { from, to }, results[index].emoji);
		query('');
		setTimeout(() => view.focus());
	});

	function setEmoji(view: EditorView, range: FromTo, emoji: string) {
		view.dispatch(view.state.tr.replaceWith(range.from, range.to, view.state.schema.text(emoji + ' ')));
	}

	function handleExplicitEnd(view: EditorView, range: FromTo) {
		closeAutocomplete(view);
		if (results[0].name !== query()) return;
		const emoji = results[0].emoji;
		setEmoji(view, range, emoji);
	}

	props.onAction.current = useCallback((action: AutocompleteAction) => {
		switch (action.kind) {
			default:
				return false;
			case ActionKind.open: {
				const coords = action.view.coordsAtPos(action.range.from);
				position([ coords.left + window.scrollX - 56, coords.top + window.scrollY ]);
				index(0);
				query('');
				return true;
			}
			case ActionKind.filter: {
				index(0);

				if (action.filter?.endsWith(':')) {
					handleExplicitEnd(action.view, action.range);
					return false;
				}

				if (action.filter?.endsWith(' ')) {
					closeAutocomplete(action.view);
					return false;
				}

				query(action.filter ?? '');
				return true;
			}
			case ActionKind.close: {
				query('');
				return true;
			}
			case ActionKind.enter: {
				query('');
				if (results[index()]) setEmoji(action.view, action.range, results[index()].emoji);
				else closeAutocomplete(action.view);
				return true;
			}
			case ActionKind.down: {
				const newIndex = index() + 1;
				if (newIndex >= results.length) return false;
				index(newIndex);
				return true;
			}
			case ActionKind.up: {
				const newIndex = index() - 1;
				if (newIndex < 0) return false;
				index(newIndex);
				return true;
			}
		}
	}, [ results ]);

	return (
		<div
			class={tw`absolute w-max -translate-x-3 translate-y-8 ${!(results.length > 0) && 'pointer-events-none'}`}
			disabled={!(results.length > 0)}
			onMouseDown={(evt) => (evt.stopPropagation(), evt.preventDefault())}
			onMouseUp={(evt) => (evt.stopPropagation(), evt.preventDefault())}
			style={{ left: `${position()[0]}px`, top: `${position()[1]}px` }}>
			<div class={tw`relative ${(results.length > 0) ? 'animate-rise-fade-in' : 'opacity-0'}
				transition duration-100 bg-gray-750 shadow-lg rounded-lg isolate w-72 group p-2
				before:(-z-10 content-[_] w-3 h-3 bg-white absolute top-[-0.3333rem]
					left-[calc(1rem-0.3333rem)] rotate-45 bg-[color:inherit])
			`}>
				{results.length > 0 ?
					<Fragment>
						{results.map((c, i) => (
							<button
								key={`${c.emoji}_${i}`}
								type='button'
								onClick={() => handleClick(i)}
								class={tw`flex items-center gap-2 p-2 w-full text-left rounded-md
									!outline-none hover:!bg-gray-600/40 active:!bg-gray-600/60
									${index() === i && 'bg-gray-600/40 group-hover:bg-gray-600/20'}`}>
								<p class={tw`truncate leading-5 max-w-full`}>{c.emoji}</p>
								<p class={tw`truncate leading-5 text-(gray-200 sm) font-medium`}>:{c.name}:</p>
							</button>
						))}
					</Fragment> :
					<Fragment>
						<div class={tw`h-4`}/>
					</Fragment>
				}
			</div>
		</div>
	);
}
