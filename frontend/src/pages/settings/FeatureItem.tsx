import { h } from 'preact';
import { useState } from 'preact/hooks';

import Svg from '../../Svg';
import Transition from '../../Transition';

import { merge } from 'common/util';

import icon_check from '@res/icon/check.svg';

interface Props {
	name: string;
	coverPath?: string;
	description: string;

	enabled: boolean;

	onToggle: () => void;
	onDetails: () => void;
}


export default function FeatureItem({ coverPath, name, description, enabled, onDetails, onToggle }: Props) {
	const [ height, setHeight ] = useState<number>(0);

	// console.log(coverPath);
	const handleToggle = (evt: Event) => {
		onToggle();
		// evt.preventDefault();
		evt.stopPropagation();
	};

	return (
		<div class='relative flex items-end w-full aspect-[3/2]'>
			<button onClick={onDetails}
				class='relative isolate w-full h-full overflow-hidden group
					rounded-lg shadow-md transition text-left !outline-none
					ring-offset-neutral-800 ring-neutral-300 transition
					hocus:ring hocus:ring-offset-2 hocus:bg-neutral-800/25'>
				{coverPath
					? <img src={coverPath} width='640' height='320' alt='' role='presentation' class={merge(
						'absolute inset-0 bg-gradient-to-br object-cover', !enabled && 'grayscale')}/>
					: <div class='absolute inset-0 bg-gradient-to-br from-accent-600 to-accent-800'
						style={{ filter: !enabled ? 'sepia(100%) hue-rotate(180deg) saturate(220%) brightness(60%)' : '' }}/>
				}
				<div class={merge('absolute w-full p-3 pt-8 bottom-0 top-auto',
					'group-not-hocus:!h-[5.25rem] text-shadow-md font-medium transition-all',
					'bg-gradient-to-b from-transparent via-neutral-800/50 to-neutral-800/50',
					!enabled && 'opacity-75')} style={{ height: `${height + 64}px` }}>
					<h2 class={merge('text-black dark:text-white')}>{name}</h2>
					<div class='relative'>
						<p aria-hidden={true}
							class='top-0 left-0 w-full text-sm line-clamp-1 leading-5 text-black dark:text-white
								transition-all opacity-75 group-hocus:opacity-0'>{description}</p>
						<p ref={(elem) => { if (elem) setHeight(elem.offsetHeight); }}
							class='absolute top-0 left-0 w-full text-sm line-clamp-3 text-black dark:text-white leading-5
							transition-all opacity-0 group-hocus:opacity-75'>{description}</p>
					</div>
				</div>
			</button>

			<button class='group absolute top-0 right-0 w-10 h-10 p-2 cursor-pointer !outline-none' onClick={handleToggle}>
				<div class={merge(
					'w-9 h-9 top-0.5 left-0.5 absolute rounded-full bg-white/20 opacity-0 scale-75 transition',
					'group-hocus:opacity-75 group-active:opacity-100 group-active:scale-100',
					enabled ? 'group-hocus:scale-[90%]' : 'group-hocus:scale-50')}/>
				<div class={merge('w-full h-full rounded-full shadow border-2 transition',
					enabled && 'border-white bg-white', !enabled && 'border-white/75 scale-90')}>
					<Transition show={enabled} duration={75} enter='transition' enterFrom='scale-75 opacity-0' invertExit>
						<Svg src={icon_check} size={6} class={merge('icon-p-neutral-800 icon-s-white -m-0.5')}/>
					</Transition>
				</div>
			</button>

			{/* <div class='grid grid-cols-2 gap-px bg-neutral-100 dark:bg-neutral-600 border-t border-neutral-100 dark:border-neutral-600'>
				<Button label={enabled ? 'Disable' : 'Enable'} class='rounded-t-none rounded-r-none' onClick={onToggle}/>
				<Button label='Details' class='rounded-t-none rounded-l-none' onClick={onDetails}/>
			</div> */}
		</div>
	);
}
