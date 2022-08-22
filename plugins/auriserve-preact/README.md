# Auriserve Preact

Exposes an instance of Preact to AuriServe plugins. This is done using a plugin and not just bundling the library because Preact/React becomes unhappy when multiple instances of it are being used simultaneously. Exports both server and client configurations. Note that this plugin does export preact/compat for maximum compatibility with React libraries.

## __AURISERVE.h

Babel seems to get upset when trying to transform JSX to a non-global function, so this plugin exposes the `__AURISERVE.h` global for plugins to use as well. This is undesirable, and will be removed when an issue can be found for Babel. If possible, Babel should be pointed to the `auriserve-preact` plugin's `h` export instead.
