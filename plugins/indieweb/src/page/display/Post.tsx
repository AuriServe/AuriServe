import { ComponentChildren, h } from 'preact';

const identifier = 'indieweb:post';

interface Props {
	title: string;

	children: ComponentChildren;
}

export function Post(props: Props) {
	// const mediaID = 5;
	const media = '/media/variants/background.lg.webp';

	return (
		<div class={identifier} style={`--image: url(${media});`}>
			<div class='background'/>
			<div class='inner'>
				<h2 class='title'>{props.title}</h2>

				<div class='image'/>

				<nav>
					<div class='inner'>
						<p class='label'>Table of Contents</p>
						<ol>
							<li><a href='#'>Introduction</a></li>
							<li><a href='#'>The basic idea</a></li>
							<li>
								<a href='#'>Use case 1: Heavy computations</a>
								<ol aria-label='sub headers'>
									<li><a href='#'>An alternative approach</a></li>
								</ol>
							</li>
							<li><a href='#'>Use case 2: Preserved references</a></li>
							<li><a href='#'>The useCallback hook</a></li>
							<li>
								<a href='#'>When to use these hooks</a>
								<ol aria-label='sub headers'>
									<li><a href='#'>Inside generic custom hooks</a></li>
									<li><a href='#'>Inside context providers</a></li>
								</ol>
							</li>
							<li><a href='#'>The Joy of React</a></li>
						</ol>
					</div>
				</nav>

				<div class='content'>
					{props.children}
				</div>
			</div>
			<script dangerouslySetInnerHTML={{ __html: `
				const background = document.currentScript.parentElement.querySelector('.background');
				window.addEventListener('scroll', () => {
					background.style.transform = \`translateY(\${Math.max(-window.scrollY * 0.7, -window.innerHeight * 0.8 + 192)}px)\`;
				}, { passive: true });
			`}}/>
		</div>
	)
}

export default { identifier, component: Post }
