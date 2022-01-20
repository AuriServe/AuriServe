/* eslint-disable */

function declConvert(decl, postcss) {
	const val = decl.value.trim();

	if (val.startsWith('/*')) return;
	if (val.includes('@theme')) {
		decl.replaceWith(
			postcss.parse(
				`${decl.prop}: ${val.replace(/@\s?[a-z-]+\s?\([a-z., ]+\)/g, '/*$&*/')};`
			)
		);
		return;
	}

	if (val.includes('@color-swatch')) {
		const match = val.match(/@color-swatch\(\s*([a-z.]+)\s*,\s*([a-z]+)\s*\)/i);

		decl.replaceWith(
			postcss.parse(`/*@color-swatch(${match[1]}, ${decl.prop}, ${match[2]})*/;`)
		);

		return;
	}
}

module.exports = (_opts = {}) => {
	return {
		postcssPlugin: 'postcss-auriserve-theme',
		AtRule(atRule, postcss) {
			if (atRule.name === 'if' || atRule.name === 'elseif' || atRule.name === 'else') {
				const next = atRule.next();
				const atEnd =
					!next ||
					next.type != 'atrule' ||
					(next.name !== 'elseif' && next.name !== 'else');

				atRule.walkDecls((decl) => declConvert(decl, postcss));

				const toInsert = atRule.nodes;
				if (atEnd) toInsert.push(postcss.parse('/*@endif*/'));
				for (const node of toInsert.reverse()) atRule.after(node);
				atRule.replaceWith(postcss.parse(`/*@${atRule.name}${atRule.params}*/`));
			}
		},
		Declaration(decl, postcss) {
			declConvert(decl, postcss);
		},
	};
};

module.exports.postcss = true;
