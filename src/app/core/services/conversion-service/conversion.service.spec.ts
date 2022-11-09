/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { mockSearchResponseJson } from '@testing/mock-data';

import { AppModule } from '@awg-app/app.module';

import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    let conversionService: ConversionService;

    // TODO: add APP_BASE_HREF , see https://angular.io/api/common/APP_BASE_HREF

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule],
            providers: [ConversionService],
        });
        conversionService = TestBed.inject(ConversionService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(conversionService).toBeTruthy();
    });

    it('should not have filteredOut before convertFullTextSearchResults call', () => {
        expect(conversionService.filteredOut).toBeUndefined();

        conversionService.convertFullTextSearchResults(mockSearchResponseJson);

        expect(conversionService.filteredOut).toBeDefined();
    });
});
