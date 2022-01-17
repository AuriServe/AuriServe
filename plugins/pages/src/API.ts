import PageRoute from './PageRoute';
import { Node, Page } from './Interface';

type InjectorSection = 'head' | 'body_start' | 'body_end';

type InjectorFunction = () => Promise<string>;

export default interface API {
	PageRoute: typeof PageRoute;

	registeredLayouts: Map<string, string>;

	registerLayout(identifier: string, layout: string): void;

	unregisterLayout(identifier: string): boolean;

	registeredInjectors: Record<InjectorSection, Set<InjectorFunction>>;

	addInjector(section: InjectorSection, injector: InjectorFunction): void;

	removeInjector(section: InjectorSection, injector: InjectorFunction): boolean;

	buildPage(page: Page): Promise<string>;

	populateLayout(identifier: string, sections: Record<string, Node>): Promise<string>;
}
