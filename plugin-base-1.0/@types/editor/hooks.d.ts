declare module 'editor/hooks' {
	export function useActiveState(): { active: boolean; hovered: boolean; setActive: () => void };
}
