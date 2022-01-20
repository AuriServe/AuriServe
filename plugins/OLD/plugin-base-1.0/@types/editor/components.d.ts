import type * as Preact from 'preact';
import { SiteData, SiteDataSpecifier } from 'auriserve-api';

declare module 'editor/components' {
	// Context
	export interface AppContextData {
		data: Partial<SiteData>;
		mergeData(data: Partial<SiteData>): void;
	}

	export const AppContext: Preact.Context<AppContextData>;

	export function refreshSiteData(mergeData: (data: Partial<SiteData>) => void,
		refresh: SiteDataSpecifier | SiteDataSpecifier[]): Promise<Partial<SiteData>>;

	export const ComponentArea: Preact.FunctionalComponent<any>;


	// Input
	export const Label: Preact.FunctionalComponent<any>;
	export const Divider: Preact.FunctionalComponent<any>;
	export const Annotation: Preact.FunctionalComponent<any>;

	export const Text: Preact.FunctionalComponent<any>;
	export const Media: Preact.FunctionalComponent<any>;
	export const Color: Preact.FunctionalComponent<any>;
	export const Select: Preact.FunctionalComponent<any>;
	export const Numeric: Preact.FunctionalComponent<any>;
	export const Toggle: Preact.FunctionalComponent<any>;
	export const DateTime: Preact.FunctionalComponent<any>;

	// Media
	export const MediaIcon: Preact.FunctionalComponent<any>;
	export const MediaItem: Preact.FunctionalComponent<any>;
	export const MediaReplaceForm: Preact.FunctionalComponent<any>;
	export const MediaUploadForm: Preact.FunctionalComponent<any>;
	export const MediaUploadItem: Preact.FunctionalComponent<any>;
	export const MediaView: Preact.FunctionalComponent<any>;

	// Presentational
	export const Card: Preact.FunctionalComponent<any>;
	export const CardHeader: Preact.FunctionalComponent<any>;
	export const DimensionTransition: Preact.FunctionalComponent<any>;
	export const Meter: Preact.FunctionalComponent<any>;
	export const Modal: Preact.FunctionalComponent<any>;
	export const Popup: Preact.FunctionalComponent<any>;

	// Interactable
	export const Selectable: Preact.FunctionalComponent<any>;
	export const SelectGroup: Preact.FunctionalComponent<any>;
	export const SaveConfirmationModal: Preact.FunctionalComponent<any>;

	// Users
	export const UserCard: Preact.FunctionalComponent<any>;
	export const UserItem: Preact.FunctionalComponent<any>;
	export const UserRolesList: Preact.FunctionalComponent<any>;
	export const UserTag: Preact.FunctionalComponent<any>;
}
