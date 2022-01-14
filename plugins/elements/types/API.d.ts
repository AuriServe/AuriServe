import Page from './Page';
import Layout from './Layout';
import Element from './Element';
import PreactRoute from './PreactRoute';
export default interface API {
    PreactRoute: typeof PreactRoute;
    renderPage(page: Page): Promise<string>;
    registeredLayouts: Map<string, Layout>;
    registerLayout(layout: Layout): void;
    unregisterLayout(identifier: string): void;
    registeredElements: Map<string, Element>;
    registerElement(element: Element): void;
    unregisterElement(identifier: string): void;
}
declare global {
    export interface AuriServeAPI {
        elements: API;
    }
}
