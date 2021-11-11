import { h } from 'preact';
import { useState } from 'preact/hooks';
import { CSSTransition } from 'preact-transitioning';

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
			default: 'The Shinglemill The Shinglemill The Shinglemill',
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
			type: 'media',
			label: 'Favorite Icon',
			description: 'A small icon for your website, displays on tabs and next to bookmarks.',
			validation: {
				optional: true,
				type: [ 'png', 'svg', 'jpg', 'jpeg', 'svg', 'gif' ]
			}
		},
		themeColor: {
			type: 'color',
			label: 'Accent Color',
			description: 'The accent color used for your website, used by some browsers.',
			validation: {
				optional: true
			}
		}
	}
};

export default function MainSettings() {
	const [ edited, setEdited ] = useState<boolean>(false);

	return (
		<Card>
			<Card.Header icon={icon_overview} title='Overview' subtitle='Basic site appearance, search engine optimization.'/>
			<Card.Body>
				<Form schema={FORM_SCHEMA} class='relative' onSubmit={() => setEdited(!edited)}>
					<div class='grid grid-cols-[16rem,1fr] gap-8'>
						<div class='p-4'>
							<p class='font-medium mb-1'>Site Metadata</p>
							<p class='text-neutral-300 text-sm'>The basic description of your website.</p>
						</div>
						<div class='p-4 flex flex-col gap-4'>
							<Input for='name'/>
							<Input for='address'/>
							<Input for='description' class='h-24'/>
						</div>
					</div>

					<div class='grid grid-cols-[16rem,1fr] gap-8 border-t-2 border-neutral-700 pt-4 mt-2'>
						<div class='p-4'>
							<p class='font-medium mb-1'>Site Appearance</p>
							<p class='text-neutral-300 text-sm'>Settings that determine how browsers display your website.</p>
						</div>
						<div class='p-4 pt-2 flex flex-col gap-4'>
							<Input for='favicon'/>
							<Input for='themeColor'/>
						</div>
					</div>

					<FloatingDescription class='w-80' position='right'/>

					<CSSTransition in={edited} duration={500} classNames={{
						appear: 'h-0 py-0 opacity-0 translate-y-8',
						appearActive: '!h-12 !py-2 !opacity-100 !translate-y-0',
						appearDone: '!h-12 !py-2',
						enter: 'h-0 py-0 opacity-0 translate-y-8',
						enterActive: '!h-12 !py-2 !opacity-100 !translate-y-0',
						enterDone: '!h-12 !py-2',
						exit: 'h-12 py-2 opacity-100 translate-y-0',
						exitActive: '!h-0 !py-0 !opacity-0 !translate-y-8'
					}}>
						<div className='flex flex-row-reverse gap-2 px-4 items-end transition-all'>
							<Button.Secondary icon={icon_save} label='Save'/>
							<Button.Tertiary label='Undo'/>
						</div>
					</CSSTransition>
				</Form>
			</Card.Body>
		</Card>
	);
}
