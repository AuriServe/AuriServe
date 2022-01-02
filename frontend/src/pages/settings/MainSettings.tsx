import { h } from 'preact';
import { useCallback, useRef, useState } from 'preact/hooks';
// import { Transition } from '@headlessui/react';
import Transition from '../../Transition';

import Card from '../../Card';
import * as Button from '../../Button';
import { FormSchema, Form, Input, FloatingDescription } from '../../Form';

import icon_save from '@res/icon/save.svg';
import icon_overview from '@res/icon/home.svg';


const FORM_SCHEMA: FormSchema = {
	fields: {
		name: {
			type: 'text',
			description: 'The name of your website.',
			default: 'The Shinglemill',
			validation: {
				minLength: 3,
				maxLength: 32
			}
		},
		address: {
			type: 'text',
			description: 'Your website\'s address,\ne.g. www.example.com',
			default: 'www.shinglemill.ca',
			validation: {
				pattern: /^(?:[A-z-_]+\.)+[A-z]{2,24}(?:\/?[A-z-_]+)*\/?$/,
				patternHint: 'Please enter a valid website address.'
			}
		},
		description: {
			type: 'text',
			description: 'A short description of your website, used in search results.',
			default: 'The Shinglemill Pub and Bistro is a favourite restaurant for locals and visitors alike, located on pristine Powell Lake.',
			multiline: true,
			minRows: 3,
			validation: {
				optional: true,
				maxLength: 512
			}
		},
		favicon: {
			type: 'text',
			label: 'Favorite Icon',
			description: 'A small icon for your website, displays on tabs and next to bookmarks.',
			validation: {
				optional: true,
				type: [ 'png', 'svg', 'jpg', 'svg', 'gif' ]
			}
		},
		themeColor: {
			type: 'text',
			label: 'Accent Color',
			description: 'The accent color used for your website, used by some browsers.',
			validation: {
				optional: true
			}
		},
		visibility: {
			type: 'option',
			label: 'Site Visibility',
			description: 'The visibility of your site to search engines.',
			// default: 'visible',
			options: {
				visible: 'Visible',
				hidden: 'Hidden'
			}
		}
	}
};

export default function MainSettings() {
	const [ edited, setEdited ] = useState<boolean>(false);

	const data = useRef<any>({});

	const handleSubmit = useCallback(() => {
		console.log(data);
		setEdited(edited => !edited);
	}, []);

	return (
		<Card>
			<Card.Header icon={icon_overview} title='Overview' subtitle='Basic site appearance, search engine optimization.'/>
			<Card.Body>
				<Form ref={data} schema={FORM_SCHEMA} class='relative' onSubmit={handleSubmit}>
					<div class='grid grid-cols-[16rem,1fr] gap-8'>
						<div>
							<p class='font-medium mb-1'>Site Metadata</p>
							<p class='text-neutral-300 text-sm'>The basic description of your website.</p>
						</div>
						<div class='pt-1 flex flex-col gap-4'>
							<Input for='name'/>
							<Input for='address'/>
							<Input for='description' class='h-24'/>
						</div>
					</div>

					<div class='grid grid-cols-[16rem,1fr] gap-8 border-t-2 border-neutral-700 pt-4 mt-5 mb-1'>
						<div>
							<p class='font-medium mb-1'>Site Appearance</p>
							<p class='text-neutral-300 text-sm'>Settings that determine how browsers display your website.</p>
						</div>
						<div class='pt-1 flex flex-col gap-4'>
							<Input for='favicon'/>
							<Input for='themeColor'/>
							<Input for='visibility'/>
						</div>
					</div>

					<FloatingDescription class='w-80' position='right'/>

					<Transition
						as='div' show={edited} duration={150}
						class='h-14 overflow-hidden'
						enter='transition-all duration-150'
						enterFrom='opacity-0 !h-0 -translate-y-3'
						invertExit
					>
						<div class='flex flex-row-reverse items-end gap-2 px-4 py-2'>
							<Button.Secondary icon={icon_save} label='Save'/>
							<Button.Tertiary label='Undo'/>
						</div>
					</Transition>
				</Form>
			</Card.Body>
		</Card>
	);
}
