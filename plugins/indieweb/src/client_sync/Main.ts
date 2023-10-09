import Color from 'color';

const toCompute = document.querySelectorAll('[data-palettize]');

type RGB = [ number, number, number ];

function getAverageColor(img: HTMLImageElement, precision = 5): RGB {
	let data: ImageData;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d')!;
	const height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
	const width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
	ctx.drawImage(img, 0, 0);

	try {
		data = ctx.getImageData(0, 0, width, height);
	} catch(e) {
		return [ 0, 0, 0 ];
	}

	let count = 0, i = 0;
	const length = data.data.length;

	const rgb: RGB = [ 0, 0, 0 ];

	while ((i += precision * 4) < length) {
		++count;
		rgb[0] += data.data[i];
		rgb[1] += data.data[i + 1];
		rgb[2] += data.data[i + 2];
	}

	rgb[0] = ~~(rgb[0] / count);
	rgb[1] = ~~(rgb[1] / count);
	rgb[2] = ~~(rgb[2] / count);

	return rgb;
}

const weights = {
	50: 97.5,
	100: 95,
	200: 90,
	300: 80,
	400: 70,
	500: 60,
	600: 50,
	700: 35,
	800: 20,
	900: 10
}

toCompute.forEach(img => {
	const color = getAverageColor(img as HTMLImageElement);
	const upCount = Number.parseInt(img.getAttribute('data-palettize')!, 10);
	let elem = img as HTMLElement;
	for (let i = 0; i < upCount; i++) elem = elem.parentElement as HTMLElement;
	elem.style.setProperty('--palette-true',
		Color(color).string().substring(4).replace(/\)$/, ''));
	Object.entries(weights).forEach(([ weight, lightness ]) =>
		elem.style.setProperty(`--palette-${weight}`,
			Color(color).lightness(lightness).saturationl(100).rgb().string().substring(4).replace(/\)$/, '')));
});

const scrollTopElems = document.querySelectorAll('[data-scrolltop]');
const windowScrollTopElems = Array.from(scrollTopElems)
	.filter(e => isNaN(Number.parseInt(e.getAttribute('data-scrolltop')!, 10)));
const hasSynchronousScrollTop = windowScrollTopElems.findIndex(e => e.getAttribute('data-scrolltop') === 'sync') !== -1;
if (windowScrollTopElems.length) {
	scrollTopElems.forEach(elem => (elem as HTMLElement).style.setProperty('--scroll-top', window.scrollY.toString()))
	window.addEventListener('scroll', () => {
		scrollTopElems.forEach(elem => (elem as HTMLElement).style.setProperty('--scroll-top', window.scrollY.toString()));
	}, { passive: !hasSynchronousScrollTop });
}
const customScrollTopElems = Array.from(scrollTopElems).filter(e => !isNaN(Number.parseInt(e.getAttribute('data-scrolltop')!, 10)));
customScrollTopElems.forEach(elem => {
	let parent = elem;
	for (let i = 0; i < Number.parseInt(elem.getAttribute('data-scrolltop')!, 10); i++) parent = parent.parentElement!;
	(parent as HTMLElement).style.setProperty('--scroll-top', elem.scrollTop.toString());
	elem.addEventListener('scroll', () => {
		(parent as HTMLElement).style.setProperty('--scroll-top', elem.scrollTop.toString());
	}, { passive: true });
})


const expandElems = document.querySelectorAll(':is(strong.jitter, em.bounce)');
expandElems.forEach(elem => {
	const text = elem as HTMLElement;
	let i = 0;
	text.innerHTML = text.innerText.split(' ').map(w => `<span>${
		w.split('').map((c) => `<span style='--i:${i++}'>${c}</span>`).join('')}</span>`).join('');
});
