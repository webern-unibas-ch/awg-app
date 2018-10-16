/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from '@awg-app/app.module';
import { AppRoutingModule } from '@awg-app/app-routing.module';

import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    let conversionService: ConversionService;

    // TODO: add APP_BASE_HREF , see https://angular.io/api/common/APP_BASE_HREF

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, AppRoutingModule, RouterTestingModule],
            providers: [ConversionService]
        });
        conversionService = TestBed.get(ConversionService);
    });

    it('should inject', inject([ConversionService], (service: ConversionService) => {
        expect(service).toBeTruthy();
    }));
});
