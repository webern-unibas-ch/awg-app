import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

abstract class HttpCache {
    /**
     * Returns a cached response, if any, or null if not present.
     */
    abstract get(req: HttpRequest<any>): HttpResponse<any> | null;

    /**
     * Adds or updates the response in the cache.
     */
    abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

@Injectable({
    providedIn: 'root'
})
export class HttpCacheService implements HttpCache {
    constructor() {}

    private cachedResponses = new Map<string, HttpResponse<any>>();

    get(req: HttpRequest<any>): HttpResponse<any> | null {
        return this.cachedResponses ? this.cachedResponses[req.urlWithParams] : null;
    }

    put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
        this.cachedResponses[req.urlWithParams] = resp.clone();
    }
}
