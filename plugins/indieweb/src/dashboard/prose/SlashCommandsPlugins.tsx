import { tw } from 'dashboard';
import { RefObject } from 'preact';
import autocomplete, { AutocompleteAction, FromTo } from 'prosemirror-autocomplete';

interface Hooks {
	commands: RefObject<(action: AutocompleteAction) => boolean>;
}

export default function SlashCommandsPlugins({ commands }: Hooks) {
	const autoCompletePlugins = autocomplete({
		triggers: [
			{
				name: 'command',
				trigger: /(?:^|\n)(\/)$/,
				allArrowKeys: true,
				cancelOnFirstSpace: true,
				decorationAttrs: {
					// class: tw`Autocomplete~(text-(gray-300)) font-(bold mono)`
					class: tw`Autocomplete~(text-accent-200/80 font-semibold inline-block leading-none relative
						before:(content-[_] block absolute -inset-2 bg-accent-500/10 rounded)`,
				},
			},
		],
		reducer: (action: AutocompleteAction): boolean => {
			switch (action.type?.name) {
				default:
					return false;
				case 'command':
					return commands.current?.(action) ?? false;
			}
		},
	});

	// const hintPlugin = new Plugin({
	//   props: {
	//     decorations(state) {
	//       let doc = state.doc;
	//       if (doc.childCount == 1 && doc.firstChild?.isTextblock && doc.firstChild?.content.size == 0)
	//         return DecorationSet.create(doc, [ Decoration.widget(1, document.createTextNode(text)) ])
	//     }
	//   }
	// })

	return autoCompletePlugins;
}
