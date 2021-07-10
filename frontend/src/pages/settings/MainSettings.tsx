import * as Preact from 'preact';
import { useState, useReducer, useEffect } from 'preact/hooks';

import { HSVA } from 'common/color';

import { SavePopup } from '../../structure';
import { Form, Annotation, Text, Media, Color } from '../../input';
import { useData, useMutation, QUERY_INFO, MUTATE_INFO } from '../../Graph';


export default function MainSettings() {
	const [ color, setColor ] = useState<HSVA>({ h: 1, s: 1, v: 1, a: 1 });

	const [ data, refresh ] = useData([ QUERY_INFO ], []);
	const updateData = useMutation(MUTATE_INFO);

	const [ info, setInfo ] = useReducer((info, newInfo: any) => ({...info, ...newInfo}),
		{ name: data.info?.name, domain: data.info?.domain,
			description: data.info?.description, favicon: data.info?.favicon });

	const handleReset = () => setInfo({ name: data.info?.name ?? '', domain: data.info?.domain ?? '',
		description: data.info?.description ?? '', favicon: data.info?.favicon });
	
	useEffect(() => handleReset(), [ data ]);

	const isDirty = info.name !== data.info?.name || info.domain !== data.info?.domain ||
		info.description !== data.info?.description || info.favicon !== data.info?.favicon;

	const handleSave = () => updateData({ info }).then(refresh);

	return (
		<Form class='w-full max-w-3xl mx-auto'>
			<div class='grid grid-cols-2 gap-3 pb-4'>
				<Annotation title='Site Name'
					description='A name for your site, used by browers and search engines.'>
					<Text placeholder={'An AuriServe Website'} value={info.name} onValue={(name: string) => setInfo({ name })}/>
				</Annotation>
				<Annotation title='Site Domain'
					description='The domain of your site. Used by plugins and links.'>
					<Text placeholder={'https://example.com'} value={info.domain} onValue={(domain: string) => setInfo({ domain })}/>
				</Annotation>
			</div>

			<Annotation title='Site Description'
				description='A short, consise description of your website, used in search engine results.'>
				<Text multiline placeholder='Description' value={info.description} onValue={(description: string) => setInfo({ description })}/>
			</Annotation>

			<div class='grid grid-cols-2 gap-3 pb-4'>
				<Annotation title='Site Favicon'
					description='An icon for your site, displayed in the corner of tabs.'>
					<Media type='image' value={info.favicon} onValue={favicon => setInfo({favicon})} />
				</Annotation>
				<Annotation title='Site Accent'
					description='An accent color for your website, used by some browsers.'>
					<Color value={color} onValue={setColor} />
				</Annotation>
			</div>
			<SavePopup active={isDirty} onSave={handleSave} onReset={handleReset} />
		</Form>
	);
}
