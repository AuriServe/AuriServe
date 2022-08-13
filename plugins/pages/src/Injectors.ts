export type InjectorSection = 'head' | 'body_start' | 'body_end';

export type InjectorFunction = () => string | Promise<string>;

export const registeredInjectors: Record<InjectorSection, Set<InjectorFunction>> = {
	head: new Set(),
	body_start: new Set(),
	body_end: new Set(),
}

export function addInjector(section: InjectorSection, injector: InjectorFunction): InjectorFunction {
	registeredInjectors[section].add(injector);
	return injector;
}

export function removeInjector(section: InjectorSection, injector: InjectorFunction) {
	if (!registeredInjectors[section].has(injector)) return false;
	registeredInjectors[section].delete(injector);
	return true;
}
