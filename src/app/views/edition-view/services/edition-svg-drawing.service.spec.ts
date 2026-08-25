import { DOCUMENT, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import * as D3_SELECTION from 'd3-selection';

import { expectSpyCall, expectToBe, expectToContain, expectToEqual } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';
import {
    createD3TestLinkBoxGroups,
    createD3TestRootGroup,
    createD3TestSuppliedClassesGroups,
    createD3TestSvg,
    createD3TestTkkGroups,
} from '@testing/svg-drawing-helper';

import {
    D3Selection,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';

import { EditionSvgDrawingService } from './edition-svg-drawing.service';

describe('EditionSvgDrawingService (DONE)', () => {
    let service: EditionSvgDrawingService;

    let mockDocument: Document;

    let consoleSpy: Spy;
    let getD3SelectionByIdSpy: Spy;

    let expectedSvg: D3Selection;
    let expectedSvgRootGroup: D3Selection;
    let expectedOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];
    let expectedSuppliedClassNames: string[];
    let expectedSuppliedClassMap: Map<string, boolean>;
    let expectedSuppliedClassesLabelLookup: Map<string, string>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionSvgDrawingService],
        });

        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);
        service = TestBed.inject(EditionSvgDrawingService);

        // Test data
        expectedOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', true),
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

        expectedSuppliedClassesLabelLookup = new Map([
            ['foliation', 'Blattangabe'],
            ['staffN', 'Systemangabe'],
            ['measureN', 'Taktzahlen'],
            ['clef', 'Schlüssel'],
            ['clef_key', 'Schlüssel mit Tonart'],
            ['key', 'Tonart'],
            ['accid', 'Akzidenzien'],
            ['hyphen', 'Silbentrennung'],
        ]);
        expectedSuppliedClassNames = ['supplied foliation', 'supplied clef_key', 'supplied unknown-class'];
        expectedSuppliedClassMap = new Map(
            expectedSuppliedClassNames.map(name => {
                const key = name.split(' ')[1];
                const value = expectedSuppliedClassesLabelLookup.get(key) || key;
                return [value, true];
            })
        );

        expectedSvg = createD3TestSvg(mockDocument);
        expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
        createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
        createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);
        createD3TestSuppliedClassesGroups(expectedSvgRootGroup, expectedSuppliedClassNames);

        // Spies
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
        getD3SelectionByIdSpy = vi.spyOn(service, 'getD3SelectionById');
    });

    afterEach(function () {
        expectedSvgRootGroup.remove();

        // Clear storages and mock objects after each test
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    describe('mock test objects (self-test)', () => {
        it('... should use mock console', () => {
            console.error('Test');

            expectSpyCall(consoleSpy, 1);
            expectToBe(mockConsole.get(0), 'Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined();
        });
    });

    it('... should have `_suppliedClassesLabelLookup` map', () => {
        expectToBe(service['_suppliedClassesLabelLookup'].size, expectedSuppliedClassesLabelLookup.size);
        expectToEqual(service['_suppliedClassesLabelLookup'], expectedSuppliedClassesLabelLookup);
    });

    it('... should have empty `_suppliedClasses` map', () => {
        expectToBe(service['_suppliedClasses'].size, 0);
    });

    describe('#createSvg()', () => {
        let fetchSvgFileSpy: Spy;

        beforeEach(() => {
            // Create a mock Document with SVG content that has child elements
            const mockSvgContent =
                '<svg id="svg-mock-header" xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" width="64" height="64" viewBox="0 0 100 100">' +
                '<circle cx="50" cy="50" r="10" fill="red"/>' +
                '<rect x="10" y="10" width="20" height="20" fill="blue"/>' +
                '</svg>';
            const parser = new DOMParser();
            const mockSvgDocument = parser.parseFromString(mockSvgContent, 'image/svg+xml');

            fetchSvgFileSpy = vi
                .spyOn(service as any, '_fetchSvgFile')
                .mockReturnValue(Promise.resolve(mockSvgDocument));
        });

        it('... should have a method `createSvg`', () => {
            expect(service.createSvg).toBeDefined();
        });

        describe('... should do nothing if', () => {
            it('... no svgFilePath is provided', async () => {
                expectSpyCall(fetchSvgFileSpy, 0);

                const result = await service.createSvg('', expectedSvg.node(), expectedSvgRootGroup.node());

                expect(result).toBeUndefined();
            });

            it('... no svgElement is provided', async () => {
                expectSpyCall(fetchSvgFileSpy, 0);

                const result = await service.createSvg('test-path', undefined, expectedSvgRootGroup.node());

                expect(result).toBeUndefined();
            });

            it('... no svgRootGroup is provided', async () => {
                expectSpyCall(fetchSvgFileSpy, 0);

                const result = await service.createSvg('test-path', expectedSvg.node(), undefined);

                expect(result).toBeUndefined();
            });

            it('... the fetched file does not contain a valid svg element', async () => {
                const invalidSvgContent = '<div><p>This is not an SVG file</p></div>';
                const parser = new DOMParser();
                const mockInvalidDocument = parser.parseFromString(invalidSvgContent, 'image/svg+xml');

                fetchSvgFileSpy.mockReturnValueOnce(Promise.resolve(mockInvalidDocument));

                const result = await service.createSvg('invalid-path', expectedSvg.node(), expectedSvgRootGroup.node());

                expectSpyCall(fetchSvgFileSpy, 1);
                expectToEqual(
                    mockConsole.get(0),
                    '[EditionSvgDrawingService]: The fetched file does not contain a valid <svg> element.'
                );
                expect(result).toBeUndefined();
            });
        });

        describe('... should create an svg if', () => {
            it('... a svgFilePath is provided', async () => {
                const svgFilePath = 'base/src/testing/mock-data/mockSvgHeader.svg';

                await expect(
                    service.createSvg(svgFilePath, expectedSvg.node(), expectedSvgRootGroup.node())
                ).resolves.toEqual(expectedSvg);

                expectSpyCall(fetchSvgFileSpy, 1, svgFilePath);
            });
        });
    });

    describe('#fillD3SelectionWithColor()', () => {
        it('... should have a method `fillD3SelectionWithColor`', () => {
            expect(service.fillD3SelectionWithColor).toBeDefined();
        });

        describe('... should do nothing if', () => {
            it('... no D3 selection is provided', () => {
                const color = 'red';

                expect(() => service.fillD3SelectionWithColor(undefined, color)).not.toThrow();
            });

            it('... no color is provided', () => {
                const d3Selection: D3Selection = expectedSvgRootGroup;
                const color = '';

                service.fillD3SelectionWithColor(d3Selection, color);

                expect(d3Selection).toBeDefined();
                expectToBe(d3Selection.attr('fill'), null);
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
                const d3selections = service.getD3SelectionById(undefined, 'tkk-1');

                expect(d3selections).toBeUndefined();
            });

            it('... no id is provided', () => {
                const d3selections = service.getD3SelectionById(expectedSvgRootGroup, '');

                expect(d3selections).toBeUndefined();
            });
        });

        it('... should return an empty array if svgRootGroup is provided, but given id is not found', () => {
            const d3selections = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-unknown');

            expect(d3selections).toBeDefined();
            expect(d3selections?.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections?.nodes().length, 0);
        });

        it('... should return an array of D3 selections if svgRootGroup is provided and has given id ', () => {
            const d3selections = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-1');

            expect(d3selections).toBeDefined();
            expect(d3selections?.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections?.nodes().length, 1);
            expectToBe(d3selections?.nodes()[0].id, 'tkk-1');

            const d3selections2 = service.getD3SelectionById(expectedSvgRootGroup, 'tkk-2');

            expect(d3selections2).toBeDefined();
            expect(d3selections2?.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections2?.nodes().length, 1);
            expectToBe(d3selections2?.nodes()[0].id, 'tkk-2');
        });
    });

    describe('#getD3SelectionByDataId()', () => {
        it('... should have a method `getD3SelectionByDataId`', () => {
            expect(service.getD3SelectionByDataId).toBeDefined();
        });

        it('... should return undefined if no svgRootGroup is provided', () => {
            const d3selections = service.getD3SelectionByDataId(undefined, 'tkk-1');

            expect(d3selections).toBeUndefined();
        });

        it('... should return an empty array if svgRootGroup is provided, but given dataId is not found', () => {
            const d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, 'tkk-unknown');

            expect(d3selections).toBeDefined();
            expect(d3selections?.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections?.nodes().length, 0);
        });

        it('... should get element by dataId attribute if present (not by actual id)', () => {
            expectedSvgRootGroup
                .append('g')
                .attr('data-tkk-id', 'custom-data-id')
                .attr('id', 'actual-id')
                .attr('class', 'tkk');

            const d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, 'custom-data-id');

            expectSpyCall(getD3SelectionByIdSpy, 0);

            expect(d3selections).toBeDefined();
            expect(d3selections?.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections?.nodes().length, 1);
            expectToBe(d3selections?.nodes()[0].getAttribute('data-tkk-id'), 'custom-data-id');
            expectToBe(d3selections?.nodes()[0].id, 'actual-id');
        });

        it('... should get element by actual id (via `getD3SelectionById`) if dataId is not present', () => {
            const d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, 'tkk-1');

            expectSpyCall(getD3SelectionByIdSpy, 1, [expectedSvgRootGroup, 'tkk-1']);

            expect(d3selections).toBeDefined();
            expect(d3selections?.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections?.nodes().length, 1);
            expectToBe(d3selections?.nodes()[0].id, 'tkk-1');

            const d3selections2 = service.getD3SelectionByDataId(expectedSvgRootGroup, 'tkk-2');

            expectSpyCall(getD3SelectionByIdSpy, 2, [expectedSvgRootGroup, 'tkk-2']);

            expect(d3selections2).toBeDefined();
            expect(d3selections2?.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections2?.nodes().length, 1);
            expectToBe(d3selections2?.nodes()[0].id, 'tkk-2');
        });
    });

    describe('#getGroupsBySelector()', () => {
        it('... should have a method `getGroupsBySelector`', () => {
            expect(service.getGroupsBySelector).toBeDefined();
        });

        it('... should return undefined if no svgRootGroup is provided', () => {
            const d3selections = service.getGroupsBySelector(undefined, 'tkk');

            expect(d3selections).toBeUndefined();
        });

        describe('... should return an empty array if', () => {
            it('... svgRootGroup is provided, but no matching selector found', () => {
                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'unknown-selector');

                expect(d3selections).toBeDefined();
                expect(d3selections?.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections?.nodes().length, 0);
            });

            it('... asked for `tkk`, but has no overlay groups', () => {
                expectedOverlays = [];

                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
                createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
                createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);

                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');

                expect(d3selections).toBeDefined();
                expect(d3selections?.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections?.nodes().length, 0);
            });

            it('... asked for `link-box`, but has no link boxes', () => {
                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
                createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);

                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'link-box');

                expect(d3selections).toBeDefined();
                expect(d3selections?.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections?.nodes().length, 0);
            });

            it('... asked for `supplied`, but has no supplied classes', () => {
                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
                createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
                createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);

                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'supplied');

                expect(d3selections).toBeDefined();
                expect(d3selections?.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections?.nodes().length, 0);
            });
        });

        describe('... should return an array of D3 selections if svgRootGroup is provided, and matching selector found', () => {
            it('... asked for `tkk` and has overlay groups', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');

                expect(d3Selections).toBeDefined();
                expect(d3Selections?.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections?.nodes().length, expectedOverlays.length);

                d3Selections?.nodes().forEach((node, index) => {
                    expectToContain(node.classList, 'tkk');

                    expectToBe(node.id, expectedOverlays[index].id);
                });
            });

            it('... asked for `link-box` and has link boxes', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'link-box');

                expect(d3Selections).toBeDefined();
                expect(d3Selections?.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections?.nodes().length, expectedLinkBoxes.length);

                d3Selections?.nodes().forEach((node, index) => {
                    expectToContain(node.classList, 'link-box');

                    expectToBe(node.id, expectedLinkBoxes[index].svgGroupId);
                });
            });

            it('... asked for `supplied` and has supplied classes', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'supplied');

                expect(d3Selections).toBeDefined();
                expect(d3Selections?.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections?.nodes().length, expectedSuppliedClassNames.length);

                d3Selections?.nodes().forEach((node, index) => {
                    const suppliedClass = Array.from(node.classList).join(' ');
                    expectToBe(suppliedClass, expectedSuppliedClassNames[index]);
                });
            });
        });
    });

    describe('#getSuppliedClasses()', () => {
        it('... should have a method `getSuppliedClasses`', () => {
            expect(service.getSuppliedClasses).toBeDefined();
        });

        describe('... should return an empty Map if', () => {
            it('... no svgRootGroup is provided', () => {
                const suppliedClasses = service.getSuppliedClasses(undefined);

                expect(suppliedClasses).toBeDefined();
                expect(suppliedClasses).toBeInstanceOf(Map);
                expectToBe(suppliedClasses.size, 0);
            });

            it('... `getGroupsBySelector` returns undefined / no selections found', () => {
                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);

                const getGroupsSpy = vi.spyOn(service, 'getGroupsBySelector').mockReturnValue(undefined);

                const suppliedClasses = service.getSuppliedClasses(expectedSvgRootGroup);

                expectSpyCall(getGroupsSpy, 1, [expectedSvgRootGroup, 'supplied']);
                expect(suppliedClasses).toBeDefined();
                expect(suppliedClasses).toBeInstanceOf(Map);
                expectToBe(suppliedClasses.size, 0);

                getGroupsSpy.mockRestore();
            });
        });

        it('... should return a Map of supplied classes if svgRootGroup is provided and has supplied classes', () => {
            const suppliedClasses = service.getSuppliedClasses(expectedSvgRootGroup);

            expect(suppliedClasses).toBeDefined();
            expect(suppliedClasses).toBeInstanceOf(Map);
            expectToBe(suppliedClasses.size, expectedSuppliedClassNames.length);
            expectToBe(suppliedClasses.size, expectedSuppliedClassMap.size);
            expectToEqual(suppliedClasses, expectedSuppliedClassMap);
        });

        it('... should ignore supplied groups without a class after `supplied`', () => {
            expectedSvg = createD3TestSvg(mockDocument);
            expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
            createD3TestSuppliedClassesGroups(expectedSvgRootGroup, ['supplied']);

            const suppliedClasses = service.getSuppliedClasses(expectedSvgRootGroup);

            expect(suppliedClasses).toBeDefined();
            expect(suppliedClasses).toBeInstanceOf(Map);
            expectToBe(suppliedClasses.size, 0);
        });

        it('... should not add duplicate supplied class labels twice', () => {
            expectedSvg = createD3TestSvg(mockDocument);
            expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
            createD3TestSuppliedClassesGroups(expectedSvgRootGroup, ['supplied foliation', 'supplied foliation']);

            const suppliedClasses = service.getSuppliedClasses(expectedSvgRootGroup);

            expect(suppliedClasses).toBeDefined();
            expect(suppliedClasses).toBeInstanceOf(Map);
            expectToBe(suppliedClasses.size, 1);
            expectToBe(suppliedClasses.get('Blattangabe'), true);
        });
    });

    describe('#toggleSuppliedClassOpacity()', () => {
        it('... should have a method `toggleSuppliedClassOpacity`', () => {
            expect(service.toggleSuppliedClassOpacity).toBeDefined();
        });

        describe('... should do nothing if', () => {
            let suppliedClassName: string;
            let expectedSelection: D3Selection;
            let opacityBefore: string;

            beforeEach(() => {
                suppliedClassName = expectedSuppliedClassNames[0].split(' ')[1];
                const suppliedSelections = service.getGroupsBySelector(expectedSvgRootGroup, suppliedClassName);

                expect(suppliedSelections).toBeTruthy();

                const node = suppliedSelections?.nodes()[0];
                expect(node).toBeTruthy();

                expectedSelection = D3_SELECTION.select(node);
                opacityBefore = expectedSelection.style('opacity');
            });

            it('... no svgRootGroup is provided', () => {
                service.toggleSuppliedClassOpacity(undefined, suppliedClassName, true);

                const opacityAfter = expectedSelection.style('opacity');

                expectToEqual(opacityAfter, opacityBefore);
            });

            it('... `getGroupsBySelector` returns undefined / no selections found', () => {
                const getGroupsSpy = vi.spyOn(service, 'getGroupsBySelector').mockReturnValue(undefined);

                service.toggleSuppliedClassOpacity(expectedSvgRootGroup, suppliedClassName, true);

                const opacityAfter = expectedSelection.style('opacity');
                expectToEqual(opacityAfter, opacityBefore);

                getGroupsSpy.mockRestore();
            });
        });

        it('... should toggle opacity of a single supplied class', () => {
            const suppliedClassName = expectedSuppliedClassNames[0].split(' ')[1];
            const suppliedSelections = service.getGroupsBySelector(expectedSvgRootGroup, suppliedClassName);
            expect(suppliedSelections).toBeTruthy();

            const expectedSelection = D3_SELECTION.select(suppliedSelections?.nodes()[0]);

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, suppliedClassName, true);

            let opacity = expectedSelection.style('opacity');

            expectToEqual(opacity, '0');

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, suppliedClassName, false);

            opacity = expectedSelection.style('opacity');

            expectToEqual(opacity, '1');
        });

        it('... should toggle opacity of all supplied classes if no class name is provided', () => {
            const suppliedSelections = service.getGroupsBySelector(expectedSvgRootGroup, 'supplied');

            expect(suppliedSelections).toBeTruthy();

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, '', true);

            suppliedSelections?.nodes().forEach(node => {
                const expectedSelection = D3_SELECTION.select(node);
                const opacity = expectedSelection.style('opacity');
                expectToEqual(opacity, '0');
            });

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, '', false);

            suppliedSelections?.nodes().forEach(node => {
                const expectedSelection = D3_SELECTION.select(node);
                const opacity = expectedSelection.style('opacity');
                expectToEqual(opacity, '1');
            });
        });
    });

    describe('#_fetchSvgFile', () => {
        it('... should have a method `_fetchSvgFile`', () => {
            expect(service['_fetchSvgFile']).toBeDefined();
        });

        it('... should call through to D3_FETCH.svg and return a promise', async () => {
            vi.spyOn(console, 'error').mockImplementation(mockConsole.log); // Catch console output

            const promise = service['_fetchSvgFile']('invalid-path-for-coverage.svg');

            // Should return a Promise (even if it rejects)
            expect(promise).toBeInstanceOf(Promise);

            // Expect it to reject since the file doesn't exist, but this covers the method execution
            await expect(promise).rejects.toThrow();
        });

        // Note: The method is also adequately tested through createSvg integration tests.
    });
});
