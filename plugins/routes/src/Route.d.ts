import type { Req } from './Routes';
export interface Route {
    getPath(): string;
    canAdd(): boolean;
    add(pathSegment: string, route: Route): Route;
    get(path: string): Route | null;
    req(req: Req): string | null;
}
export declare abstract class BaseRoute implements Route {
    protected path: string;
    protected children: Map<string, Route>;
    constructor(path: string);
    getPath(): string;
    canAdd(): boolean;
    add(pathSegment: string, route: Route): Route;
    get(path: string): Route | null;
    req(req: Req): string | null;
    abstract render(req: Req): string;
}
