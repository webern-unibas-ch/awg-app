import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToEqual } from '@testing/expect-helper';

import { META_DATA } from '../../data/meta.data';
import { Meta, MetaSectionTypes } from '../../models/meta.model';

import { CoreService } from './core.service';

describe('CoreService (DONE)', () => {
    let coreService: CoreService;

    let expectedMetaData: Meta;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CoreService],
        });

        // Inject services
        coreService = TestBed.inject(CoreService);

        // Test data
        expectedMetaData = META_DATA;
    });

    it('... should inject', () => {
        expect(coreService).toBeTruthy();
    });

    describe('#getMetaData()', () => {
        it('... should have a method `getMetaData`', () => {
            expect(coreService.getMetaData).toBeDefined();
        });

        it('... should return META_DATA', () => {
            // Call service function
            expectToEqual(coreService.getMetaData(), expectedMetaData);
        });
    });

    describe('#getMetaDataSection()', () => {
        it('... should have a method `getMetaDataSection`', () => {
            expect(coreService.getMetaDataSection).toBeDefined();
        });

        it('... should return page META_DATA if parameter is given', () => {
            const pageMetaSection = MetaSectionTypes.page;

            const actualMetaData = coreService.getMetaDataSection(pageMetaSection);

            expectToEqual(actualMetaData, expectedMetaData[pageMetaSection]);
        });

        it('... should return structure META_DATA if parameter is given', () => {
            const structureMetaSection = MetaSectionTypes.structure;

            const actualMetaData = coreService.getMetaDataSection(structureMetaSection);

            expectToEqual(actualMetaData, expectedMetaData[structureMetaSection]);
        });

        it('... should return contact META_DATA if parameter is given', () => {
            const contactMetaSection = MetaSectionTypes.contact;

            const actualMetaData = coreService.getMetaDataSection(contactMetaSection);

            expectToEqual(actualMetaData, expectedMetaData[contactMetaSection]);
        });
    });
});
