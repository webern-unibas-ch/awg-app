import { TestBed, inject, async } from '@angular/core/testing';

import { Logos, Meta } from '@awg-core/core-models';
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

    describe('#getLogos', () => {
        it(`... should return LOGOS`, () => {
            // call service function
            expect(coreService.getLogos()).toBe(expectedLogosData, `should be ${expectedLogosData}`);
        });
    });
});
