import { h } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import type { BaseClientFieldProps, BaseClientLayoutProps } from '../../Type';

export interface SelectFieldProps extends BaseClientFieldProps {
	type: 'select';
	default?: string;
	multiple?: boolean;
	options: { label: string, id: string, shortName?: string }[];
};

export interface SelectLayoutProps extends BaseClientLayoutProps {
	display?: 'radio';
	hide_label?: boolean;
};

type SpecializationProps = { layout: SelectLayoutProps, field: SelectFieldProps };

/**
 * Renders a list of checkboxes for each option in the select field.
 * If client-side scripting is enabled, will validate that at least one checkbox is selected.
 */

function MultiRadioSelectField({ layout, field }: SpecializationProps) {
	const required = field.constraints?.required ?? true;
	const checkboxes = useRef<(HTMLInputElement | null)[]>([]);

	const updateValidity = useCallback(() => {
		if (!required) return;
		const anySelected = checkboxes.current!.some((checkbox) => checkbox!.checked);
		const elem = checkboxes.current[0];
		if (!elem) return;
		if (anySelected) elem.setCustomValidity('');
		else elem.setCustomValidity('Please select at least one option.');
	}, [ required ]);

	useEffect(updateValidity, [ updateValidity ]);

	return (
		<div class='forms:form-field select radio multi'>
			<input type='hidden' name={field.id} value='#radio_multi#' />
			<label class={(layout as any).hide_label ? 'hidden' : ''}>{field.label}</label>
			{field.description && <p class='description'>{field.description}</p>}
			<div class='options'>
				{field.options.map((option, ind) => (
					<div key={option.id} class='option'>
						<label for={`${field.id}#${option.id}`}>{option.label}</label>
						<input
							ref={(elem) => checkboxes.current![ind] = elem}
							onChange={updateValidity}
							type='checkbox'
							id={`${field.id}#${option.id}`}
							name={`${field.id}#${option.id}`}
							checked={field.default?.split(',')?.includes(option.id) ?? false}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Renders a list of radio buttons for each option in the select field.
 */

function RadioSelectField({ layout, field }: SpecializationProps) {
	const required = field.constraints?.required ?? true;

	return (
		<div class='forms:form-field select radio'>
			<label class={(layout as any).hide_label ? 'hidden' : ''}>{field.label}</label>
			{field.description && <p class='description'>{field.description}</p>}
			<div class='options'>
				{field.options.map((option, ind) => (
					<div key={option.id} class='option'>
						<label for={`${field.id}#${option.id}`}>{option.label}</label>
						<input
							type='radio'
							id={`${field.id}#${option.id}`}
							name={field.id}
							value={option.id}
							checked={field.default === option.id}
							required={required && ind === 0}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default function SelectField({ layout, field }: { layout: SelectLayoutProps, field: SelectFieldProps }) {
	if ((layout as any).display === 'radio') {
		if (field.multiple) return <MultiRadioSelectField layout={layout} field={field}/>;
		return <RadioSelectField layout={layout} field={field}/>;
	}

	return (
		<div class='forms:form-field select'>
			<label for={field.id}>{field.label}</label>
			<select
				id={field.id}
				name={field.id}
				defaultValue={field.default ?? undefined}
				required={field.constraints?.required ?? true}
				multiple={field.multiple ?? false}
			>
				{field.options.map(option => (
					<option key={option.id} value={option.id}>{option.label}</option>
				))}
			</select>
		</div>
	);
}
