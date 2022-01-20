import { useRef } from 'preact/hooks';
import { AdminDefinition, EditProps } from 'plugin-api';
import { h, Fragment, ComponentChildren } from 'preact';

import { merge } from 'common/util';
import { useActiveState } from 'editor/hooks';
import { ComponentArea } from 'editor/components';

import { server, ColumnLayout, Props, parseColumns, toCSSUnit } from '../ColumnLayout';

import './ColumnLayout.sss';

function EditColumnLayout({ props }: EditProps<Props>) {
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

	const columns: ComponentChildren[] = [];
	for (let i = 0; i < (props.columns ?? '').split(':').length - 1; i++) {
		columns.push(<button class='EditColumnLayout-Column' onMouseDown={handleSlideColumn}
			style={{ width: props.gap ? toCSSUnit(props.gap - 12) : '8px' }}>
			<div class='EditColumnLayout-Divider'/>
		</button>);
	}

	const margin = Math.max(((ref.current?.children[0]?.clientWidth ?? 0) - (props.maxWidth ?? 0)) / 2 - 2, 0);

	return (<Fragment>
		<ColumnLayout ref={elem => ref.current = elem?.parentElement} {...props}>{props.children}</ColumnLayout>
		{(hovered || active) && <ComponentArea for={ref.current} active={active} indicator={true}>
			<div class='EditColumnLayout-Margin' style={{ width: margin }}/>
			<div class='EditColumnLayout-Margin Right' style={{ width: margin }}/>

			<div class={merge('EditColumnLayout-Columns', 'Active')}
				style={{
					maxWidth: props.maxWidth && toCSSUnit(props.maxWidth),
					gap: props.gap && toCSSUnit(props.gap),
					gridTemplateColumns: parseColumns(props.columns),
					alignItems: props.layoutChildren === 'start' ? 'flex-start'	:
					props.layoutChildren === 'end' ? 'flex-end' : props.layoutChildren ?? 'stretch'
				}}
			>{columns}</div>
		</ComponentArea>}
	</Fragment>);
}

export const admin: AdminDefinition = {
	...server,
	editing: {
		focusRing: false,
		inlineEditor: EditColumnLayout
	}
};
