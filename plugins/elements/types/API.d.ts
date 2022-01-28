import Tree from './Tree';
import Element from './Element';
export default interface API {
    renderTree(tree: Tree): Promise<string>;
    elements: Map<string, Element>;
    addElement(element: Element): void;
    removeElement(identifier: string): boolean;
    stylesheets: Set<string>;
    addStylesheet(filePath: string): void;
    removeStylesheet(filePath: string): boolean;
}
declare global {
    export interface AuriServeAPI {
        elements: API;
    }
}
