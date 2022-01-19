import type Req from './Req';
export interface Route {
    getPath(): string;
    canAdd(): boolean;
    add(pathSegment: string, route: Route): Route;
    get(path: string): Promise<Route | null>;
    req(req: Req): Promise<string | null>;
}
export declare abstract class BaseRoute implements Route {
    protected path: string;
    protected children: Map<string, Route>;
    constructor(path: string);
    getPath(): string;
    canAdd(): boolean;
    add(pathSegment: string, route: Route): Route;
    get(path: string): Promise<Route | null>;
    req(req: Req): Promise<string | null>;
    abstract render(req: Req): Promise<string>;
}
