import sass from 'sass';
import path from 'path';
import CleanCSS from 'clean-css';
import { promises as fs } from 'fs';


/**
 * Represents the successful output of a build() call.
 * Contains a css string and a shorthand function to save the string to a file.
 */

interface SassBuildResult {
	css: string;
	toFile: (file: string) => Promise<void>;
}


/**
 * Builder class that compiles a S(A|C)SS file or string into CSS.
 * Allows custom sass variables to be defined, and can return minified or unminified css.
 */

export default class SassBuilder {
	private shouldMinify: boolean = true;
	private options: Map<string, string> = new Map();
	private compile: { file: string; path: string } | { data: string; mode: 'sass' | 'scss'; path?: string } = { data: '', mode: 'sass' };


	/**
	 * Instructs the builder to build a file.
	 *
	 * @param {string} file - The path to the file to build.
	 * @param {string} root - The root path for imports, if undefined will be the file's path.
	 * @returns a chainable reference to the builder.
	 */

	fromFile(file: string, root?: string): this {
		this.compile = { file, path: root ?? path.dirname(file) };
		return this;
	}


	/**
	 * Instructs the builder to build a sass or scss string.
	 *
	 * @param {string} data - The string to build.
	 * @param {string} mode - The string's format, either sass or scss.
	 * @param {string} root - An optional include root, if undefined, includes will throw at build.
	 * @returns a chainable reference to the builder.
	 */

	fromString(data: string, mode: 'sass' | 'scss', root?: string): this {
		this.compile = { data, mode, path: root };
		return this;
	}


	/**
	 * Defines a sass variable to be used during the build.
	 *
	 * @param {string} name - The name of the variable.
	 * @param {string} value - The value of the variable.
	 * @returns a chainable reference to the builder.
	 */

	define(name: string, value: string): this {
		this.options.set(name, value);
		return this;
	}


	/**
	 * Sets whether the output CSS should be minified.
	 * The default setting is true.
	 *
	 * @param {boolean} shouldMinify - If the CSS should be minified.
	 * @returns a chainable reference to the builder.
	 */

	minify(shouldMinify: boolean): this {
		this.shouldMinify = shouldMinify;
		return this;
	}


	/**
	 * Asynchronously builds the sass into css with the provided options and definitions,
	 * returns a SassBuildResult object containing the compiled CSS and a shorthand to save it to a file.
	 * Throws if the Sass compiler has an error, or the root file, if specified, cannot be found.
	 *
	 * @returns a SassBuildResult containing the compiled sass.
	 */

	async build(): Promise<SassBuildResult> {
		const mode: 'sass' | 'scss' = (this.compile as any).mode ?? path.extname((this.compile as any).file).substr(1);

		return new Promise<SassBuildResult>((resolve, reject) => {
			this.createSassString().then(s => {
				try {
					sass.render({
						data: s,
						indentedSyntax: mode === 'sass',
						outputStyle: this.shouldMinify ? 'compressed' : undefined,
						includePaths: (this.compile.path ? [ this.compile.path ] : undefined)
					}, (err: sass.SassException, res: sass.Result) => {
						if (err) return reject(err);
						let css = res.css.toString();
						if (this.shouldMinify) css = new CleanCSS({ level: { 2: { all: true }}}).minify(css).styles;
						resolve({ css, toFile: async (file: string) => fs.writeFile(file, css) });
					});
				}
				catch (e) {
					reject(e);
				}
			});
		});
	}


	/**
	 * Creates a sass / scss string with the definitions specified and the data string / root file.
	 *
	 * @returns a sass / scss string to be compiled.
	 */

	private async createSassString() {
		const mode: 'sass' | 'scss' = (this.compile as any).mode ?? path.extname((this.compile as any).file).substr(1);
		
		const vars = [ ...[ ...this.options.keys()].map(k => `$${k}: ${this.options.get(k)}`), '' ].join(mode === 'scss' ? ';' : '\n');
		const contents = (this.compile as any).data ?? (await fs.readFile((this.compile as any).file)).toString();

		return vars + '\n' + contents;
	}
}
