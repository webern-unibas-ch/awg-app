import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { describe, expect, it } from 'vitest';

import { getInterceptorInstance } from './interceptor-helper';

class FirstInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req);
    }
}

class SecondInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req);
    }
}

describe('interceptorHelper: getInterceptorInstance', () => {
    it('... should return the interceptor instance if the requested type exists', () => {
        const firstInterceptor = new FirstInterceptor();
        const secondInterceptor = new SecondInterceptor();
        const interceptors: HttpInterceptor[] = [firstInterceptor, secondInterceptor];

        const found = getInterceptorInstance(interceptors, SecondInterceptor);

        expect(found).toBeDefined();
        expect(found).toBe(secondInterceptor);
    });

    it('... should return null if no interceptor matches the requested type (else path)', () => {
        const firstInterceptor = new FirstInterceptor();
        const interceptors: HttpInterceptor[] = [firstInterceptor];

        const found = getInterceptorInstance(interceptors, SecondInterceptor);

        expect(found).toBeNull();
    });

    it('... should return null for an empty interceptor list', () => {
        const found = getInterceptorInstance([], SecondInterceptor);

        expect(found).toBeNull();
    });
});
