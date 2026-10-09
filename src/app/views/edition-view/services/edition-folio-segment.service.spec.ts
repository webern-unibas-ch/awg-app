import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import * as D3_SELECTION from 'd3-selection';

import { expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { D3Selection } from '../models/d3-selection.model';
import { FolioSettings, FolioSvgContentSegment, FolioSvgData } from '../models/folio-svg-data.model';

import { EditionFolioDrawingService } from './edition-folio-drawing.service';
import { calculateFolioSvgData } from './edition-folio-drawing.utils';
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
        const rootGroupSelection = D3_SELECTION.create('svg').append('g') as unknown as D3Selection;
        folioDrawingService.renderFolio(rootGroupSelection, svgData);
        return rootGroupSelection;
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
        let rootGroupSelection: D3Selection;
        let contentSegmentGroupEl: Element;

        beforeEach(() => {
            rootGroupSelection = render(expectedFolioSvgData);
            contentSegmentGroupEl = rootGroupSelection.select('g.content-segment-group').node() as Element;
        });

        it('... should have a method `getContentSegment`', () => {
            expect(folioSegmentService.getContentSegment).toBeDefined();
        });

        describe('... should return the content segment of the hit content segment group if the target is', () => {
            it('... the content segment group', () => {
                expectToEqual(
                    folioSegmentService.getContentSegment(contentSegmentGroupEl),
                    expectedFolioSvgData.contentSegments[0]
                );
            });

            it('... the polygon of the content segment link', () => {
                const polygon = contentSegmentGroupEl.querySelector('g.content-segment polygon');

                expectToEqual(folioSegmentService.getContentSegment(polygon), expectedFolioSvgData.contentSegments[0]);
            });

            it('... the label text of the content segment link', () => {
                const text = contentSegmentGroupEl.querySelector('g.content-segment text');

                expectToEqual(folioSegmentService.getContentSegment(text), expectedFolioSvgData.contentSegments[0]);
            });
        });

        describe('... should return undefined if the target is', () => {
            it('... outside of a content segment group', () => {
                const sheetGroupEl = rootGroupSelection.select('g.sheet-group').node() as Element;

                expect(folioSegmentService.getContentSegment(sheetGroupEl)).toBeUndefined();
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
        let rootGroupSelection: D3Selection;

        const getActiveSegmentIds = (): string[] =>
            rootGroupSelection
                .selectAll<SVGGElement, FolioSvgContentSegment>('g.content-segment-group.active')
                .data()
                .map(contentSegment => contentSegment.sheetTarget.sheetId);

        beforeEach(() => {
            rootGroupSelection = render(expectedFolioSvgData);
        });

        it('... should have a method `updateActiveContentSegment`', () => {
            expect(folioSegmentService.updateActiveContentSegment).toBeDefined();
        });

        it('... should set the class `active` on the content segment group with the given id', () => {
            const expectedSegmentId = expectedFolioSvgData.contentSegments[1].sheetTarget.sheetId;

            folioSegmentService.updateActiveContentSegment(rootGroupSelection, expectedSegmentId);

            expectToEqual(getActiveSegmentIds(), [expectedSegmentId]);
        });

        it('... should remove the class `active` from the previously active content segment group', () => {
            const expectedSegmentId = expectedFolioSvgData.contentSegments[1].sheetTarget.sheetId;
            folioSegmentService.updateActiveContentSegment(
                rootGroupSelection,
                expectedFolioSvgData.contentSegments[0].sheetTarget.sheetId
            );

            folioSegmentService.updateActiveContentSegment(rootGroupSelection, expectedSegmentId);

            expectToEqual(getActiveSegmentIds(), [expectedSegmentId]);
        });

        it('... should not set the class `active` on any content segment group for an unknown id', () => {
            folioSegmentService.updateActiveContentSegment(rootGroupSelection, 'unknown');

            expectToEqual(getActiveSegmentIds(), []);
        });
    });
});
