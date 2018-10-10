/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';

import { AppModule } from '@awg-app/app.module';
import { AppRoutingModule } from '@awg-app/app-routing.module';
import { ApiService } from './api.service';

describe('ApiService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, AppRoutingModule],
            providers: [ApiService]
        });
    });

    it('should ...', inject([ApiService], (service: ApiService) => {
        expect(service).toBeTruthy();
    }));
});
