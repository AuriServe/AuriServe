import { h } from 'preact';

import { merge } from 'common/util';

interface Props {
	name: string;
	coverPath?: string;
	description: string;

	enabled: boolean;

	onToggle: () => void;
	onDetails: () => void;
}

import icon_check from '@res/icon/check.svg';
import Svg from '../../Svg';
import Transition from '../../Transition';

export default function FeatureItem({ coverPath, name, description, enabled, onDetails, onToggle }: Props) {
	// console.log(coverPath);
	const handleToggle = (evt: Event) => {
		onToggle();
		// evt.preventDefault();
		evt.stopPropagation();
	};

	return (
		<button onClick={onDetails} class='relative flex items-end w-full
			text-left aspect-[3/2] rounded-lg shadow-md overflow-hidden hover:ring hover:ring-offset-2
			ring-offset-neutral-800 ring-neutral-300 transition'>

			{coverPath
				? <img src={coverPath} width='640' height='320' alt='' role='presentation' class={merge(
					'absolute inset-0 bg-gradient-to-br object-cover', !enabled && 'grayscale')}/>
				: <div class='absolute inset-0 bg-gradient-to-br from-accent-600 to-accent-800'
					style={{ filter: !enabled ? 'sepia(100%) hue-rotate(180deg) saturate(220%) brightness(60%)' : '' }}/>
			}

			<div class='group absolute inset-0 transition hover:bg-neutral-800/25'>
				<div class={merge('absolute w-full p-3 pt-8 group-hover:bottom-0 h-[7.75rem]',
					'top-auto -bottom-[2.375rem] text-shadow-md font-medium transition-all bg-gradient-to-b',
					'from-transparent via-neutral-800/50 to-neutral-800/50',
					!enabled && 'opacity-75')}>
					<h2 class={merge('text-black dark:text-white')}>{name}</h2>
					<p class='text-sm opacity-75 line-clamp-3 text-black dark:text-white leading-6
						group-hover:leading-5 group-hover:delay-0 delay-[35] transition-all duration-[0]'>
						{description} These are more words to pad out the text hahahahahaha</p>
				</div>
			</div>

			<button class='group absolute top-0 right-0 w-10 h-10 p-2 cursor-pointer !outline-none' onClick={handleToggle}>
				<div class={merge(
					'w-9 h-9 top-0.5 left-0.5 absolute rounded-full bg-white/20 opacity-0 scale-75 transition',
					'group-hover:opacity-75 group-focus-visible:opacity-75 group-active:opacity-100 group-active:scale-100',
					enabled && 'group-hover:scale-[90%] group-focus-visible:scale-[90%]' ,
					!enabled && 'group-hover:scale-50 group-focus-visible:scale-50')}/>
				<div class={merge('w-full h-full rounded-full shadow border-2 transition',
					enabled && 'border-white bg-white', !enabled && 'border-white/75 scale-90')}>
					<Transition show={enabled} duration={75} enter='transition' enterFrom='scale-75 opacity-0' invertExit>
						<Svg src={icon_check} size={6} class={merge('primary-neutral-800 secondary-white -m-0.5')}/>
					</Transition>
				</div>
			</button>

			{/* <div class='grid grid-cols-2 gap-px bg-neutral-100 dark:bg-neutral-600 border-t border-neutral-100 dark:border-neutral-600'>
				<Button label={enabled ? 'Disable' : 'Enable'} class='rounded-t-none rounded-r-none' onClick={onToggle}/>
				<Button label='Details' class='rounded-t-none rounded-l-none' onClick={onDetails}/>
			</div> */}
		</button>
	);
}
