import * as Preact from 'preact';
import { NavLink as Link } from 'react-router-dom';

import { Format } from 'common';

import Title from '../Title';
import Meter from '../structure/Meter';
import CardHeader from '../structure/CardHeader';
import { useQuery, QUERY_INFO, QUERY_QUOTAS } from '../Graph';

import './MainPage.sass';

export default function MainPage() {
	const [ { info, quotas } ] = useQuery([ QUERY_INFO, QUERY_QUOTAS ]);

	return (
		<div class='MainPage'>
			<Title>Home</Title>
			<div class='MainPage-Header'>
				<h1>
					<img src='/admin/asset/icon/globe-dark.svg' alt=''/>
					{info?.domain ?? '...'}
				</h1>
				<h2>{info?.name ?? '...'}</h2>
			</div>
			<div class='MainPage-Content'>
				<aside>
					{false && <div class='MainPage-Card MainPage-Update'>
						<div class='MainPage-UpdateImage'>
							<img src='/admin/asset/icon/serve-light.svg' />
						</div>
						<h3>AuriServe is ready to Update!</h3>
						<h4>— Changes and Improvements —</h4>
						<ul>
							<li>New stuff</li>
							<li>Crazy cool features</li>
							<li>Ability score improvement</li>
							<li>30% Less viruses</li>
						</ul>
						<Link className='MainPage-UpdateButton' to='/'>Update Now</Link>
					</div>}

					<div class='MainPage-Card MainPage-Storage'>
						<CardHeader title='Storage Overview' icon='/admin/asset/icon/element-dark.svg'
							subtitle={`${Format.bytes(quotas?.storage.used ?? 0)} / ${Format.bytes(quotas?.storage.allocated ?? 0)} consumed`}/>

						<Meter class='MainPage-StorageMeter' usage={quotas?.storage.used ?? 0} size={quotas?.storage.allocated ?? 1} />

						<Link to='/media'>Manage Media</Link>
					</div>
				</aside>
				<main>
					<div class='MainPage-Card MainPage-Other'>
						<CardHeader title='Quick Links' subtitle='Access admin content quickly.' icon='/admin/asset/icon/view-dark.svg' />
						<h3><a href='/admin/pages/index'>Edit Calendar</a></h3>
						<p>Open the home page editor, which allows you to edit the calendar within it.</p>

						<h3><Link to='/admin/settings/overview'>Manage site metadata</Link></h3>
						<p>Change the site name, description, and favicon.</p>
					</div>
				</main>
			</div>
		</div>
	);
}
