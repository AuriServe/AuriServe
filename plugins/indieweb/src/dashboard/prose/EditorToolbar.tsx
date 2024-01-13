import { h } from 'preact';
import { titleCase } from 'common';
import { Icon, Svg, Tooltip, merge, tw } from 'dashboard';
import { useState, useRef, useEffect } from 'preact/hooks';
import { useEditorEffect, useEditorEventCallback } from '@nytimes/react-prosemirror';

import TextStyle from './TextStyle';
import { TextSelection } from 'prosemirror-state';

interface Props {
	styles: TextStyle[];
	showLinkEditor?: () => void;
}

export default function EditorToolbar({ styles, showLinkEditor }: Props) {
	const [ editorPos, setEditorPos ] = useState<[ number, number ]>([ 0, 0 ]);
	const [ editorActive, setEditorActive ] = useState(false);
	const [ activeMarks, setActiveMarks ] = useState<boolean[]>([]);

	const renderStyles = [ ...styles ].sort((a, b) => {
		if (a.baseTag !== b.baseTag) return a.baseTag.localeCompare(b.baseTag);
		return (a.label || a.class).localeCompare((b.label || b.class));
	});

	const computeActiveMarks = useEditorEventCallback((view) => {
		if (!view) return;
		setActiveMarks(activeMarks => {
			const newActiveMarks = new Array(renderStyles.length).fill(false).map((_, i) => {
				const mark = view.state.schema.marks[renderStyles[i].baseTag].create({ class: renderStyles[i].class ?? '' });
				for (const range of view.state.selection.ranges) {
					if (view.state.doc.rangeHasMark(range.$from.pos, range.$to.pos, mark)) return true;
				}
				return false;
			});

			if (JSON.stringify(activeMarks) === JSON.stringify(newActiveMarks)) return activeMarks;
			return newActiveMarks;
		});
	});

	const maybeActivateEditor = useEditorEventCallback((view) => {
		if (!view) return;
		const { $from: from, $to: to } = view.state.selection;
		if (from.pos === to.pos) return setEditorActive(false);

		const { left: startLeft, bottom: startBottom, right: startRight } = view.coordsAtPos(from.pos);
		const { left: endLeft, bottom: endBottom, right: endRight } = view.coordsAtPos(to.pos);

		const left = Math.floor(Math.min(startLeft, endLeft, startRight, endRight));
		const right = Math.floor(Math.max(startLeft, endLeft, startRight, endRight));
		const x = Math.floor(left + (right - left) / 2) + window.scrollX;
		const y = Math.floor(Math.max(startBottom, endBottom)) + window.scrollY;

		setEditorActive(true);
		setEditorPos((pos) => {
			if (pos && pos[0] === x && pos[1] === y) return pos;
			return [ x, y ];
		});
		computeActiveMarks();
	});

	useEffect(() => {
		const ACTIVATE_DELAY = 180;
		let pendingActivateCheck = 0;

		const onMouseDown = () => setEditorActive(false);
		const onMouseUp = () => {
			clearTimeout(pendingActivateCheck);
			pendingActivateCheck = setTimeout(() => maybeActivateEditor(), ACTIVATE_DELAY) as any;
		}
		const onKeyDown = () => setEditorActive(false);

		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('keydown', onKeyDown);
			clearTimeout(pendingActivateCheck)
		}
	}, [ maybeActivateEditor ]);

	const handleToggleMark = useEditorEventCallback((view, style: TextStyle) => {
		if (!view) return;
		const { from, to, ranges } = view.state.selection;

		const mark = view.state.schema.marks[style.baseTag].create({ class: style.class ?? '' });
		const hasMark = ranges.some(range => view.state.doc.rangeHasMark(range.$from.pos, range.$to.pos, mark));

		if (hasMark) view.dispatch(view.state.tr.removeMark(from, to, mark));
		else view.dispatch(view.state.tr.addMark(from, to, mark));

		setTimeout(() => computeActiveMarks());
	});

	const handleToggleLink = useEditorEventCallback((view) => {
		if (!view) return;
		const { from, to, ranges } = view.state.selection;

		const mark = view.state.schema.marks['link'].create({ href: '', newTab: false });
		const hasMark = ranges.some(range => view.state.doc.rangeHasMark(range.$from.pos, range.$to.pos, mark.type));

		if (hasMark) view.dispatch(view.state.tr.removeMark(from, to, mark.type));
		else {
			view.dispatch(view.state.tr.addMark(from, to, mark));
			setTimeout(() => showLinkEditor?.());
		}
	});

	const handleClearFormatting = useEditorEventCallback((view) => {
		if (!view) return;
		const { from, to } = view.state.selection;
		view.dispatch(view.state.tr.removeMark(from, to));
		setTimeout(() => computeActiveMarks());
	});

	return (
		<div
			class={tw`absolute w-max -translate-x-1/2 translate-y-4 ${!editorActive && 'pointer-events-none'}`}
			disabled={!editorActive}
			onMouseDown={(evt) => evt.stopPropagation()}
			onMouseUp={(evt) => evt.stopPropagation()}
			style={{ left: `${editorPos[0]}px`, top: `${editorPos[1]}px` }}>
			<div class={tw`relative ${editorActive ? 'animate-rise-fade-in' : 'opacity-0'}
				transition duration-100 p-1.5 bg-gray-700 shadow-md rounded-lg flex gap-1 isolate justify-stretch
				before:(-z-10 content-[_] w-3 h-3 bg-white absolute top-[-0.3333rem]
					left-[calc(50%-0.3333rem)] rotate-45 bg-[color:inherit])`}
			>
				<button
					onClick={() => handleClearFormatting()}
					class={merge(
						'tooltip_style_preview',
						// !activeMarks.some(v => v) && 'active',
						tw`StylePreview~(block text-lg text-gray-200 leading-none grid place-items-center
							hover:bg-gray-input active:bg-gray-750
							w-9 h-9 overflow-hidden aspect-square rounded-md)`)}>
					<Tooltip position='bottom' small label='Reset Formatting' delay={200}/>
					<Svg src={Icon.theme} class={tw`icon-s-gray-200`} size={6}/>
				</button>

				<hr class={tw`border-0 my-1 border-r-(1 gray-400) h-auto w-0`}/>

				{renderStyles.map((s, i) => {
					const Tag = s.baseTag;
					return (
						<button key={`${s.baseTag}.${s.class}`}
							onClick={() => handleToggleMark(s)}
							class={merge(
								'tooltip_style_preview',
								activeMarks[i] && 'active',
								tw`StylePreview~(block text-lg text-gray-200 leading-none
									hover:bg-gray-input active:bg-gray-750
									w-9 h-9 overflow-hidden aspect-square rounded-md)`)}>
							<Tooltip position='bottom' small label={s.label || titleCase(s.class || s.baseTag)} delay={200}/>
							<Tag class={s.class}>
								<span>A</span>
								<span>a</span>
							</Tag>
						</button>
					)
				})}

				<hr class={tw`border-0 my-1 border-r-(1 gray-400) h-auto w-0`}/>

				<button
					onClick={handleToggleLink}
					class={merge(
						'tooltip_style_preview', /*'active',*/
						tw`InlineFormat~(block text-lg text-gray-200 leading-none grid place-items-center
							hover:bg-gray-input active:bg-gray-750
							w-9 h-9 overflow-hidden aspect-square rounded-md)`)}>
					<Tooltip position='bottom' small label='Link' delay={200}/>
					<Svg src={Icon.link} class={tw`icon-s-gray-200`} size={6}/>
				</button>

				{/* <button
					class={merge(
						'tooltip_style_preview',
						tw`InlineFormat~(block text-lg text-gray-200 leading-none grid place-items-center
							w-9 h-9 overflow-hidden aspect-square rounded-md)`)}>
					<Tooltip position='bottom' small label='Link' delay={200}/>
					<Svg src={Icon.link} size={6}/>
				</button> */}

			</div>
		</div>
	);
}
