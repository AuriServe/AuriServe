import { RefObject, h } from 'preact';
import { titleCase } from 'common';
import { Button, DimensionTransition, Field, Form, Icon, Svg, Tooltip, Transition, merge, tw } from 'dashboard';
import { useState, useEffect } from 'preact/hooks';
import { useEditorEventCallback } from '@nytimes/react-prosemirror';
import { Mark, MarkType, ResolvedPos } from 'prosemirror-model';
import { useStore } from 'vibin-hooks';

function markExtend($cursor: ResolvedPos, markType: MarkType) {
	let startIndex = $cursor.index();
	let endIndex = $cursor.indexAfter();

	const hasMark = (index: number) => markType.isInSet($cursor.parent.child(index).marks)

	while (startIndex > 0 && hasMark(startIndex - 1)) startIndex--;
	while (endIndex < $cursor.parent.childCount && hasMark(endIndex)) endIndex++

	let startPos = $cursor.start();
	let endPos = startPos

	for (let i = 0; i < endIndex; i++) {
		let size = $cursor.parent.child(i).nodeSize;
		if (i < startIndex) startPos += size;
		endPos += size;
	}

	return { from: startPos, to: endPos };
}

interface Props {
	show?: RefObject<(edit?: boolean) => void>;
}

export default function LinkEditorPopup(props: Props) {
	const editorPos = useStore<[ number, number ]>([ 0, 0 ]);
	const editorActive = useStore(false);
	const linkProps = useStore<{ href: string, newTab: boolean }>({ href: '', newTab: false });
	const editing = useStore(false);
	const markRange = useStore<{ to: number, from: number }>({ from: 0, to: 0 });

	const close = useEditorEventCallback((view) => {
		if (!editorActive()) return;
		editorActive(false);
		setTimeout(() => editing(false), 50);
		view?.focus();
	});

	const showEditor = useEditorEventCallback((view, evenIfSelection = false, edit: boolean = false) => {
		if (!view) return close();
		const { $from: from, $to: to } = view.state.selection;
		if (!evenIfSelection && from.pos !== to.pos) return close();


		let mark: Mark = undefined as any;
		for (const range of view.state.selection.ranges) {
			view.state.doc.nodesBetween(range.$from.pos, range.$to.pos + 1, (node) => {
				mark ??= node.marks.find(mark => mark.type.name === 'link') as Mark;
				if (mark) return false;
			});
		}

		if (!mark) return close();
		markRange(markExtend(view.state.selection.$from, view.state.schema.marks['link']));

		let tag = view.domAtPos(from.pos, 1).node.parentElement as HTMLElement;
		console.log(tag);
		if (!tag) return close();

		const { left, right, bottom } = tag.getBoundingClientRect();
		const x = left + (right - left) / 2 + window.scrollX;
		const y = bottom + window.scrollY;

		editing(edit);
		linkProps({ href: mark.attrs.href, newTab: mark.attrs.newTab });

		editorActive(true);
		editorPos((pos) => {
			if (pos && pos[0] === x && pos[1] === y) return pos;
			return [ x, y ];
		});
	});

	if (props.show) props.show.current = (edit?: boolean) => showEditor(true, edit);

	useEffect(() => {
		const ACTIVATE_DELAY = 180;
		let pendingActivateCheck = 0;

		const onMouseDown = () => {
			if (editorActive()) handleCommit();
			editorActive(false);
		}

		const onMouseUp = () => {
			clearTimeout(pendingActivateCheck);
			pendingActivateCheck = setTimeout(() => showEditor(), ACTIVATE_DELAY) as any;
		}
		const onKeyDown = () => {
			if (!linkProps()) close();
		}

		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('keydown', onKeyDown);
			clearTimeout(pendingActivateCheck)
		}
	}, [ showEditor ]);

	function handleCopy() {
		navigator.clipboard.writeText(linkProps().href);
	}

	const handleCommit = useEditorEventCallback((view, closeAfter = false) => {
			if (!view) return;
			if (!linkProps().href) {
				handleRemove();
			}
			else {
				let { from, to } = markRange();
				view.dispatch(view.state.tr.removeMark(from, to, view.state.schema.marks['link'])
					.addMark(from, to, view.state.schema.marks['link'].create(linkProps())));
			}
			if (closeAfter) close();
		});

	const handleUpdateLink = useEditorEventCallback((view, data: any) => {
		if (!view) return;
		linkProps(data);
	});

	const handleRemove = useEditorEventCallback((view) => {
		if (!view) return;
		let { from, to } = markRange();

		view.dispatch(view.state.tr.removeMark(from, to, view.state.schema.marks['link']));
		close();
	});

	return (
		<div
			class={tw`absolute w-max translate-y-4 -translate-x-1/2 ${!editorActive() && 'pointer-events-none'}`}
			disabled={!editorActive()}
			onMouseDown={(evt) => evt.stopPropagation()}
			onMouseUp={(evt) => evt.stopPropagation()}
			style={{ left: `${editorPos()[0]}px`, top: `${editorPos()[1]}px` }}>
			<div class={tw`relative ${editorActive() ? 'animate-rise-fade-in' : 'opacity-0'}
				transition duration-100 bg-gray-${editing() ? '750' : '700'}
					shadow-md rounded-lg flex gap-1 isolate justify-stretch
				before:(-z-10 content-[_] w-3 h-3 bg-white absolute top-[-0.3333rem]
					left-[calc(50%-0.3333rem)] rotate-45 bg-[color:inherit])`}
			>
				<DimensionTransition mode='height' duration={200}>
					{editing()
						? <Transition key='edit' as='div' initial show={true}
								class={tw`flex w-80 overflow-hidden rounded-lg`}
								enterFrom={tw`!opacity-0`} enter={tw`opacity-100 w-80 overflow-hidden
									rounded-lg transition-all duration-300`} invertExit>
								<Form class={tw`w-full`}
									initialValue={linkProps()}
									onChange={handleUpdateLink}
									onSubmit={(data: any) => (handleUpdateLink(data), handleCommit(true))}>
									<Field.Text path='href' label='Link Destination' autofocus optional placeholder='&nbsp;' class={{
										'': tw`w-full`,
										'highlight': tw`!opacity-0`,
										'text': tw`font-medium --input-background[rgb(var(--theme-gray-750))]
											--input-background-focus[rgb(var(--theme-gray-750))]`
									}}/>
									<Field.Toggle path='newTab' label='Open in New Tab' class={{
										'': tw`!border-0 !min-h-[48px]`,
										'background': tw`!bg-gray-700 !opacity-100`,
										'switch_track': tw`!bg-(gray-500/75 peer-checked:accent-400 peer-checked:peer-focus:accent-400)`
									}}/>
								</Form>
							</Transition>
						: <Transition key='display' as='div' initial show={true}
							class={tw`flex w-80 p-1.5`} enterFrom='opacity-0' enter='opacity-100 duration-100'>
								<p class={tw`p-0.5 pt-2 mt-px shrink overflow-hidden`}>
									{linkProps().href ?
										<Button.Link icon={Icon.external} label={linkProps().href}
											href={linkProps().href} target={linkProps().href.startsWith('#') ? '' : '_blank'} nowrap /> :
										<span class={tw`block -mt-1 text-gray-200 font-medium`}>(No Destination)</span>
									}
								</p>
								<div class={tw`grow`}/>
								<Button.Ghost size={8} onClick={handleCopy} class={tw`shrink-0 w-8 h-8 grid place-items-center`}>
									<Svg size={5} src={Icon.copy}/>
									<Tooltip position='bottom' delay={200} label='Copy' small/>
								</Button.Ghost>
								<Button.Ghost size={8} onClick={() => editing(true)} class={tw`shrink-0 w-8 h-8 grid place-items-center`}>
									<Svg size={5} src={Icon.edit}/>
									<Tooltip position='bottom' delay={200} label='Edit' small/>
								</Button.Ghost>
								<Button.Ghost size={8} onClick={handleRemove} class={tw`shrink-0 w-8 h-8 grid place-items-center`}>
									<Svg size={5} src={Icon.trash}/>
									<Tooltip position='bottom' delay={200} label='Remove' small/>
								</Button.Ghost>
							</Transition>}
				</DimensionTransition>
			</div>
		</div>
	);
}
