import { HttpRequest, HttpResponse } from '@angular/common/http';

/**
 * The internal IMockCache interface.
 *
 * It represents a mocked cache.
 */
interface IMockCache {
    put: (req: HttpRequest<any>, resp: HttpResponse<any>) => void;
    get: (req: HttpRequest<any>) => HttpResponse<any> | null;
    clear: () => void;
}

/**
 * Internal variable: cachedResponses.
 *
 * It keeps the HTTP responses.
 */
let cachedResponses: Map<string, HttpResponse<any>> = new Map<string, HttpResponse<any>>();

/**
 * Test helper: mockCache.
 *
 * It mocks the cache to catch cached HTTP responses.
 */
export const mockCache: IMockCache = {
    put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
        cachedResponses.set(req.urlWithParams, resp.clone());
    },
    get(req: HttpRequest<any>): HttpResponse<any> | null {
        return cachedResponses && cachedResponses.has(req.urlWithParams)
            ? cachedResponses.get(req.urlWithParams)
            : null;
    },
    clear(): void {
        cachedResponses = new Map<string, HttpResponse<any>>();
    }
};
