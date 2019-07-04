import { TestBed, inject, async } from '@angular/core/testing';

import { Logos, Meta, MetaSectionKey } from '@awg-core/core-models';
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
        // inject services and http client handler
        coreService = TestBed.get(CoreService);

        // test data
        expectedMetaData = METADATA;
        expectedLogosData = LOGOSDATA;
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
            const metaKey = MetaSectionKey.page;

            // call service function
            expect(coreService.getMetaDataSection(metaKey)).toBe(
                expectedMetaData[metaKey],
                `should be ${expectedMetaData[metaKey]}`
            );
        });

        it(`... should return edition METADATA if parameter is given`, () => {
            const metaKey = MetaSectionKey.edition;

            // call service function
            expect(coreService.getMetaDataSection(metaKey)).toBe(
                expectedMetaData[metaKey],
                `should be ${expectedMetaData[metaKey]}`
            );
        });

        it(`... should return structure METADATA if parameter is given`, () => {
            const metaKey = MetaSectionKey.structure;

            // call service function
            expect(coreService.getMetaDataSection(metaKey)).toBe(
                expectedMetaData[metaKey],
                `should be ${expectedMetaData[metaKey]}`
            );
        });

        it(`... should return contact METADATA if parameter is given`, () => {
            const metaKey = MetaSectionKey.contact;

            // call service function
            expect(coreService.getMetaDataSection(metaKey)).toBe(
                expectedMetaData[metaKey],
                `should be ${expectedMetaData[metaKey]}`
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
