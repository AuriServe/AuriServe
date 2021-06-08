// import * as Preact from 'preact';
// import { useState, useRef } from 'preact/hooks';

// import './InputMedia.sass';

// import { WidgetProps } from '../Input';
// import Popup from '../../structure/Popup';
// import Modal from '../../structure/Modal';
// import MediaIcon from '../../media/MediaIcon';
// import MediaView from '../../media/MediaView';
// import SearchableOptionPicker from '../SearchableOptionPicker';

// type MediaSpecifier = 'image' | 'any';

// interface Props extends WidgetProps {
// 	type?: MediaSpecifier | MediaSpecifier[];
// }

// /**
//  * A media selector widget.
//  */

// function InputMedia(props: Props) {
// 	// const [ { media } ] = useSiteData('media', []);
// 	const media: any[] = [];
// 	const item = media ? media.filter(m => m.identifier === props.value)[0] : undefined;

// 	const wrapRef = useRef<HTMLInputElement>(null);
// 	const [ search, setSearch ] = useState<string>('');
// 	const [ focused, setFocused ] = useState<boolean>(false);
// 	const [ viewing, setViewing ] = useState<boolean>(false);

// 	const handleSearch = (evt: any) => {
// 		setSearch(evt.target.value ?? '');
// 	};

// 	const handleSet = (identifier: string) => {
// 		props.setValue(identifier);
// 		setSearch('');
// 	};

// 	const handleFocus = (focused: boolean) => {
// 		setFocused(focused);
// 		if (props.onFocusChange) props.onFocusChange(focused);
// 	};

// 	return (
// 		<div class='InputMedia' style={props.style} ref={wrapRef}>
// 			<input
// 				value={search}
// 				onInput={handleSearch}
// 				onChange={handleSearch}

// 				type='text'
// 				disabled={props.disabled}
// 				placeholder={item ? item.name : 'Search Media Item'}
// 				class={('InputMedia-Input ' + (item ? 'Selected' : '')).trim()}

// 				onFocus={() => handleFocus(true)}
// 				onBlur={() => handleFocus(false)}
// 			/>

// 			{item &&
// 				<button title='View Image' onClick={() => setViewing(true)} class='InputMedia-ClickableIcon'>
// 					<MediaIcon class='InputMedia-Img' path={item?.publicPath ?? ''} />
// 				</button>
// 			}
// 			{!item && <img class='InputMedia-Img InputMedia-NoSelection' src='/admin/asset/icon/element-dark.svg' alt='' />}

// 			<Popup z={6} active={!!search && focused} defaultAnimation={true}>
// 				<SearchableOptionPicker query={search} parent={wrapRef.current}
// 					options={(media ?? []).map(m => m.identifier)}
// 					setSelected={selected => handleSet(selected as string)}
// 					renderOption={({ option }) => {
// 						const item = (media ?? []).filter(m => m.identifier === option)[0];
// 						return (
// 							<div class='InputMedia-SearchOption'>
// 								<MediaIcon path={item.publicPath} />
// 								<p>{item.name}</p>
// 							</div>
// 						);
// 					}} />
// 			</Popup>

// 			<Modal active={viewing} onClose={() => setViewing(false)} defaultAnimation={true}>
// 				{item && <MediaView item={item} user={null as any}/>}
// 			</Modal>
// 		</div>
// 	);
// }


// export default InputMedia;
