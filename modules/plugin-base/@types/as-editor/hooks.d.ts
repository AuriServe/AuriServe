import * as Preact from 'preact';
import { SiteData, SiteDataSpecifier } from 'auriserve-api';

declare module 'as-editor/hooks' {
	export function useForceUpdate(): () => void;

	export function useImmediateRerender(): void;

	export function usePopupCancel(popup: Preact.RefObject<any>,
		onCancel: () => any, condition?: () => boolean, dependents?: any[]): void;


	export function useSiteData(refresh?: SiteDataSpecifier | SiteDataSpecifier[], dependents?: any[]):
		[ Partial<SiteData>, (refresh: SiteDataSpecifier | SiteDataSpecifier[]) => Promise<Partial<SiteData>>,
		(data: Partial<SiteData>) => void ];

	export function useMessaging(target: { postMessage: any } | null | undefined,
		onRecieve: (type: string, body?: string) => void, dependents: any[], key: string): void;
}
