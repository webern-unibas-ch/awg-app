/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';

import { AppModule } from '@awg-app/app.module';
import { AppRoutingModule } from '@awg-app/app-routing.module';

import { ApiService } from '@awg-core/services/api-service';
import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, AppRoutingModule],
            providers: [ApiService, ConversionService]
        });
    });

    it('should ...', inject([ConversionService], (service: ConversionService) => {
        expect(service).toBeTruthy();
    }));
});
