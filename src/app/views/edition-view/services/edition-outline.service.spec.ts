/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToEqual } from '@testing/expect-helper';
import { mockEditionOutline } from '@testing/mock-data/mockEditionOutline';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';

import { EditionOutlineService } from './edition-outline.service';

describe('EditionOutlineService', () => {
    let expectedEditionOutline: EditionOutlineSeries[];
    let expectedEditionSeries: EditionOutlineSeries;
    let expectedEditionSeriesRoute: string;
    let expectedEditionSection: EditionOutlineSection;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Test data
        expectedEditionOutline = JSON.parse(JSON.stringify(mockEditionOutline));
        expectedEditionSeriesRoute = EDITION_ROUTE_CONSTANTS.EDITION.route + EDITION_ROUTE_CONSTANTS.SERIES.route;
        expectedEditionSeries = expectedEditionOutline[0];
        expectedEditionSection = expectedEditionOutline[0].sections[0];
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(EditionOutlineService).toBeTruthy();
    });

    it('... should have `_editionOutline`', () => {
        expect((EditionOutlineService as any)._editionOutline).toBeTruthy();
    });

    describe('#getEditionOutline()', () => {
        it('... should have a method `getEditionOutline`', () => {
            expect(EditionOutlineService.getEditionOutline).toBeDefined();
        });

        it('... should return editionOutline', () => {
            const outline = EditionOutlineService.getEditionOutline();

            expectToEqual(outline, expectedEditionOutline);
        });
    });

    describe('EditionSeries', () => {
        describe('#getEditionSeriesById()', () => {
            it('... should have a method `getEditionSeriesById`', () => {
                expect(EditionOutlineService.getEditionSeriesById).toBeDefined();
            });

            it('... should return editionSeries with given id', () => {
                const series = EditionOutlineService.getEditionSeriesById(EDITION_ROUTE_CONSTANTS.SERIES_1.route);

                expectToEqual(series, expectedEditionSeries);
            });
        });
    });

    describe('EditionSection', () => {
        describe('#getEditionSectionById()', () => {
            it('... should have a method `getEditionSectionById`', () => {
                expect(EditionOutlineService.getEditionSectionById).toBeDefined();
            });

            it('... should return editionSection with given id', () => {
                expectedEditionOutline[0].sections.forEach((section, index) => {
                    expectedEditionSection = section;

                    const getSection = EditionOutlineService.getEditionSectionById(
                        EDITION_ROUTE_CONSTANTS.SERIES_1.route,
                        EDITION_ROUTE_CONSTANTS[`SECTION_${index + 1}`].route
                    );

                    expectToEqual(getSection, expectedEditionSection);
                });
            });
        });
    });
});
