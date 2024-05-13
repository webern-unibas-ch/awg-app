/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { mockSearchResponseJson } from '@testing/mock-data';

import { AppModule } from '@awg-app/app.module';

import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    let conversionService: ConversionService;

    // TODO: add APP_BASE_HREF , see https://angular.io/api/common/APP_BASE_HREF

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [ConversionService],
        });
        conversionService = TestBed.inject(ConversionService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(conversionService).toBeTruthy();
    });

    it('... should not have filteredOut before convertFullTextSearchResults call', () => {
        expect(conversionService.filteredOut).toBeUndefined();

        conversionService.convertFullTextSearchResults(mockSearchResponseJson);

        expect(conversionService.filteredOut).toBeDefined();
    });

    describe('#replaceParagraphTags', () => {
        it('... should have a static method `replaceParagraphTags`', () => {
            expect(ConversionService.replaceParagraphTags).toBeDefined();
        });

        it('... should replace paragraph tags correctly', () => {
            const str = '<p>Hello</p><p>World</p>';
            const expected = 'Hello<br />World';
            const result = ConversionService.replaceParagraphTags(str);
            expect(result).toEqual(expected);
        });

        it('... should return undefined if input is falsy', () => {
            const str = undefined;
            const result = ConversionService.replaceParagraphTags(str);
            expect(result).toBeUndefined();
        });
    });
});
