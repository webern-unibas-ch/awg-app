import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

/**
 * The abstract class HttpCache.
 *
 * It provides abstract methods (get, put) to handle cached http responses.
 */
abstract class HttpCache {
    /**
     * Abstract getter for a cached response.
     *
     * @param {HttpRequest<any>} req An HttpRequest to be checked for.
     *
     * @returns {HttpResponse<any> | null} A cached response, if any, or null if not present.
     */
    abstract get(req: HttpRequest<any>): HttpResponse<any> | null;

    /**
     * Abstract setter for a cached response.
     *
     * @param {HttpRequest<any>} req An HttpRequest to be used as an index.
     * @param {HttpResponse<any>} resp The HttpResponse to be stored.
     *
     * @returns {void} Adds or updates the response in the cache.
     */
    abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

/**
 * The HttpCache service.
 *
 * It implements the abstract class {@link HttpCache}
 * and handles cached http responses.
 */
@Injectable({
    providedIn: 'root'
})
export class HttpCacheService implements HttpCache {
    /**
     * Private variable: cachedResponses.
     *
     * It keeps the cachedResponses as `Map`s of a `string`
     * (i.e. an `HttpRequest.urlWithParams`) and an `HttpResponse`.
     */
    private cachedResponses: Map<string, HttpResponse<any>> = new Map<string, HttpResponse<any>>();

    /**
     * Getter for a cached response.
     *
     * Uses the `urlWithParams` of an HttpRequest to identify a request.
     *
     * @param {HttpRequest<any>} req An HttpRequest to be checked for in the cached responses.
     *
     * @returns {HttpResponse<any> | null} A cached response or null.
     */
    get(req: HttpRequest<any>): HttpResponse<any> | null {
        return this.cachedResponses && this.cachedResponses.has(req.urlWithParams)
            ? this.cachedResponses.get(req.urlWithParams)
            : null;
    }

    /**
     * Setter for a cached response.
     *
     * Uses the `urlWithParams` of an HttpRequest to identify a request.
     *
     * @param {HttpRequest<any>} req An HttpRequest to be used as an index in the cached responses.
     * @param {HttpResponse<any>} resp The HttpResponse to be stored at this index position in the cached responses.
     *
     * @returns {void} Caches the response.
     */
    put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
        this.cachedResponses.set(req.urlWithParams, resp.clone());
    }
}
