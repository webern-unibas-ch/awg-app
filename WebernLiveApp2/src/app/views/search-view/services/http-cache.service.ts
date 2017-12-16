import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';


abstract class HttpCache {
    /**
     * Returns a cached response, if any, or null if not present.
     */
    abstract get(req: HttpRequest<any>): HttpResponse<any>|null;

    /**
     * Adds or updates the response in the cache.
     */
    abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

@Injectable()
export class HttpCacheService implements HttpCache {

    constructor() { }

    cachedResponses = {};

    get(req: HttpRequest<any>): HttpResponse<any>|null {
        console.log('HttpCacheService#cachedResponses: ', this.cachedResponses);
        console.log('HttpCacheService#get req: ', req);
        const returnValue = this.cachedResponses ? this.cachedResponses[req.urlWithParams] : null;
        console.log('HttpCacheService#get returnValue: ', returnValue);
        return returnValue;
        /*
        const searchString = HttpCacheService.getSearchString(req);
        const cacheResponse = this.rcsCache.lookup(searchString);
        return cacheResponse ? new HttpResponse({ body: cacheResponse }) : cacheResponse;
        */
    }

    /**
     * Adds or updates the response in the cache.
     */
    put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
        console.log('HttpCacheService#cachedResponses: ', this.cachedResponses);
        console.log('HttpCacheService#put req, resp: ', req, resp);
        this.cachedResponses[req.urlWithParams] = resp;
    }
}
