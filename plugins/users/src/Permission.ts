export interface Permission {
	identifier: string;
	name: string;
	category: string;
	description?: string;

	default: boolean;
}

export enum PermissionCategoryPriority {
	MIN = 1,
	LOW = 2,
	NORMAL = 3,
	HIGH = 4,
	MAX = 5,
}

export interface PermissionCategory {
	identifier: string;
	name: string;
	description?: string;
	icon: string;
	priority: PermissionCategoryPriority;
}

export type PermissionCategoryArgument = Omit<
	PermissionCategory,
	'name' | 'icon' | 'priority'
> &
	Partial<PermissionCategory>;

export type PermissionArgument = Omit<Permission, 'name' | 'category' | 'default'> &
	Partial<Permission>;
