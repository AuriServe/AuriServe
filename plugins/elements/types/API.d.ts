import Tree from './Tree';
import Element from './Element';
export default interface API {
    renderTree(tree: Tree): Promise<string>;
    registeredElements: Map<string, Element>;
    registerElement(element: Element): void;
    unregisterElement(identifier: string): void;
}
declare global {
    export interface AuriServeAPI {
        elements: API;
    }
}
