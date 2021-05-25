export interface WidgetProps {
	value: any;
	setValue: (newValue: any) => any;

	disabled?: boolean;
	placeholder?: string;

	onFocusChange?: (focus: boolean) => any;

	style?: any;
	class?: string;
}

export { default as Label } from './InputLabel';
export { default as Divider } from './InputDivider';
export { default as Annotation } from './InputAnnotation';

export { default as Text } from './fields/InputText';
export { default as Media } from './fields/InputMedia';
export { default as Color } from './fields/InputColor';
export { default as Select } from './fields/InputSelect';
export { default as Numeric } from './fields/InputNumeric';
export { default as Checkbox } from './fields/InputCheckbox';
export { default as DateTime } from './fields/InputDateTime';
