import { h } from 'preact';

interface ArtItem {
	type: 'art';
	media: number;
	tmp_image: string;
	title: string;
	shape?: 'portrait' | 'landscape' | 'square';
	content: string;
	tags: string[];
}

interface NoteItem {
	type: 'note';
	tmp_image?: string;
	media?: number;
	content: string;
}

interface PostItem {
	type: 'post';
	media?: number;
	title?: string;
	tmp_image: string;
	content: string;
	tags: string[];
}

interface VideoItem {
	type: 'video';
	url: string;
}

type FeedItem = ArtItem | NoteItem | PostItem | VideoItem;

const DATA: FeedItem[] = [
	{
		type: 'note',
		tmp_image: '/media/variants/background.sm.webp',
		content: '<p>Thinking about the #indieweb... So cool how I can have everything that relates to me circle back to my own site!</p>'
	},
	{
		type: 'post',
		title: 'You ever just think about like... everything?',
		media: 1,
		tmp_image: '/media/variants/background.md.webp',
		tags: [ 'contemplative', 'external', 'vibe' ],
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> <p>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. consectetur adipiscing elit.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus.</p> <p>The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'
	},
	{
		type: 'note',
		tmp_image: '/media/variants/dragon.sm.webp',
		content: '<p>WIP Formatting options for Text in the GUI API! This gives modders and users more flexibility when formatting messages :}</p><p>Also WIP Chat mod!</p>'
	},
	{
		type: 'note',
		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices.</p>'
	},
	{
		type: 'note',
		tmp_image: '/media/variants/tabaxi.sm.webp',
		content: '<p>my substitute prof came into our lab today, and just silently responded to emails for 20 minutes. HELLO? YOU\'RE SUPPOSED TO TEACH</p>'
	},
	{
		type: 'note',
		content: '<p>When the Group DMs outnumber the individual DMs in Discord o___o</p>'
	},
	{
		type: 'note',
		content: '<p>Spending time with friends you haven\'t seen in a while is ❤️</p>'
	},
	{
		type: 'post',
		title: 'I think about nothing.',
		media: 1,
		tmp_image: '/media/variants/background_2.sm.webp',
		tags: [ 'contemplative', 'external', 'vibe' ],
		content: '<p>A few months ago, I discovered a new technique to grid alignment in CSS that allowed for incredibly simple masonry layouts using only server-side Javascript. I haven\'t seen anyone else doing this yet, so I thought I\'d share.</p><p>Divide your grid up into the desired number of columns, and then set the row height to a small value, (e.g. 8px). Then, for each element you want to add to the layout, get its aspect ratio, and set its row span to the ratio divided by the row height. Finally, set the grid mode to dense. Tada, you now have a masonry layout!'
	},
	{
		type: 'art',
		media: 15,
		title: 'Cat Sketch',
		tmp_image: '/media/variants/sketch_2.md.webp',
		shape: 'landscape',
		tags: [ 'sketch', 'snep', 'comic' ],
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	{
		type: 'art',
		media: 2,
		title: 'Tabaxi Sorceress',
		tmp_image: '/media/variants/tabaxi.md.webp',
		tags: [ 'furry', 'sketch', 'grayscale', 'snep' ],
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	{
		type: 'art',
		media: 2,
		title: 'Dragon',
		tmp_image: '/media/variants/dragon.md.webp',
		tags: [ 'furry', 'colored' ],
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	{
		type: 'art',
		media: 2,
		title: 'Snow Leopard',
		tmp_image: '/media/variants/cat.sm.webp',
		tags: [ 'furry', 'sketch', 'grayscale', 'snep' ],
		content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget mi tempus</p>'
	},
	{
		type: 'note',
		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices. This opens the door for better shaders and render distance. Minecraft uses ~1.5gb😬</p>'
	},
	{
		type: 'note',
		content: '<p>my substitute prof came into our lab today, and just silently responded to emails for 20 minutes. HELLO? YOU\'RE SUPPOSED TO TEACH</p>'
	},
	{
		type: 'note',
		content: '<p>Spending time with friends you haven\'t seen in a while is ❤️</p>'
	},
	{
		type: 'note',
		content: '<p>When the Group DMs outnumber the individual DMs in Discord o___o</p>'
	},
	{
		type: 'note',
		content: '<p>Hell yes! I got the Zepha\'s memory usage down to &lt; 400mb w/ compression and more efficient vertices.</p>'
	},
	// {
	// 	type: 'micropost',
	// 	content: '<p>When the Group DMs outnumber the individual DMs in Discord o___o</p>'
	// }
];

// DATA.push(...DATA);

const MONTHS = [
	{
		month: 'November 2022',
		posts: DATA
	},
	{
		month: 'October 2022',
		posts: DATA
	},
	{
		month: 'September 2022',
		posts: DATA
	}
]

const identifier = 'indieweb:feed';

export function Feed() {
	return (
		<div class={identifier}>
			{MONTHS.map(month => (
				<div key={month} class='section'>
					<h2 class='title'><span>{month.month}</span></h2>
					<div class='posts'>
						{DATA.map((item, i) => {
							switch (item.type) {
								case 'post':
									return (
										<div key={i} class='item post' style={`--image: url(${item.tmp_image})`}>
											<div class='inner'>
												<div class='image'/>
												<div class='content'>
													<div class='title element-prose'><h3>{item.title}</h3></div>
													<div class='text element-prose' dangerouslySetInnerHTML={{ __html: item.content }}/>
													<div class='tags'>
														{item.tags.map((tag, i) => (
															<div key={i} class='tag'>{tag}</div>
														))}
													</div>
												</div>
											</div>
										</div>
									);
								case 'note': {
									return (
										<div key={i} class={`item note ${item.tmp_image ? 'has_image' : ''}`}
											style={`--image: url(${item.tmp_image})`}>
											<div class='inner'>
												{item.tmp_image && <div class='image'/>}
												<div class='meta'>
													<div class='account'>
														<img src='/media/variants/profile_aurailus.md.webp'/>
														<span>Aurailus</span>
													</div>
													<span class='date'>22 minutes ago</span>
												</div>
												<div class='text element-prose' dangerouslySetInnerHTML={{ __html: item.content }}/>
												<div class='interactions'>
													<button class='hearts'>
														<span>52</span>
													</button>
													<button class='replies'>
														<span>3</span>
													</button>
												</div>
											</div>
										</div>
									);
								}
								case 'art':
									return (
										<div key={i} class={`item art ${item.shape ?? 'portrait'}`} style={`--image: url(${item.tmp_image})`}>
											<div class='inner'>
												<div class='image'/>
												<div class='content'>
													<div class='title element-prose'><h3>{item.title}</h3></div>
													<div class='text element-prose' dangerouslySetInnerHTML={{ __html: item.content }}/>
													<div class='tags'>
														{item.tags.map((tag, i) => (
															<div key={i} class='tag'>{tag}</div>
														))}
													</div>
												</div>
											</div>
										</div>
									);
								case 'video':
									return (
										<div key={i} class='item video'>
											<div class='image'
												style={`background-image: url('https://img.youtube.com/vi/${item.url}/maxresdefault.jpg')`}/>
										</div>
									);
							}
						})}
					</div>
				</div>
			))}
			<script dangerouslySetInnerHTML={{ __html: `
				let s = document.currentScript;
				s.parentElement.querySelectorAll('.note').forEach(n => {
					let s = Math.max(Math.ceil((n.children[0].clientHeight - 64) / (64 + 24)), 0) + 1;
					n.style.gridRow = \`span \${s} / span \${s}\`;
				});
				s.parentElement.querySelectorAll('.posts').forEach(p => {
					let b = 0;
					p.querySelectorAll('.item').forEach(i => b = Math.max(b, i.offsetTop + i.clientHeight));
					while (true) {
						let e = document.createElement('div');
						e.classList.add('spacer');
						p.appendChild(e);
						if (e.offsetTop >= b) {
							e.remove();
							break;
						}
					}
				});
				s.remove();
			`}}/>
		</div>
	);
}

export default { identifier, component: Feed };
