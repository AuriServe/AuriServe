import as from 'auriserve';

// setTimeout(() => {
const {
	preact: { h },
	renderToString,
} = as.preact;

console.log(renderToString(h('div', null, h('h1', null, 'Hello for real!'))));
// }, 1);

// import preact from 'preact';
// import hooks from 'preact/hooks';

// import as from 'auriserve';

// as.export('preact-routes', { preact, hooks });
