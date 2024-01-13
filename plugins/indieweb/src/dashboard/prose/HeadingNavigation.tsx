import { h } from 'preact';
import { tw } from 'dashboard';
import { TextSelection } from 'prosemirror-state';
import { useEffect, useState } from 'preact/hooks';
import { useEditorEffect, useEditorEventCallback } from '@nytimes/react-prosemirror';

type NavigationItem = {
	id: string;
	text: string;
	level: number;
	top: number;
	pos: number;
}

export default function HeadingNavigation() {
	const [ headings, setHeadings ] = useState<NavigationItem[]>([]);
	const [ highestHeadingLevel, setHighestHeadingLevel ] = useState(6);
	const [ nearestHeading, setNearestHeading ] = useState<number>(0);

	useEffect(() => {
		const DEBOUNCE_DURATION = 50;
		const SCROLLTOP_PADDING = 150;

		let timeout = 0;

		const onScroll = () => {
			timeout = 0;
			setHeadings(headings => {
				let heading = 0;
				for (let i = 0; i < headings.length; i++) {
					if (headings[i].top - SCROLLTOP_PADDING > window.scrollY) break;
					heading = i;
				}
				setNearestHeading(heading);
				return headings;
			});
		}

		const debounce = () => {
			if (timeout !== 0) return;
			onScroll();
			timeout = setTimeout(() => onScroll(), DEBOUNCE_DURATION) as any;
		}

		window.addEventListener('scroll', debounce, { passive: true });
		return () => window.removeEventListener('scroll', debounce);
	})

	const onClick = useEditorEventCallback((view, heading: NavigationItem) => {
		if (!view) return;
		history.replaceState(null, '', heading.id.length ? `#${heading.id}` : location.href.substring(0, location.href.indexOf('#')));
		view.focus();
		view.dispatch(view.state.tr.setSelection(new TextSelection(view.state.doc.resolve(heading.pos))));
		window.scrollTo({ top: heading.top - 24, behavior: 'smooth' });
	});

	useEditorEffect((view) => {
		if (!view) return;

		const headings: NavigationItem[] = [];
		let highestHeadingLevel = 100;

		function findElementID(dom: HTMLElement): string | null {
			if (dom.id) return dom.id;

			for (let i = 0; i < dom.children.length; i++) {
				let recursedId = findElementID(dom.children[i] as HTMLElement);
				if (recursedId) return recursedId;
			}

			return null;
		}

		view.state.doc.descendants((node, nodePos) => {
			if (node.type.name !== 'heading' && node.type.name !== 'title') return;
			const dom = view.nodeDOM(nodePos) as HTMLElement;
			if (!dom) return;
			let id = findElementID(dom) ?? '';
			if (!id && node.type.name !== 'title') return;
			const textNode = document.createNodeIterator(dom, NodeFilter.SHOW_TEXT).nextNode();
			if (!textNode && node.type.name !== 'title') return;
			const text = (textNode ? dom.innerText : 'Untitled').replace(/^\#* */g, '');
			const pos = textNode ? view.posAtDOM(textNode, 0, 1) : nodePos + 1;
			if (!text) return;
			const level = node.type.name === 'title' ? highestHeadingLevel : node.attrs.level;
			const top = node.type.name === 'title' ? 0 : dom.getBoundingClientRect().top + window.scrollY;
			headings.push({ id, text, level, top, pos });
			highestHeadingLevel = Math.min(highestHeadingLevel, level);
		});

		headings[0].level = highestHeadingLevel;

		setHeadings(existing => {
			if (JSON.stringify(existing) === JSON.stringify(headings)) return existing;
			return headings;
		});
		setHighestHeadingLevel(highestHeadingLevel)
	});

	return (
		<figure>
			<figcaption class={tw`text-(xs gray-300) font-bold leading-none
				ml-2 mb-1.5`}>
				Outline
			</figcaption>
			{headings.length > 0 ? <ol>
				{headings.map((heading, i) => {
					return (
						<li
							key={heading.id}
							class={tw`grid`}
						>
							<a
								href={`#${heading.id}`}
								onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); onClick(heading) }}
								class={tw`block text-gray-200/60 text-sm font-medium hover:text-gray-100 p-2 pb-1.5 hover:bg-gray-750
									rounded truncate text-ellipsis overflow-hidden transition-all duration-100
									ml-[${(heading.level - highestHeadingLevel) * 12}px]
									${nearestHeading === i && 'font-medium text-gray-200'}`}
							>
								{heading.text}
							</a>
						</li>
					);
				})}
			</ol> : <p class={tw`text-(gray-300 sm) italic p-2`}>
				When you add headings to this document, they will appear here.
			</p>}
		</figure>
	);
}
