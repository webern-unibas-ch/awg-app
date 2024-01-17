import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { expectSpyCall, expectToBe, expectToContain, expectToEqual } from '@testing/expect-helper';

import {
    D3Selection,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';

import { EditionSvgDrawingService } from './edition-svg-drawing.service';

import * as D3_SELECTION from 'd3-selection';

// Helper functions to create D3 selections
function createD3TestSvg(doc: Document): D3Selection {
    const container: HTMLElement = doc.createElement('div');

    // Test data
    return D3_SELECTION.select(container).append('svg').attr('id', 'test-svg');
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

function createD3TestLinkBoxGroups(svgRootGroup: D3Selection, linkBoxes: EditionSvgLinkBox[]): D3Selection {
    linkBoxes.forEach(linkBox => {
        svgRootGroup.append('g').attr('class', 'link-box').attr('id', linkBox.svgGroupId);
    });

    return svgRootGroup;
}

describe('EditionSvgDrawingService (DONE)', () => {
    let service: EditionSvgDrawingService;

    let mockDocument: Document;

    let expectedSvg: D3Selection;
    let expectedSvgRootGroup: D3Selection;
    let expectedOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];

    let expectedOverlayFillColor: string;
    let expectedOverlayHoverFillColor: string;
    let expectedOverlaySelectionFillColor: string;
    let expectedLinkBoxFillColor: string;
    let expectedLinkBoxHoverFillColor: string;
    let expectedOverlayBoxesOpacity: number;
    let expectedOverlayBoxAdditionalSpace: number;
    let expectedOverlayBoxCornerRadius: number;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(EditionSvgDrawingService);
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tkk-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.item, 'tkk-2', true),
        ];

        expectedLinkBoxes = [
            {
                svgGroupId: 'link-box-1',
                linkTo: {
                    complexId: 'testComplex',
                    sheetId: 'Test_Sk_1',
                },
            },
        ];

        expectedOverlayFillColor = 'orange';
        expectedOverlayHoverFillColor = 'tomato';
        expectedOverlaySelectionFillColor = 'green';
        expectedLinkBoxFillColor = '#dddddd';
        expectedLinkBoxHoverFillColor = '#eeeeee';
        expectedOverlayBoxesOpacity = 0.3;
        expectedOverlayBoxAdditionalSpace = 5.5;
        expectedOverlayBoxCornerRadius = 2;

        expectedSvg = createD3TestSvg(mockDocument);
        expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
        createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
        createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);
    }));

    afterEach(function () {
        expectedSvgRootGroup.remove();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    it('... should have `overlayFillColor = orange`', () => {
        expectToBe(service.overlayFillColor, expectedOverlayFillColor);
    });

    it('... should have `overlayHoverFillColor = tomato`', () => {
        expectToBe(service.overlayHoverFillColor, expectedOverlayHoverFillColor);
    });

    it('... should have `overlaySelectionFillColor = green`', () => {
        expectToBe(service.overlaySelectionFillColor, expectedOverlaySelectionFillColor);
    });

    it('... should have `linkBoxFillColor = #dddddd`', () => {
        expectToBe(service.linkBoxFillColor, expectedLinkBoxFillColor);
    });

    it('... should have `linkBoxHoverFillColor = #eeeeee`', () => {
        expectToBe(service.linkBoxHoverFillColor, expectedLinkBoxHoverFillColor);
    });

    it('... should have `_overlayBoxesOpacity = 0.3` (private)', () => {
        expectToBe(service['_overlayBoxesOpacity'], expectedOverlayBoxesOpacity);
    });

    it('... should have `_overlayBoxAdditionalSpace = 5.5` (private)', () => {
        expectToBe(service['_overlayBoxAdditionalSpace'], expectedOverlayBoxAdditionalSpace);
    });

    it('... should have `_overlayBoxCornerRadius = 2` (private)', () => {
        expectToBe(service['_overlayBoxCornerRadius'], expectedOverlayBoxCornerRadius);
    });

    describe('#createSvg()', () => {
        let fetchSvgFileSpy: jasmine.Spy;

        beforeEach(() => {
            fetchSvgFileSpy = spyOn(service as any, '_fetchSvgFile').and.callThrough();
        });

        it('... should have a method `createSvg`', () => {
            expect(service.createSvg).toBeDefined();
        });

        describe('... should do nothing if', () => {
            it('... no svgFilePath is provided', async () => {
                expectSpyCall(fetchSvgFileSpy, 0);

                await expectAsync(
                    service.createSvg('', expectedSvg.node(), expectedSvgRootGroup.node())
                ).toBeResolvedTo(undefined);
            });

            it('... no svgElement is provided', async () => {
                expectSpyCall(fetchSvgFileSpy, 0);

                await expectAsync(service.createSvg('test-path', null, expectedSvgRootGroup.node())).toBeResolvedTo(
                    undefined
                );
            });

            it('... no svgRootGroup is provided', async () => {
                expectSpyCall(fetchSvgFileSpy, 0);

                await expectAsync(service.createSvg('test-path', expectedSvg.node(), null)).toBeResolvedTo(undefined);
            });
        });

        describe('... should create an svg if', () => {
            it('... a svgFilePath is provided', async () => {
                const svgFilePath = 'base/src/testing/mock-data/mockSvgHeader.svg';

                await expectAsync(
                    service.createSvg(svgFilePath, expectedSvg.node(), expectedSvgRootGroup.node())
                ).toBeResolvedTo(expectedSvg);

                expectSpyCall(fetchSvgFileSpy, 1, svgFilePath);
            });
        });
    });

    describe('#createOverlayGroup()', () => {
        it('... should have a method `createOverlayGroup`', () => {
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

        it('... should create an overlay group', () => {
            const rootGroup: D3Selection = expectedSvgRootGroup;
            const id = 'tkk-1';
            const dim = expectedSvgRootGroup.nodes()[0].getBBox();
            const type = 'tkk';

            const d3selections = service.createOverlayGroup(rootGroup, id, dim, type);

            expect(d3selections).toBeDefined();
            expectToBe(d3selections.node().nodeName, 'rect');
            expectToContain(d3selections.node().classList, 'tkk-overlay-group-box');
            expectToBe(d3selections.attr('class'), 'tkk-overlay-group-box');
            expectToBe(d3selections.attr('fill'), expectedOverlayFillColor);
            expectToBe(d3selections.attr('opacity'), expectedOverlayBoxesOpacity.toString());
            expectToBe(d3selections.attr('rx'), expectedOverlayBoxCornerRadius.toString());
        });
    });

    describe('#fillD3SelectionWithColor()', () => {
        it('... should have a method `fillD3SelectionWithColor`', () => {
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
            expectToBe(d3Selection.attr('fill'), color);
        });
    });

    describe('#getContainerDimensions()', () => {
        it('... should have a method `getContainerDimensions`', () => {
            expect(service.getContainerDimensions).toBeDefined();
        });

        it('... should return an object with undefined width and height if container is not given', () => {
            let containerEl = null;
            let dim = service.getContainerDimensions(containerEl);

            expectToEqual(dim, { width: undefined, height: undefined });
            expect(dim.width).toBeUndefined();
            expect(dim.height).toBeUndefined();

            containerEl = undefined;
            dim = service.getContainerDimensions(containerEl);

            expectToEqual(dim, { width: undefined, height: undefined });
            expect(dim.width).toBeUndefined();
            expect(dim.height).toBeUndefined();
        });

        it('... should return an object with the correct dimensions for a given container', () => {
            const containerEl = new ElementRef(document.createElement('div'));
            const dim = service.getContainerDimensions(containerEl);

            expectToEqual(dim, {
                width: containerEl.nativeElement.clientWidth,
                height: containerEl.nativeElement.clientHeight,
            });
            expectToEqual(dim.width, containerEl.nativeElement.clientWidth);
            expectToEqual(dim.height, containerEl.nativeElement.clientHeight);
        });
    });

    describe('#getD3SelectionById()', () => {
        it('... should have a method `getD3SelectionById`', () => {
            expect(service.getD3SelectionById).toBeDefined();
        });

        describe('... should return undefined if', () => {
            it('... no svgRootGroup is provided', () => {
                let d3selections = service.getD3SelectionById(null, 'tkk-1');

                expect(d3selections).toBeUndefined();

                d3selections = service.getD3SelectionById(undefined, 'tkk-1');

                expect(d3selections).toBeUndefined();
            });

            it('... no id is provided', () => {
                let d3selections = service.getD3SelectionById(expectedSvgRootGroup, '');

                expect(d3selections).toBeUndefined();

                d3selections = service.getD3SelectionById(expectedSvgRootGroup, null);

                expect(d3selections).toBeUndefined();

                d3selections = service.getD3SelectionById(expectedSvgRootGroup, undefined);

                expect(d3selections).toBeUndefined();
            });
        });

        it('... should return an empty array if svgRootGroup is provided, but given id is not found', () => {
            const d3selections = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-unknown');

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections.nodes().length, 0);
        });

        it('... should return an array of D3 selections if svgRootGroup is provided and has given id ', () => {
            const d3selections = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-1');

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections.nodes().length, 1);
            expectToBe(d3selections.nodes()[0].id, 'tkk-1');

            const d3selections2 = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-2');

            expect(d3selections2).toBeDefined();
            expect(d3selections2.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections2.nodes().length, 1);
            expectToBe(d3selections2.nodes()[0].id, 'tkk-2');
        });
    });

    describe('#getGroupsBySelector()', () => {
        it('... should have a method `getGroupsBySelector`', () => {
            expect(service.getGroupsBySelector).toBeDefined();
        });

        it('... should return undefined if no svgRootGroup is provided', () => {
            let d3selections = service.getGroupsBySelector(null, 'tkk');

            expect(d3selections).toBeUndefined();

            d3selections = service.getGroupsBySelector(undefined, 'tkk');

            expect(d3selections).toBeUndefined();
        });

        describe('... should return an empty array if', () => {
            it('... svgRootGroup is provided, but has no selected overlays', () => {
                expectedOverlays = [];

                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
                createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
                createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);

                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });

            it('... svgRootGroup is provided, but has no link boxes', () => {
                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
                createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);

                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'link-box');

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });
        });

        describe('... should return an array of D3 selections if ', () => {
            it('... svgRootGroup is provided and has `tkk` groups', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');

                expect(d3Selections).toBeDefined();
                expect(d3Selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections.nodes().length, expectedOverlays.length);

                d3Selections.nodes().forEach((node, index) => {
                    expectToContain(node.classList, 'tkk');

                    expectToBe(node.id, expectedOverlays[index].id);
                });
            });

            it('... svgRootGroup is provided and has `link-box` groups', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'link-box');

                expect(d3Selections).toBeDefined();
                expect(d3Selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections.nodes().length, expectedLinkBoxes.length);

                d3Selections.nodes().forEach((node, index) => {
                    expectToContain(node.classList, 'link-box');

                    expectToBe(node.id, expectedLinkBoxes[index].svgGroupId);
                });
            });
        });
    });

    describe('#getOverlayGroupRectSelection()', () => {
        it('... should have a method `getOverlayGroupRectSelection`', () => {
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
                expectToBe(d3selections.nodes().length, 0);
            });

            it('... all inputs are provided, but has no overlay group box with given type', () => {
                const tkkGroups = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();
                const expectedType = 'tkk';
                const otherType = 'other-type';

                service.createOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions, expectedType);

                const d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', otherType);

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });
        });

        it('... should return an array of D3 selections if all inputs are provided and has overlay group box with given type', () => {
            const tkkGroups = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');
            const expectedDimensions = tkkGroups.nodes()[0].getBBox();
            const expectedType = 'tkk';

            service.createOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions, expectedType);

            const d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', expectedType);

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections.nodes().length, 1);
            expectToContain(d3selections.nodes()[0].classList, `${expectedType}-overlay-group-box`);
        });
    });

    describe('#updateTkkOverlayColor()', () => {
        it('... should have a method `updateTkkOverlayColor`', () => {
            expect(service.updateTkkOverlayColor).toBeDefined();
        });

        describe('... should call the fillD3Selection method with the correct color when', () => {
            let d3selections;
            let fillD3SelectionWithColorSpy;

            beforeEach(() => {
                fillD3SelectionWithColorSpy = spyOn(service, 'fillD3SelectionWithColor');

                const tkkGroups = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();
                const expectedType = 'tkk';

                service.createOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions, expectedType);

                d3selections = service.getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', expectedType);
            });

            it('... overlay is not selected and overlayActionType is not `hover`', () => {
                const notSelectedOverlay = expectedOverlays[0];
                notSelectedOverlay.isSelected = false;

                service.updateTkkOverlayColor(notSelectedOverlay, d3selections, 'fill');

                expectSpyCall(fillD3SelectionWithColorSpy, 1, [d3selections, expectedOverlayFillColor]);
            });

            it('... overlay is not selected and overlayActionType is `hover`', () => {
                const notSelectedOverlay = expectedOverlays[0];
                notSelectedOverlay.isSelected = false;

                service.updateTkkOverlayColor(notSelectedOverlay, d3selections, 'hover');

                expectSpyCall(fillD3SelectionWithColorSpy, 1, [d3selections, expectedOverlayHoverFillColor]);
            });

            it('... overlay is selected no matter what overlayActionType', () => {
                const selectedOverlay = expectedOverlays[0];

                service.updateTkkOverlayColor(selectedOverlay, d3selections, 'fill');

                expectSpyCall(fillD3SelectionWithColorSpy, 1, [d3selections, expectedOverlaySelectionFillColor]);

                service.updateTkkOverlayColor(selectedOverlay, d3selections, 'hover');

                expectSpyCall(fillD3SelectionWithColorSpy, 2, [d3selections, expectedOverlaySelectionFillColor]);
            });
        });
    });

    describe('#_fetchSvgFile', () => {
        it('... should have a method `_fetchSvgFile`', () => {
            expect((service as any)._fetchSvgFile).toBeDefined();
        });

        it('... should return an svg document', async () => {
            const svgFilePath = 'base/src/testing/mock-data/mockSvgHeader.svg';
            const svg = await (service as any)._fetchSvgFile(svgFilePath);

            expectToEqual(svg, jasmine.any(Document));
            expect(svg.getElementsByTagName('svg')).toBeDefined();
            expectToBe(svg.getElementsByTagName('svg').length, 1);
            expectToBe(svg.getElementsByTagName('svg')[0].id, 'svg-mock-header');
        });
    });

    describe('#_getTkkOverlayColor()', () => {
        it('... should have a method `_getTkkOverlayColor`', () => {
            expect((service as any)._getTkkOverlayColor).toBeDefined();
        });

        it('... should return a color string', () => {
            const color = (service as any)._getTkkOverlayColor();

            expect(color).toBeDefined();
            expect(color).toBeInstanceOf(String);
        });

        it('... should return overlayFillColor if overlay is not selected and overlayActionType is not `hover`', () => {
            const notSelectedOverlay = expectedOverlays[0];
            notSelectedOverlay.isSelected = false;
            const color = (service as any)._getTkkOverlayColor(notSelectedOverlay, 'fill');

            expectToBe(color, expectedOverlayFillColor);
        });

        it('... should return overlayHoverFillColor if overlay is not selected and overlayActionType is `hover`', () => {
            const notSelectedOverlay = expectedOverlays[0];
            notSelectedOverlay.isSelected = false;
            const color = (service as any)._getTkkOverlayColor(notSelectedOverlay, 'hover');

            expectToBe(color, expectedOverlayHoverFillColor);
        });

        it('... should return overlaySelectedFillColor if overlay is selected no matter what overlayActionType', () => {
            const selectedOverlay = expectedOverlays[0];
            const color = (service as any)._getTkkOverlayColor(selectedOverlay, 'fill');

            expectToBe(color, expectedOverlaySelectionFillColor);

            const color2 = (service as any)._getTkkOverlayColor(selectedOverlay, 'hover');

            expectToBe(color2, expectedOverlaySelectionFillColor);
        });
    });
});
