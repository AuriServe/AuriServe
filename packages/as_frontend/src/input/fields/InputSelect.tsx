import * as Preact from 'preact';
import { forwardRef } from 'preact/compat';
import { useState, useRef } from 'preact/hooks';

import { Format } from 'as_common';

import './InputSelect.sass';

import Popup from '../../structure/Popup';
import { WidgetProps } from '../Input';
import SearchableOptionPicker from '../SearchableOptionPicker';


interface Props extends WidgetProps {
	options: { [value: string]: string };
	multi?: boolean;
}

/**
 * A select / multiselect widget.
 */

const InputSelect = forwardRef<HTMLDivElement, Props>((props, fRef) => {

	const wrapRef = useRef<HTMLDivElement>(null);
	const [ search, setSearch ] = useState<string>('');
	const [ focused, setFocused ] = useState<boolean>(false);

	const handleSearch = (evt: any) => {
		setSearch(evt.target.value ?? '');
	};

	const handleSet = (identifier: string) => {
		props.setValue(identifier);
		setSearch('');
	};

	const handleFocus = (focused: boolean) => {
		setFocused(focused);
		if (props.onFocusChange) props.onFocusChange(focused);
	};

	return (
		<div class={('InputSelect ' + (props.class ?? '')).trim()} style={props.style} ref={e => {
			if (!e) return; wrapRef.current = e; if (fRef) fRef.current = e;
		}}>
			<input
				value={search}
				onInput={handleSearch}
				onChange={handleSearch}

				type='text'
				disabled={props.disabled}
				placeholder={props.options[props.value] || (props.value?.length > 0 && Format.fileNameToName(props.value)) || props.placeholder}
				class={('InputSelect-Input ' + (props.value?.length ? 'Selected' : '')).trim()}

				onFocus={() => handleFocus(true)}
				onBlur={() => handleFocus(false)}
			/>

			<Popup z={6} active={focused} defaultAnimation={true}>
				<SearchableOptionPicker query={search} parent={wrapRef.current}
					options={props.options}
					setSelected={selected => handleSet(selected as string)} />
			</Popup>
		</div>
	);
});

export default InputSelect;

// <select
// 			value={props.value}
// 			onInput={cb}
// 			onChange={cb}
			
// 			class={('InputSelect ' + (props.class ?? '')).trim()}
// 			style={props.style}

// 			ref={fRef as any}
// 			disabled={props.disabled}
// 			placeholder={props.placeholder}
			
// 			onFocus={props.onFocusChange ? () => props.onFocusChange!(true) : undefined}
// 			onBlur={props.onFocusChange ? () => props.onFocusChange!(false) : undefined}
// 		>
// 			{Object.keys(props.options).map(value => {
// 				const title = props.options[value] ||
// 					value.split(' ').map(s => s.charAt(0).toUpperCase() + s.substr(1)).join(' ');
// 				return <option value={value}>{title}</option>;
// 			})}
// 		</select>
