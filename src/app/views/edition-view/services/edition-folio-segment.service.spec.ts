import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import * as D3_SELECTION from 'd3-selection';

import { expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import { calculateFolioSvgData, FolioSettings } from '@awg-views/edition-view/models/folio-calculation.model';
import { FolioSvgContentSegment, FolioSvgData } from '@awg-views/edition-view/models/folio-svg-data.model';

import { EditionFolioDrawingService } from './edition-folio-drawing.service';
import { EditionFolioSegmentService } from './edition-folio-segment.service';

describe('EditionFolioSegmentService (DONE)', () => {
    let folioSegmentService: EditionFolioSegmentService;
    let folioDrawingService: EditionFolioDrawingService;

    let expectedFolioSvgData: FolioSvgData;

    /**
     * Renders the given svg data into a new svg root group (via the EditionFolioDrawingService)
     * and returns the root group selection.
     */
    const render = (svgData: FolioSvgData): D3Selection => {
        const rootGroup = D3_SELECTION.create('svg').append('g') as unknown as D3Selection;
        folioDrawingService.renderFolio(rootGroup, svgData);
        return rootGroup;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionFolioDrawingService, EditionFolioSegmentService],
        });

        folioSegmentService = TestBed.inject(EditionFolioSegmentService);
        folioDrawingService = TestBed.inject(EditionFolioDrawingService);

        // Test data
        const folioSettings: FolioSettings = {
            factor: 1.5,
            formatX: 175,
            formatY: 270,
            initialOffsetX: 5,
            initialOffsetY: 5,
        };
        const folio = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0].folios[0]);
        expectedFolioSvgData = calculateFolioSvgData(folioSettings, folio, 4);
    });

    it('... should inject', () => {
        expect(folioSegmentService).toBeTruthy();
    });

    describe('#getContentSegment', () => {
        let rootGroup: D3Selection;
        let contentSegmentGroup: Element;

        beforeEach(() => {
            rootGroup = render(expectedFolioSvgData);
            contentSegmentGroup = rootGroup.select('g.content-segment-group').node() as Element;
        });

        it('... should have a method `getContentSegment`', () => {
            expect(folioSegmentService.getContentSegment).toBeDefined();
        });

        describe('... should return the content segment of the hit content segment group if the target is', () => {
            it('... the content segment group', () => {
                expectToEqual(
                    folioSegmentService.getContentSegment(contentSegmentGroup),
                    expectedFolioSvgData.contentSegments[0]
                );
            });

            it('... the polygon of the content segment link', () => {
                const polygon = contentSegmentGroup.querySelector('a.content-segment-link polygon');

                expectToEqual(folioSegmentService.getContentSegment(polygon), expectedFolioSvgData.contentSegments[0]);
            });

            it('... the label text of the content segment link', () => {
                const text = contentSegmentGroup.querySelector('a.content-segment-link text');

                expectToEqual(folioSegmentService.getContentSegment(text), expectedFolioSvgData.contentSegments[0]);
            });
        });

        describe('... should return undefined if the target is', () => {
            it('... outside of a content segment group', () => {
                const sheetGroup = rootGroup.select('g.sheet-group').node() as Element;

                expect(folioSegmentService.getContentSegment(sheetGroup)).toBeUndefined();
            });

            it('... not an element', () => {
                expect(folioSegmentService.getContentSegment(new EventTarget())).toBeUndefined();
            });

            it('... null', () => {
                expect(folioSegmentService.getContentSegment(null)).toBeUndefined();
            });
        });
    });

    describe('#updateActiveContentSegment', () => {
        let rootGroup: D3Selection;

        const getActiveSegmentIds = (): string[] =>
            rootGroup
                .selectAll<SVGGElement, FolioSvgContentSegment>('g.content-segment-group.active')
                .data()
                .map(contentSegment => contentSegment.sheetIds.sheetId);

        beforeEach(() => {
            rootGroup = render(expectedFolioSvgData);
        });

        it('... should have a method `updateActiveContentSegment`', () => {
            expect(folioSegmentService.updateActiveContentSegment).toBeDefined();
        });

        it('... should set the class `active` on the content segment group with the given id', () => {
            const expectedSegmentId = expectedFolioSvgData.contentSegments[1].sheetIds.sheetId;

            folioSegmentService.updateActiveContentSegment(rootGroup, expectedSegmentId);

            expectToEqual(getActiveSegmentIds(), [expectedSegmentId]);
        });

        it('... should remove the class `active` from the previously active content segment group', () => {
            const expectedSegmentId = expectedFolioSvgData.contentSegments[1].sheetIds.sheetId;
            folioSegmentService.updateActiveContentSegment(
                rootGroup,
                expectedFolioSvgData.contentSegments[0].sheetIds.sheetId
            );

            folioSegmentService.updateActiveContentSegment(rootGroup, expectedSegmentId);

            expectToEqual(getActiveSegmentIds(), [expectedSegmentId]);
        });

        it('... should not set the class `active` on any content segment group for an unknown id', () => {
            folioSegmentService.updateActiveContentSegment(rootGroup, 'unknown');

            expectToEqual(getActiveSegmentIds(), []);
        });
    });
});
