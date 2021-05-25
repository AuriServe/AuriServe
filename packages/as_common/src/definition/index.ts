/*
* Element Type
*/

export type T = any;

/*
* Props
*/

export type Prop = FieldProp | TableProp | ArrayProp;

export interface FieldProp {
	name?: string;
	optional?: true;
	default?: any;
	type: PropType | PropsTable | PropType[] | PropsTable[];
}

export interface TableProp {
	name?: string;
	optional?: true;

	fields: PropsTable;
}

export interface ArrayProp {
	name?: string;
	optional?: true;

	entries: PropType | PropsTable | PropType[] | PropsTable[];
}

export interface PropsTable {
	[key: string]: Prop;
};

/*
* Property Type Hints
*/

export type BasePrimitivePropType =
	'text' | 'long_text' | 'number' | 'date' | 'time' | 'datetime' | 'boolean' | 'color' | 'url' | 'html' | string[] /* Enum */;

export type PrimitivePropType =
	BasePrimitivePropType | 'text:markdown' | 'long_text:markdown' | 'url:image'

export type BaseAuriServePropType =
	'media' | 'page';

export type AuriServePropType =
	BaseAuriServePropType | 'media:image';

export type PropType =
	PrimitivePropType | AuriServePropType | 'custom'

/*
* Configuration Object
*/

export interface DefinitionConfig {
	name?: string;
	props: PropsTable;
}

/*
* Definitions
*/

export interface ServerDefinition {
	identifier: string;
	element: T;
	config: DefinitionConfig;
}

export interface ClientDefinition {
	identifier: string;
	element: T;
}

export interface AdminDefinition extends ServerDefinition {
	editing?: {
		propertyEditor?: T | true;
		inlineEditor?: T;
	};
}
