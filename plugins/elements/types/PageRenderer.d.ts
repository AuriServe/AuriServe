import { Page } from 'common';
import Element from './Element';
export declare class RenderError extends Error {
    readonly code: number;
    constructor(...params: any[]);
}
export default class PageBuilder {
    private registeredElements;
    /**
     * Handles generating and expanding pages.
     * Can create an HTML representation of a page,
     * or return an expanded JSON representation with includes included.
     */
    constructor(registeredElements: Map<string, Element>);
    /**
     * Initializes the PagesManager,
     * creates the pages directory if it doesn't exist already.
     */
    /**
     * Attempts to render a page given a URL.
     *
     * @param url - The URL of the page to render, without the domain.
     * @returns a promise resolving to the rendered HTML, or rejecting to an error.
     */
    render(page: Page.PageDocument, _cookies: Record<string, string>): Promise<string>;
    /**
     * Returns a page that has been prepared for use.
     * Throws if there is no page at the requested path.
     *
     * @param page - The page to expand.
     */
    preparePage(page: Page.PageDocument): Promise<Page.PageDocument>;
    /**
     * Renders an error page, returning an error code and an HTML document.
     *
     * @param url - The error to display.
     * @returns the error status code and the error HTML page.
     */
    renderError(error: RenderError): Promise<string>;
    /**
     * Renders an element tree into HTML.
     *
     * @param page - The path of the page to render.
     * @param root - The root element to render.
     * @returns the rendered HTML as a string.
     */
    private renderTree;
    /**
     * Creates Preact elements recursively, starting at the provided element.
     * Throws if the page or page includes do not exist.
     *
     * @param child - The root element to render, must be expanded.
     * @param pathRoot - The path that includes are relative to.
     * @returns a Preact VNode representing the root of the tree.
     */
    private createTree;
    /**
     * Recursively expands includes in a tree.
     * Directly manipulates the passed-in object, does not return anything.
     * Throws if the required includes do not exist.
     *
     * @param elem - The root element to expand.
     * @param pathRoot - The path that includes are relative to.
     */
    private includeTree;
    /**
     * Recursively exposes a page, storing named references to all elements containing
     * an 'exposeAs' key. Returns a key-value map of the elements organized by tree.
     *
     * @param page - The page to expose.
     */
    private exposePage;
    /**
     * Recursively exposes a tree, storing named references to all elements containing
     * an 'exposeAs' key. Returns a key-value map of the elements.
     *
     * @param elem - The root element to expand.
     */
    private exposeTree;
    /**
     * Recursively parses the properties of an element tree.
     * Directly manipulates the passed-in object, does not return anything.
     *
     * @param tree - The identifier of the tree that is being expanded.
     * @param elem - The root element to expand.
     * @param media - The current SiteData media array.
     * @param exposed - The tree's exposed map.
     */
    private parseTree;
    /**
     * Expands an include into a tree, overriding exposed properties with include props.
     * Throws the requested include doesn't exist.
     *
     * @param include - The include to be expanded.
     * @param pathRoot - The path that includes are relative to.
     * @returns a page element representing the expanded include root.
     */
    private expandInclude;
    /**
     * Recursively overrides template children exposed props with include override props.
     * Manipulates the passed in elemDef, does not return anything.
     *
     * @param elemDef - The element to override with properties.
     * @param includeOverrides - The include override props to use.
     */
    private overrideTree;
    /**
     * Reads a Prop Ref and returns a list of keys.
     *
     * @param ref - The prop ref to parse.
     */
    private parsePropRef;
    /**
     * Applies transformations to a non-trivial property,
     * e.g. filling out a media prop with the rest of the fields.
     *
     * @param props - The property to parse.
     * @param media - The current SiteData media array.
     * @param myTree - The tree the prop is contained in.
     * @param exposedMap - A map of exposed props.
     *
     * @returns the modified property.
     */
    private parseProp;
    /**
     * Applies transformations to non-trivial properties, modifying the table directly.
     * e.g. filling out a media prop with the rest of the fields.
     *
     * @param prop - The props table to parse through.
     * @param media - The current SiteData media array.
     * @param tree - The tree the props are contained in.
     * @param exposedMap - A map of exposed props.
     */
    private parseProps;
}
