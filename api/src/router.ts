import type { Request as RawRequest, Response, NextFunction, RequestHandler as RawRequestHandler } from 'express';

export type Query = Record<string, string>;
export type Request = RawRequest<any, any, any, Query, Record<string, any>>;
export type RequestHandler = RawRequestHandler<any, any, any, Query, Record<string, any>>;
export type { Response, NextFunction };

export default interface Router {
	get: (path: string, handler: RequestHandler) => RequestHandler;

	post: (path: string, handler: RequestHandler) => RequestHandler;

	put: (path: string, handler: RequestHandler) => RequestHandler;

	delete: (path: string, handler: RequestHandler) => RequestHandler;

	patch: (path: string, handler: RequestHandler) => RequestHandler;

	all: (path: string, handler: RequestHandler) => RequestHandler;

	remove: (handler: RequestHandler) => void;
}

