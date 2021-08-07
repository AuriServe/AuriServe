import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import { useData, QUERY_MEDIA, QUERY_USERS } from '../Graph';

import MediaIcon from '../media/MediaIcon';
import MediaView from '../media/MediaView';
import { Popup, Modal } from '../structure';
import { InputProps, FocusableInputProps } from './index';
import SearchableOptionPicker from './SearchableOptionPicker';

import { mergeClasses } from 'common/util';

import style from './Input.sss';

type MediaSpecifier = 'image' | 'any';

interface Props extends InputProps, FocusableInputProps {
	type?: MediaSpecifier | MediaSpecifier[];
}

/**
 * A media selector widget.
 */

export default function InputMedia(props: Props) {
	const [ { media, users } ] = useData([ QUERY_MEDIA, QUERY_USERS ], []);
	const item = media ? media.filter(m => m.id === props.value)[0] : undefined;

	const wrapRef = useRef<HTMLInputElement>(null);
	const [ search, setSearch ] = useState<string>('');
	const [ focused, setFocused ] = useState<boolean>(false);
	const [ viewing, setViewing ] = useState<boolean>(false);

	useEffect(() => {
		if (props.focusOnMount) wrapRef.current?.querySelector('input')?.focus();
	}, []);

	const handleSearch = (evt: any) => {
		setSearch(evt.target.value ?? '');
	};

	const handleSet = (id: string) => {
		props.onValue?.(id);
		setSearch('');
	};

	const handleFocus = () => {
		setFocused(true);
		props.onFocus?.();
	};

	const handleBlur = () => {
		// setFocused(false);
		props.onBlur?.();
	};

	return (
		<div class={mergeClasses(style.Input, 'flex flex-row-reverse !p-0')} style={props.style} ref={wrapRef}>
			<input
				value={search}
				onInput={handleSearch}
				onChange={handleSearch}

				type='text'
				disabled={!(props.enabled ?? true)}
				placeholder={item ? item.name : 'Search Media Item'}
				class={mergeClasses('flex-grow bg-transparent p-2',
					'focus:outline-none focus:placeholder-gray-500 dark:focus:placeholder-gray-500',
					props.value ? 'placeholder-black dark:placeholder-gray-800' : 'placeholder-gray-500')}

				onFocus={handleFocus}
				onBlur={handleBlur}
			/>

			{item &&
				<button type='button' title='View Image' onClick={() => setViewing(true)} class='w-12 h-12 p-2 -m-px focus:outline-none'>
					<MediaIcon class='w-8 h-8' path={item?.url ?? ''} />
				</button>
			}

			{!item && <img class='w-12 h-12 p-3 -m-px' src='/admin/asset/icon/element-dark.svg' alt='' role='presentation' />}

			<Popup active={!!search && focused} defaultAnimation={true}>
				<SearchableOptionPicker parent={wrapRef.current} query={search} fields={[ 'name', 'url' ]}
					options={(media ?? [])} onSelect={selected => handleSet(selected.id)}>
					{({ option, selected }) =>
						<div class={mergeClasses('flex flex-row flex-grow text-left items-center gap-2',
							'hover:bg-gray-800/75 dark:hover:bg-gray-200/75 active:bg-gray-800 dark:active:bg-gray-200',
							selected && 'bg-gray-800/60 dark:bg-gray-200/50')}>
							<MediaIcon class='w-8 h-8 m-2' path={option.url}/>
							<p class='flex-grow text-gray-200 dark:text-gray-600'>{option.name}</p>
						</div>
					}
				</SearchableOptionPicker>
			</Popup>

			<Modal active={viewing} onClose={() => setViewing(false)} defaultAnimation={true}>
				{item && <MediaView media={item} user={(users ?? []).filter(user => user.id === item.user)[0]}/>}
			</Modal>
		</div>
	);
}
