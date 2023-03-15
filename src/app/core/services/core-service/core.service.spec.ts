import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { LOGOSDATA, METADATA } from '@awg-core/core-data';
import { Logos, Meta, MetaSectionTypes } from '@awg-core/core-models';

import { CoreService } from './core.service';

describe('CoreService (DONE)', () => {
    let coreService: CoreService;

    let expectedMetaData: Meta;
    let expectedLogosData: Logos;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CoreService],
        });
        // Inject service
        coreService = TestBed.inject(CoreService);

        // Test data
        expectedMetaData = METADATA;
        expectedLogosData = LOGOSDATA;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should inject', () => {
        expect(coreService).toBeTruthy();
    });

    describe('#getMetaData()', () => {
        it('... should have a method `getMetaData`', () => {
            expect(coreService.getMetaData).toBeDefined();
        });

        it('... should return METADATA', () => {
            // Call service function
            expect(coreService.getMetaData()).withContext(`should be ${expectedMetaData}`).toBe(expectedMetaData);
        });
    });

    describe('#getMetaDataSection()', () => {
        it('... should have a method `getMetaDataSection`', () => {
            expect(coreService.getMetaDataSection).toBeDefined();
        });

        it('... should return page METADATA if parameter is given', () => {
            const metaSection = MetaSectionTypes.page;

            // Call service function
            expect(coreService.getMetaDataSection(metaSection))
                .withContext(`should be ${expectedMetaData[metaSection]}`)
                .toBe(expectedMetaData[metaSection]);
        });

        it('... should return structure METADATA if parameter is given', () => {
            const metaSection = MetaSectionTypes.structure;

            // Call service function
            expect(coreService.getMetaDataSection(metaSection))
                .withContext(`should be ${expectedMetaData[metaSection]}`)
                .toBe(expectedMetaData[metaSection]);
        });

        it('... should return contact METADATA if parameter is given', () => {
            const metaSection = MetaSectionTypes.contact;

            // Call service function
            expect(coreService.getMetaDataSection(metaSection))
                .withContext(`should be ${expectedMetaData[metaSection]}`)
                .toBe(expectedMetaData[metaSection]);
        });
    });

    describe('#getLogos()', () => {
        it('... should have a method `getLogos`', () => {
            expect(coreService.getLogos).toBeDefined();
        });

        it('... should return LOGOS', () => {
            // Call service function
            expect(coreService.getLogos()).withContext(`should be ${expectedLogosData}`).toBe(expectedLogosData);
        });
    });
});
