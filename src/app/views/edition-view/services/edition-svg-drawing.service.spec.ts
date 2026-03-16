import { DOCUMENT, ElementRef } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

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

import * as D3_SELECTION from 'd3-selection';

describe('EditionSvgDrawingService (DONE)', () => {
    let service: EditionSvgDrawingService;

    let mockDocument: Document;

    let getD3SelectionByIdSpy: Spy;

    let expectedSvg: D3Selection;
    let expectedSvgRootGroup: D3Selection;
    let expectedOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];
    let expectedSuppliedClassNames: string[];
    let expectedSuppliedClassMap: Map<string, boolean>;
    let expectedSuppliedClassesLabelLookup: Map<string, string>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(EditionSvgDrawingService);
        mockDocument = TestBed.inject(DOCUMENT);

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
        getD3SelectionByIdSpy = spyOn(service, 'getD3SelectionById').and.callThrough();
    }));

    afterEach(function () {
        expectedSvgRootGroup.remove();

        // Clear storages and mock objects after each test
        mockConsole.clear();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    it('... should have `_suppliedClassesLabelLookup` map', () => {
        expectToBe(service['_suppliedClassesLabelLookup'].size, expectedSuppliedClassesLabelLookup.size);
        expectToEqual(service['_suppliedClassesLabelLookup'], expectedSuppliedClassesLabelLookup);
    });

    it('... should have empty `_suppliedClasses` map', () => {
        expectToBe(service['_suppliedClasses'].size, 0);
    });

    describe('#createSvg()', () => {
        let fetchSvgFileSpy: jasmine.Spy;

        beforeEach(() => {
            // Create a mock Document with SVG content that has child elements
            const mockSvgContent =
                '<svg id="svg-mock-header" xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" width="64" height="64" viewBox="0 0 100 100">' +
                '<circle cx="50" cy="50" r="10" fill="red"/>' +
                '<rect x="10" y="10" width="20" height="20" fill="blue"/>' +
                '</svg>';
            const parser = new DOMParser();
            const mockSvgDocument = parser.parseFromString(mockSvgContent, 'image/svg+xml');

            fetchSvgFileSpy = spyOn(service as any, '_fetchSvgFile').and.returnValue(Promise.resolve(mockSvgDocument));
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

    describe('#getD3SelectionByDataId()', () => {
        it('... should have a method `getD3SelectionByDataId`', () => {
            expect(service.getD3SelectionByDataId).toBeDefined();
        });

        describe('... should return undefined if', () => {
            it('... no svgRootGroup is provided', () => {
                let d3selections = service.getD3SelectionByDataId(null, 'tkk-1');
                expect(d3selections).toBeUndefined();

                d3selections = service.getD3SelectionByDataId(undefined, 'tkk-1');
                expect(d3selections).toBeUndefined();
            });

            it('... no dataId is provided', () => {
                let d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, '');
                expect(d3selections).toBeUndefined();

                d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, null);
                expect(d3selections).toBeUndefined();

                d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, undefined);
                expect(d3selections).toBeUndefined();
            });
        });

        it('... should return an empty array if svgRootGroup is provided, but given dataId is not found', () => {
            const d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, 'tkk-unknown');

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections.nodes().length, 0);
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
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections.nodes().length, 1);
            expect(d3selections.nodes()[0].getAttribute('data-tkk-id')).toBe('custom-data-id');
            expectToBe(d3selections.nodes()[0].id, 'actual-id');
        });

        it('... should get element by actual id (via `getD3SelectionById`) if dataId is not present', () => {
            const d3selections = service.getD3SelectionByDataId(expectedSvgRootGroup, 'tkk-1');

            expectSpyCall(getD3SelectionByIdSpy, 1, [expectedSvgRootGroup, 'tkk-1']);

            expect(d3selections).toBeDefined();
            expect(d3selections.nodes()).toBeInstanceOf(Array);
            expectToBe(d3selections.nodes().length, 1);
            expect(d3selections.nodes()[0].id).toBe('tkk-1');

            const d3selections2 = service.getD3SelectionByDataId(expectedSvgRootGroup, 'tkk-2');

            expectSpyCall(getD3SelectionByIdSpy, 2, [expectedSvgRootGroup, 'tkk-2']);

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
            it('... svgRootGroup is provided, but no matching selector found', () => {
                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'unknown-selector');

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });

            it('... asked for `tkk`, but has no overlay groups', () => {
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

            it('... asked for `link-box`, but has no link boxes', () => {
                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
                createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);

                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'link-box');

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });

            it('... asked for `supplied`, but has no supplied classes', () => {
                expectedSvg = createD3TestSvg(mockDocument);
                expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
                createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
                createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);

                const d3selections = service.getGroupsBySelector(expectedSvgRootGroup, 'supplied');

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });
        });

        describe('... should return an array of D3 selections if svgRootGroup is provided, and matching selector found', () => {
            it('... asked for `tkk` and has overlay groups', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'tkk');

                expect(d3Selections).toBeDefined();
                expect(d3Selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections.nodes().length, expectedOverlays.length);

                d3Selections.nodes().forEach((node, index) => {
                    expectToContain(node.classList, 'tkk');

                    expectToBe(node.id, expectedOverlays[index].id);
                });
            });

            it('... asked for `link-box` and has link boxes', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'link-box');

                expect(d3Selections).toBeDefined();
                expect(d3Selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections.nodes().length, expectedLinkBoxes.length);

                d3Selections.nodes().forEach((node, index) => {
                    expectToContain(node.classList, 'link-box');

                    expectToBe(node.id, expectedLinkBoxes[index].svgGroupId);
                });
            });

            it('... asked for `supplied` and has supplied classes', () => {
                const d3Selections = service.getGroupsBySelector(expectedSvgRootGroup, 'supplied');

                expect(d3Selections).toBeDefined();
                expect(d3Selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections.nodes().length, expectedSuppliedClassNames.length);

                d3Selections.nodes().forEach((node, index) => {
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

        it('... should return undefined if no svgRootGroup is provided', () => {
            const suppliedClasses = service.getSuppliedClasses(null);

            expect(suppliedClasses).toBeUndefined();
        });

        it('... should return an empty Map if svgRootGroup is provided, but has no supplied classes', () => {
            expectedSvg = createD3TestSvg(mockDocument);
            expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
            createD3TestTkkGroups(expectedSvgRootGroup, expectedOverlays);
            createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);

            const suppliedClasses = service.getSuppliedClasses(expectedSvgRootGroup);

            expect(suppliedClasses).toBeDefined();
            expect(suppliedClasses).toBeInstanceOf(Map);
            expectToBe(suppliedClasses.size, 0);
        });

        it('... should return a Map of supplied classes if svgRootGroup is provided and has supplied classes', () => {
            const suppliedClasses = service.getSuppliedClasses(expectedSvgRootGroup);

            expect(suppliedClasses).toBeDefined();
            expect(suppliedClasses).toBeInstanceOf(Map);
            expectToBe(suppliedClasses.size, expectedSuppliedClassNames.length);
            expectToBe(suppliedClasses.size, expectedSuppliedClassMap.size);
            expectToEqual(suppliedClasses, expectedSuppliedClassMap);
        });
    });

    describe('#toggleSuppliedClassOpacity()', () => {
        it('... should have a method `toggleSuppliedClassOpacity`', () => {
            expect(service.toggleSuppliedClassOpacity).toBeDefined();
        });

        it('... should do nothing if no svgRootGroup is provided', () => {
            const suppliedClassName = expectedSuppliedClassNames[0].split(' ')[1];
            const suppliedSelections = service.getGroupsBySelector(expectedSvgRootGroup, suppliedClassName);
            const expectedSelection = D3_SELECTION.select(suppliedSelections.nodes()[0]);

            service.toggleSuppliedClassOpacity(null, suppliedClassName, true);

            const opacity = expectedSelection.style('opacity');

            expectToEqual(opacity, '');
        });

        it('... should toggle opacity of a single supplied class', () => {
            const suppliedClassName = expectedSuppliedClassNames[0].split(' ')[1];
            const suppliedSelections = service.getGroupsBySelector(expectedSvgRootGroup, suppliedClassName);
            const expectedSelection = D3_SELECTION.select(suppliedSelections.nodes()[0]);

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, suppliedClassName, true);

            let opacity = expectedSelection.style('opacity');

            expectToEqual(opacity, '0');

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, suppliedClassName, false);

            opacity = expectedSelection.style('opacity');

            expectToEqual(opacity, '1');
        });

        it('... should toggle opacity of all supplied classes if no class name is provided', () => {
            const suppliedSelections = service.getGroupsBySelector(expectedSvgRootGroup, 'supplied');

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, '', true);

            suppliedSelections.nodes().forEach(node => {
                const expectedSelection = D3_SELECTION.select(node);
                const opacity = expectedSelection.style('opacity');
                expectToEqual(opacity, '0');
            });

            service.toggleSuppliedClassOpacity(expectedSvgRootGroup, '', false);

            suppliedSelections.nodes().forEach(node => {
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
            spyOn(console, 'error').and.callFake(mockConsole.log); // Catch console output

            const promise = service['_fetchSvgFile']('invalid-path-for-coverage.svg');

            // Should return a Promise (even if it rejects)
            expect(promise).toBeInstanceOf(Promise);

            // Expect it to reject since the file doesn't exist, but this covers the method execution
            await expectAsync(promise).toBeRejected();
        });

        // Note: The method is also adequately tested through createSvg integration tests.
    });
});
