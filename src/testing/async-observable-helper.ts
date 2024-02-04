import { defer, Observable } from 'rxjs';

/**
 * Test helper function: asyncData.
 *
 * It creates an async observable of the input data
 * that emits-once and completes after a JS engine turn.
 *
 * @param {T} data The data input.
 * @returns {Observable<T>} A resolved data promise.
 */
export function asyncData<T>(data: T): Observable<T> {
    return defer(() => Promise.resolve(data));
}

/**
 * Test helper function: asyncError
 *
 * It creates an async observable error that
 * errors after a JS engine turn
 *
 * @param {any} errorObject The object to err.
 * @returns {Observable<any>} A rejected error promise.
 */
export function asyncError<T>(errorObject: any): Observable<any> {
    return defer(() => Promise.reject(errorObject));
}
