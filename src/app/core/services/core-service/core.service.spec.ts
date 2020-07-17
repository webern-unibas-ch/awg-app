import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { Logos, Meta, MetaSectionTypes } from '@awg-core/core-models';
import { METADATA, LOGOSDATA } from '@awg-core/mock-data';

import { CoreService } from './core.service';

describe('CoreService (DONE)', () => {
    let coreService: CoreService;

    let expectedMetaData: Meta;
    let expectedLogosData: Logos;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CoreService]
        });
        // inject service
        coreService = TestBed.inject(CoreService);

        // test data
        expectedMetaData = METADATA;
        expectedLogosData = LOGOSDATA;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should inject', () => {
        expect(coreService).toBeTruthy();
    });

    describe('#getMetaData', () => {
        it(`... should return METADATA`, () => {
            // call service function
            expect(coreService.getMetaData()).toBe(expectedMetaData, `should be ${expectedMetaData}`);
        });
    });

    describe('#getMetaDataSection', () => {
        it(`... should return page METADATA if parameter is given`, () => {
            const metaSection = MetaSectionTypes.page;

            // call service function
            expect(coreService.getMetaDataSection(metaSection)).toBe(
                expectedMetaData[metaSection],
                `should be ${expectedMetaData[metaSection]}`
            );
        });

        it(`... should return structure METADATA if parameter is given`, () => {
            const metaSection = MetaSectionTypes.structure;

            // call service function
            expect(coreService.getMetaDataSection(metaSection)).toBe(
                expectedMetaData[metaSection],
                `should be ${expectedMetaData[metaSection]}`
            );
        });

        it(`... should return contact METADATA if parameter is given`, () => {
            const metaSection = MetaSectionTypes.contact;

            // call service function
            expect(coreService.getMetaDataSection(metaSection)).toBe(
                expectedMetaData[metaSection],
                `should be ${expectedMetaData[metaSection]}`
            );
        });
    });

    describe('#getLogos', () => {
        it(`... should return LOGOS`, () => {
            // call service function
            expect(coreService.getLogos()).toBe(expectedLogosData, `should be ${expectedLogosData}`);
        });
    });
});
