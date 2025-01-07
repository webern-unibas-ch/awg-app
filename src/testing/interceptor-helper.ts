import { HttpInterceptor } from '@angular/common/http';

/**
 * Test helper function: getInterceptorInstance.
 *
 * It gets the instance of an HTTP Interceptor of a given type from the HTTP_INTERCEPTORS array.
 *
 * Cf. https://www.moritz-benzenhoefer.com/2018/09/angular-6-get-http-interceptor-instance-in-test/
 *
 * @param {HttpInterceptor[]} interceptors The given array of HTTP interceptors (e.g. TestBed.inject(HTTP_INTERCEPTORS))
 * @param {new (...args: any[]) => T} type The given type of the Interceptor.
 *
 * @returns {HttpInterceptor} An instance of the searched Interceptor.
 */
export function getInterceptorInstance<T extends HttpInterceptor>(
    interceptors: readonly HttpInterceptor[],
    type: new (...args: any[]) => T
): T | null {
    let searchedInterceptor: T | null = null;
    interceptors.forEach((interceptor: HttpInterceptor) => {
        if (interceptor instanceof type) {
            searchedInterceptor = interceptor;
        }
    });
    return searchedInterceptor;
}
