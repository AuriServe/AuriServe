import Page from './Page';
declare const PreactRoute_base: any;
export default class PreactRoute extends PreactRoute_base {
    readonly page: Page;
    constructor(path: string, page: Page);
    render(): Promise<string>;
}
export {};
