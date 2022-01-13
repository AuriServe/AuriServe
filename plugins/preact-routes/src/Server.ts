import as from 'auriserve';
import { ComponentChildren, ComponentClass, FunctionalComponent } from 'preact';

export interface Element {
	identifier: string;
	component: ComponentClass | FunctionalComponent;
}

declare global {
	export interface AuriServeAPI {
		preactRoutes: {
			elements: Map<string, Element>;
			renderElements: (layout: any) => string;
		};
	}
}

const {
	preact: { h },
	renderToString,
} = as.preact;

function renderRecursive(elem: any) {
	const children = elem.children
		? elem.children.map((child: any) => renderRecursive(child))
		: [];
	const component = as.preactRoutes.elements.get(elem.element)?.component;
	return h(component!, elem.props ?? {}, children);
}

function renderElements(layout: any) {
	return renderToString(renderRecursive(layout));
}

as.preactRoutes = {
	elements: new Map([
		[
			'DivElement',
			{
				identifier: 'DivElement',
				component: (({ children }: { children: ComponentChildren }) =>
					h('div', null, children)) as FunctionalComponent,
			},
		],
		[
			'TextElement',
			{
				identifier: 'TextElement',
				component: (({ content }: { content: string }) =>
					h('div', {
						className: 'text',
						dangerouslySetInnerHTML: { __html: content },
					})) as FunctionalComponent,
			},
		],
	]),
	renderElements,
};

const pageLayout = {
	element: 'DivElement',
	children: [
		{
			element: 'TextElement',
			props: {
				content: '<h1>Hello World</h1>',
			},
		},
		{
			element: 'TextElement',
			props: {
				content: '<p>Hey babe</p>',
			},
		},
	],
};

console.log(as.preactRoutes.renderElements(pageLayout));

as.core.on('cleanup', () => {
	as.unexport('preactRoutes');
});
