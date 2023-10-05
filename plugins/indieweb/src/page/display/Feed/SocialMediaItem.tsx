import { h } from 'preact';

import PostItem from './PostItem';

type SocialMediaType = 'discord' |
	'github' |
	'twitch' |
	'youtube' |
	'tumblr' |
	'tumblr2' |
	'bluesky' |
	'youtube2' |
	'patreon';

interface Props {
	type: SocialMediaType;
}

const INFO: Record<SocialMediaType, {
	color: string;
	accent: string;
	name: string;
	icon: string;
	url: string;
	description: string;
}> = {
	discord: {
		color: '#32438b',
		accent: '#bad2ff',
		name: 'Auri\'s Den',
		icon: 'logo_discord.svg',
		description: 'The coziest place to chat + early news!',
		url: 'https://aurail.us/discord'
	},
	tumblr: {
		color: '#295189',
		accent: '#cbe6ff',
		name: '@zephagame',
		icon: 'logo_tumblr.svg',
		description: 'Zepha updates, videos, and info!',
		url: 'https://tumblr.com/zephagame'
	},
	tumblr2: {
		color: '#295189',
		accent: '#cbe6ff',
		name: '@aurailus',
		icon: 'logo_tumblr.svg',
		description: 'Personal ramblings & photography',
		url: 'https://tumblr.com/aurailus'
	},
	bluesky: {
		color: '#1e6593',
		accent: '#cbfaff',
		name: '@aurail.us',
		icon: 'logo_bluesky.svg',
		description: 'Incoherence and furry babble.',
		url: 'https://bsky.app/profile/aurail.us'
	},
	github: {
		color: '#404875',
		accent: '#a3ade1',
		name: '@Aurailus',
		icon: 'logo_github.svg',
		description: 'Open source code & projects!',
		url: 'https://github.com/Aurailus'
	},
	youtube: {
		color: '#873052',
		accent: '#ffa3b4',
		name: '@Aurailus',
		icon: 'logo_youtube.svg',
		description: 'Videos about coding and gamedev!',
		url: 'https://youtube.com/@Aurailus'
	},
	youtube2: {
		color: '#873052',
		accent: '#ffa3b4',
		name: '@AurailusVODs',
		icon: 'logo_youtube.svg',
		description: 'Stream VODs. Ludum Dare footage!',
		url: 'https://youtube.com/@AurailusVODs',
	},
	twitch: {
		color: '#402f7d',
		accent: '#c1b4ff',
		name: '@Aurailus',
		icon: 'logo_twitch.svg',
		description: 'Game dev streams every Saturday!',
		url: 'https://twitch.tv/Aurailus'
	},
	patreon: {
		color: '#894f35',
		accent: '#ffe4a6',
		name: '@Aurailus',
		icon: 'logo_patreon.svg',
		description: 'Early access to videos and blogs!',
		url: 'https://www.patreon.com/aurailus'
	}
}

export default function SocialMediaItem({ type }: Props) {
	const info = INFO[type];

	return (
		<PostItem class={`social`}
			style={`--image: url(/media/${info.icon}); --color: ${info.color}; --accent: ${info.accent}`}>
			<a class='inner' target='_blank' rel='noreferrer' href={info.url}>
				<div class='image'/>
				<div class='content'>
					<p class='name'>
						{info.name.startsWith('@') ? <span class='at'>@</span> : null}
						<span class='text'>{info.name.slice(info.name.startsWith('@') ? 1 : 0)}</span>
					</p>
					<p class='description'>{info.description}</p>
				</div>
			</a>
		</PostItem>
	);
}
