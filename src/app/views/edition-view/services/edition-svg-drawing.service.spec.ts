import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EditionSvgDrawingService } from './edition-svg-drawing.service';

import { D3Selection, EditionSvgOverlay, EditionSvgOverlayTypes } from '@awg-views/edition-view/models';

import * as d3_selection from 'd3-selection';

// Helper functions to create D3 selections
function createD3TestSvg(): D3Selection {
    const container: HTMLElement = document.createElement('div');

    // Test data
    return d3_selection.select(container).append('svg').attr('id', 'test-svg');
}

function createD3TestRootGroup(svg: D3Selection): D3Selection {
    svg.append('g').attr('class', 'svg-root');

    return svg.select('.svg-root');
}

function createD3TestTkkGroups(svgRootGroup: D3Selection, overlays: EditionSvgOverlay[]): D3Selection {
    overlays.forEach(overlay => {
        svgRootGroup.append('g').attr('class', 'tkk').attr('id', overlay.id);
    });

    return svgRootGroup;
}

describe('EditionSvgDrawingService', () => {
    let service: EditionSvgDrawingService;

    let expectedSvg: D3Selection;
    let expectedSvgRootGroup: D3Selection;
    let expectedOverlays: EditionSvgOverlay[];

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(EditionSvgDrawingService);

        // Test data
        expectedOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tkk-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tkk-2', true),
        ];

        expectedSvg = createD3TestSvg();
        expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
        createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
    });

    afterEach(function () {
        expectedSvgRootGroup.remove();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have `overlayFillColor = orange`', () => {
        expect(service.overlayFillColor).toBeDefined();
        expect(service.overlayFillColor).withContext(`should be orange`).toBe('orange');
    });

    it('should have `overlaySelectionFillColor = green`', () => {
        expect(service.overlaySelectionFillColor).toBeDefined();
        expect(service.overlaySelectionFillColor).withContext(`should be green`).toBe('green');
    });

    it('should have `linkBoxFillColor = #dddddd`', () => {
        expect(service.linkBoxFillColor).toBeDefined();
        expect(service.linkBoxFillColor).withContext(`should be #dddddd`).toBe('#dddddd');
    });

    it('should have `linkBoxHoverFillColor = #eeeeee`', () => {
        expect(service.linkBoxHoverFillColor).toBeDefined();
        expect(service.linkBoxHoverFillColor).withContext(`should be #eeeeee`).toBe('#eeeeee');
    });

    it('should have `_overlayBoxesOpacity = 0.3` (private)', () => {
        expect(service['_overlayBoxesOpacity']).toBeDefined();
        expect(service['_overlayBoxesOpacity']).withContext(`should be 0.3`).toBe(0.3);
    });

    it('should have `_overlayBoxAdditionalSpace = 5.5` (private)', () => {
        expect(service['_overlayBoxAdditionalSpace']).toBeDefined();
        expect(service['_overlayBoxAdditionalSpace']).withContext(`should be 5.5`).toBe(5.5);
    });

    it('should have `_overlayBoxCornerRadius = 2` (private)', () => {
        expect(service['_overlayBoxCornerRadius']).toBeDefined();
        expect(service['_overlayBoxCornerRadius']).withContext(`should be 2`).toBe(2);
    });

    describe('#createSvg()', () => {
        it('... should have a `createSvg()` method', () => {
            expect(service.createSvg).toBeDefined();
        });

        describe('... should do nothing if', () => {
            it('... no svgFilePath is provided', async () => {
                await expectAsync(
                    service.createSvg('', expectedSvg.node(), expectedSvgRootGroup.node())
                ).toBeResolvedTo(undefined);
            });

            it('... no svgElement is provided', async () => {
                await expectAsync(service.createSvg('test-path', null, expectedSvgRootGroup.node())).toBeResolvedTo(
                    undefined
                );
            });

            it('... no svgRootGroup is provided', async () => {
                await expectAsync(service.createSvg('test-path', expectedSvg.node(), null)).toBeResolvedTo(undefined);
            });
        });
    });

    describe('#createOverlayGroup()', () => {
        it('... should have a `createOverlayGroup()` method', () => {
            expect(service.createOverlayGroup).toBeDefined();
        });

        describe('... should do nothing if', () => {
            it('... no svgRootGroup is provided', () => {
                const rootGroup: D3Selection = null;
                const id = 'tkk-1';
                const dim = expectedSvgRootGroup.nodes()[0].getBBox();
                const type = 'tkk';

                const d3selections = service.createOverlayGroup(rootGroup, id, dim, type);

                expect(d3selections).toBeUndefined();
            });

            it('... no id is provided', () => {
                const rootGroup: D3Selection = expectedSvgRootGroup;
                const id = null;
                const dim = expectedSvgRootGroup.nodes()[0].getBBox();
                const type = 'tkk';

                const d3selections = service.createOverlayGroup(rootGroup, id, dim, type);

                expect(d3selections).toBeUndefined();
            });
        });
    });

    describe('#fillD3SelectionWithColor()', () => {
        it('... should have a `fillD3SelectionWithColor()` method', () => {
            expect(service.fillD3SelectionWithColor).toBeDefined();
        });

        describe('... should do nothing if', () => {
            it('... no D3 selection is provided', () => {
                const d3Selection: D3Selection = undefined;
                const color = 'red';
                service.fillD3SelectionWithColor(d3Selection, color);

                expect(d3Selection).toBeUndefined();
            });

            it('... no color is provided', () => {
                const d3Selection: D3Selection = expectedSvgRootGroup;
                const color = undefined;
                service.fillD3SelectionWithColor(d3Selection, color);

                expect(d3Selection).toBeDefined();
                expect(d3Selection.attr('fill')).toBeNull();
            });
        });

        it('... should fill the D3 selection with the provided color', () => {
            const d3Selection: D3Selection = expectedSvgRootGroup;
            const color = 'red';
            service.fillD3SelectionWithColor(d3Selection, color);

            expect(d3Selection).toBeDefined();
            expect(d3Selection.attr('fill')).toBe(color);
        });
    });

    describe('#getContainerDimensions()', () => {
        it('... should have a `getContainerDimensions()` method', () => {
            expect(service.getContainerDimensions).toBeDefined();
        });

        it('... should return an object with undefined width and height if container is not given', () => {
            let containerEl = null;
            let dim = service.getContainerDimensions(containerEl);

            expect(dim).toBeDefined();
            expect(dim.width).toBeUndefined();
            expect(dim.height).toBeUndefined();
            expect(dim).toEqual({ width: undefined, height: undefined });

            containerEl = undefined;
            dim = service.getContainerDimensions(containerEl);

            expect(dim).toBeDefined();
            expect(dim.width).toBeUndefined();
            expect(dim.height).toBeUndefined();
            expect(dim).toEqual({ width: undefined, height: undefined });
        });

        it('... should return an object with the correct dimensions for a given container', () => {
            const containerEl = new ElementRef(document.createElement('div'));
            const dim = service.getContainerDimensions(containerEl);

            expect(dim).toBeDefined();
            expect(dim.width).toBeDefined();
            expect(dim.height).toBeDefined();

            expect(dim.width)
                .withContext(`should be the width of the container`)
                .toBe(containerEl.nativeElement.clientWidth);
            expect(dim.height)
                .withContext(`should be the height of the container`)
                .toBe(containerEl.nativeElement.clientHeight);
            expect(dim).toEqual({
                width: containerEl.nativeElement.clientWidth,
                height: containerEl.nativeElement.clientHeight,
            });
        });
    });

    describe('#getD3SelectionById()', () => {
        it('... should have a `getD3SelectionById()` method', () => {
            expect(service.getD3SelectionById).toBeDefined();
        });

        it('... should return undefined if no svgRootGroup is provided', () => {
            let d3selections = service.getD3SelectionById(null, 'tkk-1');

            expect(d3selections).toBeUndefined();

            d3selections = service.getD3SelectionById(undefined, 'tkk-1');

            expect(d3selections).toBeUndefined();
        });

        it('... should return undefined if no id is provided', () => {
            let d3selections = service.getD3SelectionById(expectedSvgRootGroup, '');

            expect(d3selections).toBeUndefined();

            d3selections = service.getD3SelectionById(expectedSvgRootGroup, null);

            expect(d3selections).toBeUndefined();

            d3selections = service.getD3SelectionById(expectedSvgRootGroup, undefined);

            expect(d3selections).toBeUndefined();
        });

        it('... should return an empty array if svgRootGroup is provided, but given id is not found', () => {
            const d3selections = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-unknown');

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expect(d3selections.nodes().length).toBe(0);
        });

        it('... should return an array of D3 selections if svgRootGroup is provided and has given id ', () => {
            const d3selections = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-1');

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expect(d3selections.nodes().length).toBe(1);
            expect(d3selections.nodes()[0].id).toBe('tkk-1');

            const d3selections2 = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-2');

            expect(d3selections2).toBeDefined();
            expect(d3selections2.nodes()).toBeInstanceOf(Array);
            expect(d3selections2.nodes().length).toBe(1);
            expect(d3selections2.nodes()[0].id).toBe('tkk-2');
        });
    });

    describe('TODO: #getLinkBoxes()', () => {
        it('... should have a `getLinkBoxes()` method', () => {
            expect(service.getLinkBoxes).toBeDefined();
        });
    });

    describe('#getOverlayGroupRectSelection()', () => {
        it('... should have a `getOverlayGroupRectSelection()` method', () => {
            expect(service.getOverlayGroupRectSelection).toBeDefined();
        });

        describe('... should return undefined if', () => {
            it('... no svgRootGroup is provided', () => {
                let d3selections = service.getOverlayGroupRectSelection(null, 'tkk-1', 'tkk');

                expect(d3selections).toBeUndefined();

                d3selections = service.getOverlayGroupRectSelection(undefined, 'tkk-1', 'tkk');

                expect(d3selections).toBeUndefined();
            });

            it('... no id is provided', () => {
                let d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, null, 'tkk');

                expect(d3selections).toBeUndefined();

                d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, undefined, 'tkk');

                expect(d3selections).toBeUndefined();

                d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, '', 'tkk');

                expect(d3selections).toBeUndefined();
            });

            it('... no type is provided', () => {
                let d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', null);

                expect(d3selections).toBeUndefined();

                d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', undefined);

                expect(d3selections).toBeUndefined();

                d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', '');

                expect(d3selections).toBeUndefined();
            });
        });

        describe('... should return an empty array if', () => {
            it('... all inputs are provided, but has no overlay group box', () => {
                const d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', 'tkk');

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expect(d3selections.nodes().length).toBe(0);
            });

            it('... all inputs are provided, but has no overlay group box with given type', () => {
                const tkkGroups = service.getTkkGroups(expectedSvgRootGroup);
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();
                const expectedType = 'tkk';
                const otherType = 'other-type';

                service.createOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions, expectedType);

                const d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', otherType);

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expect(d3selections.nodes().length).toBe(0);
            });
        });

        it('... should return an array of D3 selections if all inputs are provided and has overlay group box with given type', () => {
            const tkkGroups = service.getTkkGroups(expectedSvgRootGroup);
            const expectedDimensions = tkkGroups.nodes()[0].getBBox();
            const expectedType = 'tkk';

            service.createOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions, expectedType);

            const d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', expectedType);

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expect(d3selections.nodes().length).toBe(1);
            expect(d3selections.nodes()[0].classList).toContain(`${expectedType}-overlay-group-box`);
        });
    });

    describe('#getTkkGroups()', () => {
        it('... should have a `getTkkGroups()` method', () => {
            expect(service.getTkkGroups).toBeDefined();
        });

        it('... should return undefined if no svgRootGroup is provided', () => {
            let d3selections = service.getTkkGroups(null);

            expect(d3selections).toBeUndefined();

            d3selections = service.getTkkGroups(undefined);

            expect(d3selections).toBeUndefined();
        });

        it('... should return an empty array if svgRootGroup is provided, but has no `g.tkk` groups', () => {
            expectedOverlays = [];

            expectedSvg = createD3TestSvg();
            expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
            createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);

            const d3selections = service.getTkkGroups(expectedSvgRootGroup);

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expect(d3selections.nodes().length).toBe(0);
        });

        it('... should return an array of D3 selections if svgRootGroup is provided and has `g.tkk` groups', () => {
            const d3Selections = service.getTkkGroups(expectedSvgRootGroup);

            expect(d3Selections).toBeDefined();
            expect(d3Selections.nodes()).toBeInstanceOf(Array);
            expect(d3Selections.nodes().length).toBe(expectedOverlays.length);

            expect(d3Selections.nodes()[0].classList).toContain('tkk');
            expect(d3Selections.nodes()[1].classList).toContain('tkk');

            expect(d3Selections.nodes()[0].id).toBe(expectedOverlays[0].id);
            expect(d3Selections.nodes()[1].id).toBe(expectedOverlays[1].id);
        });
    });
});
