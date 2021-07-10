import * as Preact from 'preact';
import { useRef } from 'preact/hooks';
import { useActiveState } from 'editor/hooks';
import { ComponentArea } from 'editor/components';
import { AdminDefinition } from 'common/definition';

import { server, ColumnLayout, Props as ColumnLayoutProps, parseColumns, toCSSUnit } from '../ColumnLayout';

import './ColumnLayout.sss';

interface Props {
	props: ColumnLayoutProps;
	setProps: (props: ColumnLayoutProps) => void;
	children: Preact.ComponentChildren;
}

function EditColumnLayout({ props, children }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const { hovered, active } = useActiveState();

	const handleSlideColumn = (evt: any) => {
		const elem = evt.target;
		const startX = evt.clientX;

		const onMouseMove = (evt: any) => {
			const offset = evt.clientX - startX;
			elem.style.transform = `translateX(${offset}px)`;
		};

		const onMouseUp = () => {
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mousemove', onMouseMove);
			elem.style.transform = '';
		};

		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mousemove', onMouseMove);
	};

	const columns: Preact.VNode[] = [];
	for (let i = 0; i < (props.columns ?? '').split(':').length - 1; i++) {
		columns.push(<button class='EditColumnLayout-Column' onMouseDown={handleSlideColumn}
			style={{ width: props.gap ? toCSSUnit(props.gap - 12) : '8px' }}>
			<div class='EditColumnLayout-Divider'/>
		</button>);
	}

	const margin = Math.max(((ref.current?.children[0]?.clientWidth ?? 0) - (props.maxWidth ?? 0)) / 2 - 2, 0);

	return (
		<Preact.Fragment>
			<ColumnLayout ref={elem => ref.current = elem?.parentElement} {...props}>{children}</ColumnLayout>
			{(hovered || active) && <ComponentArea for={ref.current} active={active} indicator={true}>
				<div class='EditColumnLayout-Margin' style={{ width: margin }}/>
				<div class='EditColumnLayout-Margin Right' style={{ width: margin }}/>

				<div class={[ 'EditColumnLayout-Columns', active ? 'Active' : '' ].join(' ')}
					style={{
						maxWidth: props.maxWidth && toCSSUnit(props.maxWidth),
						gap: props.gap && toCSSUnit(props.gap),
						gridTemplateColumns: parseColumns(props.columns),
						alignItems: props.layoutChildren === 'start' ? 'flex-start' :
							props.layoutChildren === 'end' ? 'flex-end' : props.layoutChildren ?? 'stretch'
					}}
				>{columns}</div>
			</ComponentArea>}
		</Preact.Fragment>
	);
}

export const admin: AdminDefinition = {
	...server,
	editing: {
		focusRing: false,
		inlineEditor: EditColumnLayout
	}
};
