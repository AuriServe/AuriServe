import { tw } from 'dashboard';
import { RefObject } from 'preact';
import autocomplete, { AutocompleteAction, FromTo } from 'prosemirror-autocomplete';

interface Hooks {
	command: RefObject<(action: AutocompleteAction) => boolean>;
	emoji: RefObject<(action: AutocompleteAction) => boolean>;
}

export default function SlashCommandsPlugins(hooks: Hooks) {
	const autoCompletePlugins = autocomplete({
		triggers: [
			{
				name: 'command',
				trigger: /(?:^|\n)(\/)$/,
				allArrowKeys: true,
				cancelOnFirstSpace: true,
				decorationAttrs: {
					class: tw`Autocomplete~(text-accent-200/80 font-semibold inline-block leading-none relative
						before:(content-[_] block absolute -inset-2 bg-accent-500/10 rounded)`,
				}
			},
			{
				name: 'emoji',
				trigger: ':',
				cancelOnFirstSpace: true,
				decorationAttrs: {
					class: tw`Autocomplete~(text-accent-200/80 font-semibold)`,
				}
			}
		],
		reducer: (action: AutocompleteAction): boolean => {
			switch (action.type?.name) {
				default:
					return false;
				case 'command':
					return hooks.command.current?.(action) ?? false;
				case 'emoji':
					return hooks.emoji.current?.(action) ?? false;
			}
		},
	});

	return autoCompletePlugins;
}
