import * as Preact from 'preact';
import { useReducer, useEffect } from 'preact/hooks';

import SavePopup from '../../SavePopup';
import * as Input from '../../input/Input';
import { useQuery, useMutation, QUERY_INFO, MUTATE_INFO } from '../../Graph';

import './MainSettings.sass';

export default function MainSettings() {
	const [ data ] = useQuery(QUERY_INFO);
	const updateData = useMutation(MUTATE_INFO);

	const [ info, setInfo ] = useReducer((info, newInfo: any) => ({...info, ...newInfo}),
		{ name: data.info?.name, domain: data.info?.domain,
			description: data.info?.description, favicon: data.info?.favicon });

	const handleReset = () => setInfo({ name: data.info?.name ?? '', domain: data.info?.domain ?? '',
		description: data.info?.description ?? '', favicon: data.info?.favicon });
	
	useEffect(() => handleReset(), [ data ]);

	const isDirty = info.name !== data.info?.name || info.domain !== data.info?.domain ||
		info.description !== data.info?.description || info.favicon !== data.info?.favicon;

	const handleSave = () => updateData({ info });

	return (
		<div class='Settings MainSettings'>
			<form onSubmit={e => e.preventDefault()}>
				<div class='MainSettings-Columns' style={{paddingBottom: 16}}>
					<div>
						<Input.Annotation title='Site Name'
							description='A name for your site, used by browers and search engines.'>
							<Input.Text placeholder={'An AuriServe Website'} value={info.name} setValue={name => setInfo({ name })}/>
						</Input.Annotation>
					</div>
					<div>
						<Input.Annotation title='Site Domain'
							description='The domain of your site. Used by plugins and links.'>
							<Input.Text placeholder={'https://example.com'} value={info.domain} setValue={domain => setInfo({ domain })}/>
						</Input.Annotation>
					</div>
				</div>

				<Input.Annotation title='Site Description'
					description='A short, consise description of your website, used in search engine results.'>
					<Input.Text long={true} placeholder='Description' value={info.description} setValue={description => setInfo({ description })}/>
				</Input.Annotation>

				<div class='MainSettings-Columns' style={{paddingTop: 16}}>
					<div>
						<Input.Annotation title='Site Favicon'
							description='An icon for your site, displayed in the corner of tabs.'>
							<Input.Media type='image' value={info.favicon} setValue={favicon => setInfo({favicon})} />
						</Input.Annotation>
						{/* <Input.Annotation title='Site Accent'
							description='An accent color for your website, used by some browsers.'>
							<Input.Color value={color} setValue={setColor} />
						</Input.Annotation>*/}
					</div>
					<div>
					</div>
				</div>
				<SavePopup active={isDirty} onSave={handleSave} onReset={handleReset} />
			</form>
		</div>
	);
}
