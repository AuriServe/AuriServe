// import { h } from 'preact';
// import { forwardRef } from 'preact/compat';
// import { useState, useRef } from 'preact/hooks';

// import { Format } from 'common';

// import './InputSelect.sass';

// import Popup from '../structure/Popup';
// import { InputProps, FocusableInputProps } from './index';
// import SearchableOptionPicker from './SearchableOptionPicker';

// interface Props extends InputProps, FocusableInputProps {
// 	options: { [value: string]: string };
// 	multi?: boolean;
// }

// /**
//  * A select / multiselect widget.
//  */

// const InputSelect = forwardRef<HTMLDivElement, Props>((props, fRef) => {

// 	const wrapRef = useRef<HTMLDivElement>(null);
// 	const [ search, setSearch ] = useState<string>('');
// 	const [ focused, setFocused ] = useState<boolean>(false);

// 	const handleSearch = (evt: any) => {
// 		setSearch(evt.target.value ?? '');
// 	};

// 	// const handleSet = (identifier: string) => {
// 	// 	props.onValue?.(identifier);
// 	// 	setSearch('');
// 	// };

// 	const handleFocus = (focused: boolean) => {
// 		setFocused(focused);
// 		if (focused && props.onFocus) props.onFocus();
// 		else if (!focused && props.onBlur) props.onBlur();
// 	};

// 	return (
// 		<div class={('InputSelect ' + (props.class ?? '')).trim()} style={props.style} ref={e => {
// 			if (!e) return; wrapRef.current = e; if (fRef) fRef.current = e;
// 		}}>
// 			<input
// 				value={search}
// 				onInput={handleSearch}
// 				onChange={handleSearch}

// 				type='text'
// 				disabled={!(props.enabled ?? true)}
// 				placeholder={props.options[props.value] || (props.value?.length > 0 && Format.fileNameToName(props.value)) || props.placeholder}
// 				class={('InputSelect-Input ' + (props.value?.length ? 'Selected' : '')).trim()}

// 				onFocus={() => handleFocus(true)}
// 				onBlur={() => handleFocus(false)}
// 			/>

// 			<Popup z={6} active={focused} defaultAnimation={true}>
// 				{/* <SearchableOptionPicker
// 					fields={'name'}
// 					query={search} parent={wrapRef.current}
// 					options={(props.options as any)}
// 					onSelect={(selected: any) => handleSet(selected as string)} />*/}
// 			</Popup>
// 		</div>
// 	);
// });

// export default InputSelect;
