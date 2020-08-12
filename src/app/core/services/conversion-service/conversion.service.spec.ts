/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { AppModule } from '@awg-app/app.module';

import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    let conversionService: ConversionService;

    // TODO: add APP_BASE_HREF , see https://angular.io/api/common/APP_BASE_HREF

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule],
            providers: [ConversionService]
        });
        conversionService = TestBed.inject(ConversionService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', inject([ConversionService], (service: ConversionService) => {
        expect(service).toBeTruthy();
    }));
});
