"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
;
function loadPlugins({ scripts, styles, themes }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { pluginScripts, pluginStyles } = JSON.parse(document.getElementById('plugins').innerText);
        let pluginElements = {};
        if (scripts) {
            window.serve = {
                registerElement: (elem) => pluginElements[elem.identifier] = elem
            };
            yield Promise.all(pluginScripts.map((s) => {
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = '/plugin/' + s;
                    script.addEventListener('load', () => resolve());
                    document.head.appendChild(script);
                });
            }));
        }
        if (themes) {
            const { themes: siteThemes } = JSON.parse(document.getElementById('themes').innerText);
            yield Promise.all(siteThemes.map((s) => {
                return new Promise((resolve) => {
                    const style = document.createElement('link');
                    style.rel = 'stylesheet';
                    style.href = '/theme/' + s + '.css';
                    style.addEventListener('load', () => resolve());
                    document.head.appendChild(style);
                });
            }));
        }
        if (styles) {
            console.log(pluginStyles);
            yield Promise.all(pluginStyles.map((s) => {
                return new Promise((resolve) => {
                    const style = document.createElement('link');
                    style.rel = 'stylesheet';
                    style.href = '/plugin/' + s;
                    style.addEventListener('load', () => resolve());
                    document.head.appendChild(style);
                });
            }));
        }
        return pluginElements;
    });
}
exports.default = loadPlugins;
