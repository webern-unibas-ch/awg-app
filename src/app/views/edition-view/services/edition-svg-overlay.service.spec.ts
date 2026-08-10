import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToContain, expectToEqual } from '@testing/expect-helper';
import { mockConsole } from '@testing/mock-helper';
import {
    createD3TestLinkBoxGroups,
    createD3TestRootGroup,
    createD3TestSvg,
    createD3TestTkkGroups,
} from '@testing/svg-drawing-helper';

import {
    D3Selection,
    EditionSvgLinkBox,
    EditionSvgOverlay,
    EditionSvgOverlayActionTypes,
    EditionSvgOverlayState,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';
import { EditionSvgDrawingService } from '@awg-views/edition-view/services';

import { EditionSvgOverlayService } from './edition-svg-overlay.service';

describe('EditionSvgOverlayService', () => {
    let service: EditionSvgOverlayService;

    let mockDocument: Document;
    let mockEditionSvgDrawingService: Partial<EditionSvgDrawingService>;

    let createTkkOverlayGroupSpy: Spy;
    let createTkkOverlayHandlersSpy: Spy;
    let getOverlaysAndSelectionSpy: Spy;
    let getSvgGroupDataIdSpy: Spy;
    let updateTkkOverlayColorSpy: Spy;
    let serviceFillD3SelectionWithColorSpy: Spy;
    let serviceGetD3SelectionByIdSpy: Spy;
    let serviceGetGroupsBySelectorSpy: Spy;

    let expectedSvg: D3Selection;
    let expectedSvgRootGroup: D3Selection;

    let expectedTkkOverlayFillColor: string;
    let expectedTkkOverlayHoverFillColor: string;
    let expectedTkkOverlayTransparentFillColor: string;
    let expectedTkkOverlaySelectionFillColor: string;
    let expectedLinkBoxOverlayFillColor: string;
    let expectedLinkBoxOverlayHoverFillColor: string;
    let expectedOverlayBoxesOpacity: number;
    let expectedOverlayBoxAdditionalSpace: number;
    let expectedOverlayBoxCornerRadius: number;

    let expectedTkkOverlays: EditionSvgOverlay[];
    let expectedLinkBoxes: EditionSvgLinkBox[];

    beforeAll(() => {
        const svgElementPrototype = (globalThis as any).SVGElement?.prototype;

        if (svgElementPrototype && typeof svgElementPrototype.getBBox !== 'function') {
            Object.defineProperty(svgElementPrototype, 'getBBox', {
                value: () => ({ x: 0, y: 0, width: 10, height: 10 }),
                configurable: true,
            });
        }
    });

    beforeEach(() => {
        // Mock service
        mockEditionSvgDrawingService = {
            fillD3SelectionWithColor: (selection: D3Selection, color: string) => {
                if (selection) {
                    selection.attr('fill', color);
                }
            },
            getD3SelectionById: (rootGroup: D3Selection, id: string) => rootGroup?.select('#' + id),
            getD3SelectionByDataId: (rootGroup: D3Selection, dataId: string) => {
                const selection = rootGroup?.selectAll(`[data-tkk-id="${dataId}"]`);
                return selection && !selection.empty() ? selection : rootGroup?.select(`#${dataId}`);
            },
            getGroupsBySelector: (rootGroup: D3Selection, selector: string) => rootGroup?.selectAll('g.' + selector),
        };

        TestBed.configureTestingModule({
            providers: [{ provide: EditionSvgDrawingService, useValue: mockEditionSvgDrawingService }],
        });

        service = TestBed.inject(EditionSvgOverlayService);
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedTkkOverlays = [
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', true),
            new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', true),
        ];

        expectedLinkBoxes = [
            {
                svgGroupId: 'link-box-1',
                linkTo: {
                    complexId: 'testComplex',
                    sheetId: 'Test_Sk1',
                },
            },
        ];

        expectedTkkOverlayFillColor = 'tomato';
        expectedTkkOverlayHoverFillColor = 'orange';
        expectedTkkOverlayTransparentFillColor = 'transparent';
        expectedTkkOverlaySelectionFillColor = 'green';
        expectedLinkBoxOverlayFillColor = '#dddddd';
        expectedLinkBoxOverlayHoverFillColor = '#eeeeee';
        expectedOverlayBoxesOpacity = 0.3;
        expectedOverlayBoxAdditionalSpace = 1.5;
        expectedOverlayBoxCornerRadius = 1;

        expectedSvg = createD3TestSvg(mockDocument);
        expectedSvgRootGroup = createD3TestRootGroup(expectedSvg);
        createD3TestTkkGroups(expectedSvgRootGroup, expectedTkkOverlays);
        createD3TestLinkBoxGroups(expectedSvgRootGroup, expectedLinkBoxes);

        // Spies
        createTkkOverlayGroupSpy = vi.spyOn(service as any, '_createTkkOverlayGroup');
        createTkkOverlayHandlersSpy = vi.spyOn(service as any, '_createTkkOverlayHandlers');
        getOverlaysAndSelectionSpy = vi.spyOn(service as any, '_getOverlaysAndSelection');
        getSvgGroupDataIdSpy = vi.spyOn(service as any, '_getSvgGroupDataId');
        updateTkkOverlayColorSpy = vi.spyOn(service as any, '_updateTkkOverlayColor');

        serviceFillD3SelectionWithColorSpy = vi.spyOn(mockEditionSvgDrawingService, 'fillD3SelectionWithColor');
        serviceGetD3SelectionByIdSpy = vi.spyOn(mockEditionSvgDrawingService, 'getD3SelectionById');
        serviceGetGroupsBySelectorSpy = vi.spyOn(mockEditionSvgDrawingService, 'getGroupsBySelector');
    });

    afterEach(() => {
        mockConsole.clear();
        vi.restoreAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const svgDrawingService = TestBed.inject(EditionSvgDrawingService);
        expectToBe(mockEditionSvgDrawingService === svgDrawingService, true);
    });

    it('... should have `tkkOverlayFillColor = tomato`', () => {
        expectToBe(service.tkkOverlayFillColor, expectedTkkOverlayFillColor);
    });

    it('... should have `tkkOverlayHoverFillColor = orange`', () => {
        expectToBe(service.tkkOverlayHoverFillColor, expectedTkkOverlayHoverFillColor);
    });

    it('... should have `tkkOverlayTransparentFillColor = transparent`', () => {
        expectToBe(service.tkkOverlayTransparentFillColor, expectedTkkOverlayTransparentFillColor);
    });

    it('... should have `tkkOverlaySelectionFillColor = green`', () => {
        expectToBe(service.tkkOverlaySelectionFillColor, expectedTkkOverlaySelectionFillColor);
    });

    it('... should have `linkBoxOverlayFillColor = #dddddd`', () => {
        expectToBe(service.linkBoxOverlayFillColor, expectedLinkBoxOverlayFillColor);
    });

    it('... should have `linkBoxOverlayHoverFillColor = #eeeeee`', () => {
        expectToBe(service.linkBoxOverlayHoverFillColor, expectedLinkBoxOverlayHoverFillColor);
    });

    it('... should have `_overlayBoxesOpacity = 0.3` (private)', () => {
        expectToBe((service as any)._overlayBoxesOpacity, expectedOverlayBoxesOpacity);
    });

    it('... should have `_overlayBoxAdditionalSpace = 1.5` (private)', () => {
        expectToBe((service as any)._overlayBoxAdditionalSpace, expectedOverlayBoxAdditionalSpace);
    });

    it('... should have `_overlayBoxCornerRadius = 1` (private)', () => {
        expectToBe((service as any)._overlayBoxCornerRadius, expectedOverlayBoxCornerRadius);
    });

    describe('#hasAvailableTkkOverlays', () => {
        it('... should have a getter `hasAvailableTkkOverlays`', () => {
            expect(service.hasAvailableTkkOverlays).toBeDefined();
        });

        describe('... should return false when ...`', () => {
            it('should return false when available overlays array is undefined', () => {
                (service as any)._tkkOverlaysState.available = undefined;

                expectToBe(service.hasAvailableTkkOverlays, false);
            });

            it('should return false when available overlays array is empty', () => {
                (service as any)._tkkOverlaysState.available = [];

                expectToBe(service.hasAvailableTkkOverlays, false);
            });
        });

        it('should return true when available overlays array has overlays', () => {
            (service as any)._tkkOverlaysState.available = expectedTkkOverlays;

            expectToBe(service.hasAvailableTkkOverlays, true);
        });
    });

    describe('#clearSvgOverlays()', () => {
        it('... should have a method `clearSvgOverlays`', () => {
            expect(service.clearSvgOverlays).toBeDefined();
        });

        it('... should clear the tkkOverlayState', () => {
            (service as any)._tkkOverlaysState = {
                available: expectedTkkOverlays,
                selected: [expectedTkkOverlays[0]],
            };

            service.clearSvgOverlays();

            expectToEqual((service as any)._tkkOverlaysState, { available: [], selected: [] });
        });
    });

    describe('#createSvgOverlays()', () => {
        it('... should have a method `createSvgOverlays`', () => {
            expect(service.createSvgOverlays).toBeDefined();
        });

        it('... should not throw if svgRootGroupSelection is undefined', () => {
            const onTkkOverlaySelectFn = vi.fn();
            const onLinkBoxSelectFn = vi.fn();

            expect(() => service.createSvgOverlays(undefined, onLinkBoxSelectFn, onTkkOverlaySelectFn)).not.toThrow();
        });

        it('... should trigger `_createOverlaysByType` for both overlay types', () => {
            const overlaysState = (service as any)._tkkOverlaysState;
            const onTkkOverlaySelectFnSpy = vi.fn();
            const onLinkBoxSelectFnSpy = vi.fn();
            const createOverlaysByTypeSpy = vi
                .spyOn(service as any, '_createOverlaysByType')
                .mockImplementation(() => {});
            const createLinkBoxOverlaySpy = vi
                .spyOn(service as any, '_createLinkBoxOverlay')
                .mockImplementation(() => {});
            const createTkkOverlaySpy = vi.spyOn(service as any, '_createTkkOverlay').mockImplementation(() => {});
            const mockGroup = { id: 'test-group' };

            service.createSvgOverlays(expectedSvgRootGroup, onLinkBoxSelectFnSpy, onTkkOverlaySelectFnSpy);

            expectSpyCall(createOverlaysByTypeSpy, 2);
            const callArgsLinkBox = vi.mocked(createOverlaysByTypeSpy).mock.calls[0];
            const callArgsTkk = vi.mocked(createOverlaysByTypeSpy).mock.calls[1];

            // Link box overlay call
            expectToEqual(callArgsLinkBox[0], EditionSvgOverlayTypes.linkBox);
            expectToEqual(callArgsLinkBox[1], expectedSvgRootGroup);
            expectToEqual(callArgsLinkBox[2], overlaysState);
            expectToEqual(callArgsLinkBox[3], expect.any(Function));
            expectToEqual(callArgsLinkBox[4], expect.any(Function));
            // Test that the 4th param is a function that does nothing when called
            const noopFn = callArgsLinkBox[3] as () => void;
            expect(noopFn()).toBeUndefined();
            // Test that the 5th param wraps the correct call to _createLinkBoxOverlay
            const linkBoxOverlayFn = callArgsLinkBox[4] as (group: object, overlayType: string) => void;
            linkBoxOverlayFn(mockGroup, EditionSvgOverlayTypes.linkBox);
            expect(createLinkBoxOverlaySpy).toHaveBeenCalledWith(expectedSvgRootGroup, mockGroup, onLinkBoxSelectFnSpy);

            // Tkk overlay call
            expectToEqual(callArgsTkk[0], EditionSvgOverlayTypes.tkk);
            expectToEqual(callArgsTkk[1], expectedSvgRootGroup);
            expectToEqual(callArgsTkk[2], overlaysState);
            expectToEqual(callArgsTkk[3], onTkkOverlaySelectFnSpy);
            expectToEqual(callArgsTkk[4], expect.any(Function));
            // Test that the 5th param wraps the correct call to _createTkkOverlay
            const tkkOverlayFn = callArgsTkk[4] as (group: object, overlayType: string) => void;
            tkkOverlayFn(mockGroup, EditionSvgOverlayTypes.tkk);
            expect(createTkkOverlaySpy).toHaveBeenCalledWith(expectedSvgRootGroup, overlaysState.available, mockGroup);
        });
    });

    describe('#toggleTkkOverlayHighlights()', () => {
        let expectedOverlayType: string;
        let expectedOverlayGroups: D3Selection;

        beforeEach(() => {
            expectedOverlayType = EditionSvgOverlayTypes.tkk;
            expectedOverlayGroups = expectedSvgRootGroup.selectAll(`.${expectedOverlayType}`);
            (service as any)._tkkOverlaysState = {
                available: expectedTkkOverlays,
                selected: [],
            };

            serviceGetGroupsBySelectorSpy.mockReturnValue(expectedOverlayGroups);

            getOverlaysAndSelectionSpy.mockImplementation((_rootGroup, overlays, dataId, overlayType) => {
                const found = overlays.filter((o: EditionSvgOverlay) => o.dataId === dataId);
                const overlayGroupRectSelection =
                    found.length > 0
                        ? expectedSvgRootGroup.selectAll(`#${found[0]?.dataId} rect.${overlayType}`)
                        : expectedSvgRootGroup.selectAll(`#${dataId} rect.${overlayType}`);
                return [found, overlayGroupRectSelection];
            });
        });

        it('... should have a method `toggleTkkOverlayHighlights`', () => {
            expect(service.toggleTkkOverlayHighlights).toBeDefined();
        });

        it('... should do nothing if rootGroupSelection is undefined', () => {
            service.toggleTkkOverlayHighlights(undefined, expectedOverlayType, true);
            expectSpyCall(serviceGetGroupsBySelectorSpy, 0);
        });

        it('... should trigger `getGroupsBySelector` from service with correct parameters', () => {
            const isCurrentlyHighlighted = true;

            service.toggleTkkOverlayHighlights(expectedSvgRootGroup, expectedOverlayType, isCurrentlyHighlighted);

            expectSpyCall(serviceGetGroupsBySelectorSpy, 1, [expectedSvgRootGroup, expectedOverlayType]);
        });

        it('... should return early if `getGroupsBySelector` returns no overlayGroups', () => {
            serviceGetGroupsBySelectorSpy.mockReturnValue(null);

            service.toggleTkkOverlayHighlights(expectedSvgRootGroup, expectedOverlayType, true);

            expectSpyCall(getSvgGroupDataIdSpy, 0);
            expectSpyCall(getOverlaysAndSelectionSpy, 0);
            expectSpyCall(updateTkkOverlayColorSpy, 0);
        });

        describe('... for each overlay group', () => {
            describe('... should get correct dataId from `_getSvgGroupDataId`', () => {
                it('... with data-tkk-id attribute', () => {
                    const groupWithDataTkkId = {
                        id: 'tkk-1',
                        getAttribute: (attr: string) =>
                            attr === EditionSvgOverlayTypes.dataTkkId ? 'custom-data-id-1' : null,
                    } as any;

                    const dataId = (service as any)._getSvgGroupDataId(groupWithDataTkkId);

                    expect(getSvgGroupDataIdSpy).toHaveBeenCalledWith(groupWithDataTkkId);
                    expectToBe(dataId, 'custom-data-id-1');
                });
                it('... without data-tkk-id attribute', () => {
                    const groupWithoutDataTkkId = {
                        id: 'tkk-2',
                        getAttribute: () => null,
                    } as any;

                    const dataId = (service as any)._getSvgGroupDataId(groupWithoutDataTkkId);

                    expect(getSvgGroupDataIdSpy).toHaveBeenCalledWith(groupWithoutDataTkkId);
                    expectToBe(dataId, 'tkk-2');
                });
            });

            it('... should trigger `_getOverlaysAndSelection` with correct parameters', () => {
                const isCurrentlyHighlighted = true;

                service.toggleTkkOverlayHighlights(expectedSvgRootGroup, expectedOverlayType, isCurrentlyHighlighted);

                expectSpyCall(getOverlaysAndSelectionSpy, expectedOverlayGroups.nodes().length);

                expectedOverlayGroups.nodes().forEach((_node, index) => {
                    const callArgs = vi.mocked(getOverlaysAndSelectionSpy).mock.calls[index];
                    expectToBe(callArgs[0], expectedSvgRootGroup);
                    expectToEqual(callArgs[1], expectedTkkOverlays);
                    expectToBe(callArgs[2], expectedTkkOverlays[index].dataId);
                    expectToBe(callArgs[3], expectedOverlayType);
                });
            });

            describe('... should trigger `_updateTkkOverlayColor` with correct parameters and ...', () => {
                function testToggleTkkOverlayHighlights(
                    description: string,
                    isCurrentlyHighlighted: boolean,
                    expectedActionType: EditionSvgOverlayActionTypes
                ) {
                    it(description, () => {
                        const overlaysArr: EditionSvgOverlay[][] = [];
                        const selectionsArr: D3Selection[] = [];
                        const overlaysAndSelectionByDataId = new Map<string, [EditionSvgOverlay[], D3Selection]>();

                        expectedOverlayGroups.nodes().forEach((_node, index) => {
                            const overlays = [expectedTkkOverlays[index]];
                            const overlayGroupRectSelection = expectedSvgRootGroup.selectAll(
                                `#${expectedTkkOverlays[index].dataId} rect.${expectedOverlayType}`
                            );
                            overlaysArr.push(overlays);
                            selectionsArr.push(overlayGroupRectSelection);
                            overlaysAndSelectionByDataId.set(expectedTkkOverlays[index].dataId, [
                                overlays,
                                overlayGroupRectSelection,
                            ]);
                        });

                        getOverlaysAndSelectionSpy.mockImplementation(
                            (
                                svgRootGroup: D3Selection,
                                overlays: EditionSvgOverlay[],
                                dataId: string,
                                type: EditionSvgOverlayTypes
                            ) => {
                                if (
                                    svgRootGroup === expectedSvgRootGroup &&
                                    overlays === expectedTkkOverlays &&
                                    type === expectedOverlayType
                                ) {
                                    return overlaysAndSelectionByDataId.get(dataId) ?? [[], null];
                                }

                                return [[], null];
                            }
                        );

                        service.toggleTkkOverlayHighlights(
                            expectedSvgRootGroup,
                            expectedOverlayType,
                            isCurrentlyHighlighted
                        );

                        expectSpyCall(updateTkkOverlayColorSpy, expectedOverlayGroups.nodes().length);
                        expectedOverlayGroups.nodes().forEach((_node, index) => {
                            const updateColorSpyCalls = vi.mocked(updateTkkOverlayColorSpy).mock.calls[index];
                            expectToEqual(updateColorSpyCalls[0], overlaysArr[index]);
                            expectToEqual(updateColorSpyCalls[1], selectionsArr[index]);
                            expectToBe(updateColorSpyCalls[2], expectedActionType);
                        });
                    });
                }

                testToggleTkkOverlayHighlights(
                    '... with fill color if `isCurrentlyHighlighted` is true',
                    true,
                    EditionSvgOverlayActionTypes.fill
                );

                testToggleTkkOverlayHighlights(
                    '... with transparent color if `isCurrentlyHighlighted` is false',
                    false,
                    EditionSvgOverlayActionTypes.transparent
                );

                testToggleTkkOverlayHighlights(
                    '... with transparent color if `isCurrentlyHighlighted` is undefined',
                    undefined,
                    EditionSvgOverlayActionTypes.transparent
                );
            });
        });
    });

    describe('#_createOverlaysByType()', () => {
        it('... should have a method `_createOverlaysByType`', () => {
            expect((service as any)._createOverlaysByType).toBeDefined();
        });

        it('... should trigger `getGroupsBySelector` with the correct overlayType (link-box or tkk)', () => {
            const createOverlayTestCases = [
                { overlayType: EditionSvgOverlayTypes.linkBox, mockGroups: [{ id: 'g-lb-1' }] },
                { overlayType: EditionSvgOverlayTypes.tkk, mockGroups: [{ id: 'g-tkk-1' }] },
            ];

            createOverlayTestCases.forEach(({ overlayType, mockGroups }) => {
                const overlaysState = (service as any)._tkkOverlaysState;
                const onTkkOverlaySelectFnSpy = vi.fn();
                const createOverlayFnSpy = vi.fn();
                const mockD3Selection = {
                    nodes: () => mockGroups,
                };

                serviceGetGroupsBySelectorSpy.mockReturnValue(mockD3Selection);

                // Record spy call count before current call
                const countBefore = vi.mocked(serviceGetGroupsBySelectorSpy).mock.calls.length;

                (service as any)._createOverlaysByType(
                    overlayType,
                    expectedSvgRootGroup,
                    overlaysState,
                    onTkkOverlaySelectFnSpy,
                    createOverlayFnSpy
                );

                expectSpyCall(serviceGetGroupsBySelectorSpy, countBefore + 1, [expectedSvgRootGroup, overlayType]);
            });
        });

        it('... should do nothing if `getGroupsBySelector` returns no overlayGroups', () => {
            const overlayType = 'link-box';
            const overlaysState = (service as any)._tkkOverlaysState;
            const onTkkOverlaySelectFnSpy = vi.fn();
            const createOverlayFnSpy = vi.fn();

            serviceGetGroupsBySelectorSpy.mockReturnValue(undefined);

            // Should not throw or call createOverlayFn
            expect(() =>
                (service as any)._createOverlaysByType(
                    overlayType,
                    expectedSvgRootGroup,
                    overlaysState,
                    onTkkOverlaySelectFnSpy,
                    createOverlayFnSpy
                )
            ).not.toThrow();
            expectSpyCall(createOverlayFnSpy, 0);
        });

        it('... should trigger `createOverlayFn` for each overlayGroup', () => {
            const createOverlayTestCases = [
                { overlayType: EditionSvgOverlayTypes.linkBox, mockGroups: [{ id: 'g-lb-1' }] },
                { overlayType: EditionSvgOverlayTypes.tkk, mockGroups: [{ id: 'g-tkk-1' }, { id: 'g-tkk-2' }] },
            ];

            createOverlayTestCases.forEach(({ overlayType, mockGroups }) => {
                const overlaysState = (service as any)._tkkOverlaysState;
                const onTkkOverlaySelectFnSpy = vi.fn();
                const createOverlayFnSpy = vi.fn();
                const mockD3Selection = {
                    nodes: () => mockGroups,
                };

                serviceGetGroupsBySelectorSpy.mockReturnValue(mockD3Selection);

                // Record spy call count before current call
                const countBefore = vi.mocked(serviceGetGroupsBySelectorSpy).mock.calls.length;

                (service as any)._createOverlaysByType(
                    overlayType,
                    expectedSvgRootGroup,
                    overlaysState,
                    onTkkOverlaySelectFnSpy,
                    createOverlayFnSpy
                );

                expectSpyCall(serviceGetGroupsBySelectorSpy, countBefore + 1, [expectedSvgRootGroup, overlayType]);

                expectSpyCall(createOverlayFnSpy, mockGroups.length);
                mockGroups.forEach(group => {
                    expect(createOverlayFnSpy).toHaveBeenCalledWith(group, overlayType);
                });
            });
        });

        it('... should trigger `_createTkkOverlayHandlers` if overlayType is `tkk`', () => {
            const overlayType = EditionSvgOverlayTypes.tkk;
            const overlaysState = (service as any)._tkkOverlaysState;
            const onTkkOverlaySelectFnSpy = vi.fn();
            const createOverlayFnSpy = vi.fn();
            const mockGroups = [{ id: 'g-tkk-1' }];
            const mockD3Selection = {
                nodes: () => mockGroups,
            };

            serviceGetGroupsBySelectorSpy.mockReturnValue(mockD3Selection);

            const countBefore = vi.mocked(createTkkOverlayHandlersSpy).mock.calls.length;

            (service as any)._createOverlaysByType(
                overlayType,
                expectedSvgRootGroup,
                overlaysState,
                onTkkOverlaySelectFnSpy,
                createOverlayFnSpy
            );

            expectSpyCall(createTkkOverlayHandlersSpy, countBefore + 1, [
                expectedSvgRootGroup,
                overlaysState,
                onTkkOverlaySelectFnSpy,
                overlayType,
            ]);
        });

        it('... should not trigger `_createTkkOverlayHandlers` for non-tkk overlayTypes', () => {
            const overlayType = EditionSvgOverlayTypes.linkBox;
            const overlaysState = (service as any)._tkkOverlaysState;
            const onTkkOverlaySelectFnSpy = vi.fn();
            const createOverlayFnSpy = vi.fn();
            const mockGroups = [{ id: 'g-lb-1' }];
            const mockD3Selection = {
                nodes: () => mockGroups,
            };
            serviceGetGroupsBySelectorSpy.mockReturnValue(mockD3Selection);

            const countBefore = vi.mocked(createTkkOverlayHandlersSpy).mock.calls.length;

            (service as any)._createOverlaysByType(
                overlayType,
                expectedSvgRootGroup,
                overlaysState,
                onTkkOverlaySelectFnSpy,
                createOverlayFnSpy
            );

            expectSpyCall(createTkkOverlayHandlersSpy, countBefore);
        });
    });

    describe('#_createLinkBoxOverlay()', () => {
        let mockGroup: any;
        let mockLinkBoxGroupPathSelection: any;
        let mockLinkBoxGroupSelection: any;
        let onLinkBoxSelectSpy: Spy;

        beforeEach(() => {
            mockGroup = { id: 'link-box-1' } as any;
            mockLinkBoxGroupPathSelection = {
                style: vi.fn(),
                attr: vi.fn(),
            };
            mockLinkBoxGroupSelection = {
                select: vi.fn().mockReturnValue(mockLinkBoxGroupPathSelection),
                on: vi.fn().mockImplementation(function (this: any, event: string, handler: any) {
                    this._handlers = this._handlers || {};
                    this._handlers[event] = handler;
                    return this;
                }),
                style: vi.fn(),
            };

            onLinkBoxSelectSpy = vi.fn();
            serviceGetD3SelectionByIdSpy.mockReturnValue(mockLinkBoxGroupSelection);
        });

        it('... should have a method `_createLinkBoxOverlay`', () => {
            expect((service as any)._createLinkBoxOverlay).toBeDefined();
        });

        it('... should trigger `getD3SelectionById` and set fill color', () => {
            (service as any)._createLinkBoxOverlay(expectedSvgRootGroup, mockGroup, onLinkBoxSelectSpy);

            expect(serviceGetD3SelectionByIdSpy).toHaveBeenCalledWith(expectedSvgRootGroup, 'link-box-1');
            expect(mockLinkBoxGroupSelection.select).toHaveBeenCalledWith('path');
            expect(mockLinkBoxGroupPathSelection.style).toHaveBeenCalledWith('fill', service.linkBoxOverlayFillColor);
        });

        it('... should trigger `_createLinkBoxOverlayHandlers` with correct parameters', () => {
            const createLinkBoxOverlayHandlersSpy = vi.spyOn(service as any, '_createLinkBoxOverlayHandlers');

            (service as any)._createLinkBoxOverlay(expectedSvgRootGroup, mockGroup, onLinkBoxSelectSpy);

            expectSpyCall(createLinkBoxOverlayHandlersSpy, 1, [
                mockLinkBoxGroupSelection,
                mockLinkBoxGroupPathSelection,
                mockGroup.id,
                onLinkBoxSelectSpy,
            ]);
        });
    });

    describe('#_createLinkBoxOverlayHandlers()', () => {
        let mockGroup: any;
        let mockLinkBoxGroupPathSelection: any;
        let mockLinkBoxGroupSelection: any;
        let onLinkBoxSelectSpy: Spy;

        beforeEach(() => {
            mockGroup = { id: 'link-box-1' } as any;
            mockLinkBoxGroupPathSelection = {
                style: vi.fn(),
                attr: vi.fn(),
            };
            mockLinkBoxGroupSelection = {
                select: vi.fn().mockReturnValue(mockLinkBoxGroupPathSelection),
                on: vi.fn().mockImplementation(function (this: any, event: string, handler: any) {
                    this._handlers = this._handlers || {};
                    this._handlers[event] = handler;
                    return this;
                }),
                style: vi.fn(),
                attr: vi.fn(),
            };

            onLinkBoxSelectSpy = vi.fn();
        });

        it('... should have a method `_createLinkBoxOverlayHandlers`', () => {
            expect((service as any)._createLinkBoxOverlayHandlers).toBeDefined();
        });

        it('... should set up mouseover, mouseout, and click handlers for each unique dataId', () => {
            (service as any)._createLinkBoxOverlayHandlers(
                mockLinkBoxGroupSelection,
                mockLinkBoxGroupPathSelection,
                mockGroup.id,
                onLinkBoxSelectSpy
            );

            // Should set up handlers for both overlays
            expect(mockLinkBoxGroupSelection.on).toHaveBeenCalledWith('mouseover', expect.any(Function));
            expect(mockLinkBoxGroupSelection.on).toHaveBeenCalledWith('mouseout', expect.any(Function));
            expect(mockLinkBoxGroupSelection.on).toHaveBeenCalledWith('click', expect.any(Function));
            expectToBe(typeof mockLinkBoxGroupSelection._handlers['mouseover'], 'function');
            expectToBe(typeof mockLinkBoxGroupSelection._handlers['mouseout'], 'function');
            expectToBe(typeof mockLinkBoxGroupSelection._handlers['click'], 'function');
        });

        describe('... on `mouseover`', () => {
            it('... should update color via service', () => {
                (service as any)._createLinkBoxOverlayHandlers(
                    mockLinkBoxGroupSelection,
                    mockLinkBoxGroupPathSelection,
                    mockGroup.id,
                    onLinkBoxSelectSpy
                );

                mockLinkBoxGroupSelection._handlers['mouseover']();

                expect(serviceFillD3SelectionWithColorSpy).toHaveBeenCalledWith(
                    mockLinkBoxGroupPathSelection,
                    service.linkBoxOverlayHoverFillColor
                );
            });

            it('... should update cursor style`', () => {
                (service as any)._createLinkBoxOverlayHandlers(
                    mockLinkBoxGroupSelection,
                    mockLinkBoxGroupPathSelection,
                    mockGroup.id,
                    onLinkBoxSelectSpy
                );

                mockLinkBoxGroupSelection._handlers['mouseover']();

                expectSpyCall(mockLinkBoxGroupSelection.style, 1, ['cursor', 'pointer']);
            });
        });

        describe('... on `mouseout`', () => {
            it('... should update color via service', () => {
                (service as any)._createLinkBoxOverlayHandlers(
                    mockLinkBoxGroupSelection,
                    mockLinkBoxGroupPathSelection,
                    mockGroup.id,
                    onLinkBoxSelectSpy
                );

                mockLinkBoxGroupSelection._handlers['mouseout']();

                expect(serviceFillD3SelectionWithColorSpy).toHaveBeenCalledWith(
                    mockLinkBoxGroupPathSelection,
                    service.linkBoxOverlayFillColor
                );
            });
        });

        describe('... on `click`', () => {
            it('... should emit groupId via the callback on `click`', () => {
                (service as any)._createLinkBoxOverlayHandlers(
                    mockLinkBoxGroupSelection,
                    mockLinkBoxGroupPathSelection,
                    mockGroup.id,
                    onLinkBoxSelectSpy
                );

                mockLinkBoxGroupSelection._handlers['click']();

                expectSpyCall(onLinkBoxSelectSpy, 1, [mockGroup.id]);
            });
        });
    });

    describe('#_createTkkOverlay()', () => {
        it('... should have a method `_createTkkOverlay`', () => {
            expect((service as any)._createTkkOverlay).toBeDefined();
        });

        describe('... should do nothing if ...', () => {
            it('... group id is missing', () => {
                const rootGroup: D3Selection = expectedSvgRootGroup;
                const overlays = (service as any)._tkkOverlaysState.available;
                const mockGroup = {
                    id: null,
                    getAttribute: (attr: string) => (attr === 'data-tkk-id' ? 'data-only-id' : null),
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };

                (service as any)._createTkkOverlay(rootGroup, overlays, mockGroup);

                expectSpyCall(createTkkOverlayGroupSpy, 0);
                expectToBe(overlays.length, 0);
            });

            it('... dataId is missing', () => {
                const rootGroup: D3Selection = expectedSvgRootGroup;
                const overlays = (service as any)._tkkOverlaysState.available;
                const mockGroup = {
                    id: 'tkk-only-id',
                    getAttribute: () => null,
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };
                // Force missing dataId
                getSvgGroupDataIdSpy.mockReturnValue(null);

                (service as any)._createTkkOverlay(rootGroup, overlays, mockGroup);

                expectSpyCall(createTkkOverlayGroupSpy, 0);
                expectToBe(overlays.length, 0);
            });

            it('... id and dataId are missing', () => {
                const rootGroup: D3Selection = expectedSvgRootGroup;
                const overlays = (service as any)._tkkOverlaysState.available;
                const mockGroup = {
                    id: null,
                    getAttribute: () => null,
                    getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
                };

                (service as any)._createTkkOverlay(rootGroup, overlays, mockGroup);

                expectSpyCall(createTkkOverlayGroupSpy, 0);
                expectToBe(overlays.length, 0);
            });
        });

        it('... should add a new overlay to the available overlays state array', () => {
            const overlays = (service as any)._tkkOverlaysState.available;
            const mockGroup = {
                id: 'tkk-simple-id',
                getAttribute: () => null,
                getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
            };
            expectToBe(overlays.length, 0);

            (service as any)._createTkkOverlay(expectedSvgRootGroup, overlays, mockGroup);

            expectToBe(overlays.length, 1);
            expectToBe(overlays[0].id, 'tkk-simple-id');
            expectToBe(overlays[0].dataId, 'tkk-simple-id');
        });

        it('... should not add another overlay to availableTkkOverlays if id already exists', () => {
            (service as any)._tkkOverlaysState.available = [
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-unique-id', 'data-unique-id', false),
            ];
            const overlays = (service as any)._tkkOverlaysState.available;
            const mockGroup = {
                id: 'tkk-unique-id',
                getAttribute: (attr: string) => (attr === 'data-tkk-id' ? 'data-unique-id' : null),
                getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
            };
            expectToBe(overlays.length, 1);

            (service as any)._createTkkOverlay(expectedSvgRootGroup, overlays, mockGroup);

            expectToBe(overlays.length, 1);
            expectToBe(overlays[0].id, 'tkk-unique-id');
            expectToBe(overlays[0].dataId, 'data-unique-id');
        });

        it('... should use data-tkk-id attribute as dataId if present (via `getSvgGroupDataId`)', () => {
            const overlays = (service as any)._tkkOverlaysState.available;
            const mockGroup = {
                id: 'tkk-unique-id',
                getAttribute: (attr: string) => (attr === 'data-tkk-id' ? 'data-unique-id' : null),
                getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
            };

            (service as any)._createTkkOverlay(expectedSvgRootGroup, overlays, mockGroup);

            expectSpyCall(getSvgGroupDataIdSpy, 1, mockGroup);
            expectToBe(overlays.length, 1);
            expectToBe(overlays[0].id, 'tkk-unique-id');
            expectToBe(overlays[0].dataId, 'data-unique-id');
        });

        it('... should use id as default dataId if no data-tkk-id attribute is present (via `getSvgGroupDataId`)', () => {
            const overlays = (service as any)._tkkOverlaysState.available;
            const mockGroup = {
                id: 'tkk-no-data-id',
                getAttribute: () => null,
                getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
            };

            (service as any)._createTkkOverlay(expectedSvgRootGroup, overlays, mockGroup);

            expectSpyCall(getSvgGroupDataIdSpy, 1, mockGroup);
            expectToBe(overlays.length, 1);
            expectToBe(overlays[0].id, 'tkk-no-data-id');
            expectToBe(overlays[0].dataId, 'tkk-no-data-id');
        });

        it('... should trigger `createOverlayGroup` with correct arguments', () => {
            const overlays = (service as any)._tkkOverlaysState.available;
            const mockGroup = {
                id: 'tkk-call-id',
                getAttribute: () => 'data-call-id',
                getBBox: () => ({ width: 10, height: 10, x: 0, y: 0 }),
            };

            (service as any)._createTkkOverlay(expectedSvgRootGroup, overlays, mockGroup);

            expectSpyCall(createTkkOverlayGroupSpy, 1, [
                expectedSvgRootGroup,
                'tkk-call-id',
                { width: 10, height: 10, x: 0, y: 0 },
            ]);
        });
    });

    describe('#_createTkkOverlayGroup()', () => {
        it('... should have a method `_createTkkOverlayGroup`', () => {
            expect((service as any)._createTkkOverlayGroup).toBeDefined();
        });

        describe('... should do nothing if', () => {
            it('... no svgRootGroup is provided', () => {
                const rootGroup: D3Selection = null;
                const id = 'tkk-1';
                const dim = expectedSvgRootGroup.nodes()[0].getBBox();

                const d3selections = (service as any)._createTkkOverlayGroup(rootGroup, id, dim);

                expect(d3selections).toBeUndefined();
            });

            it('... no id is provided', () => {
                const rootGroup: D3Selection = expectedSvgRootGroup;
                const id = null;
                const dim = expectedSvgRootGroup.nodes()[0].getBBox();

                const d3selections = (service as any)._createTkkOverlayGroup(rootGroup, id, dim);

                expect(d3selections).toBeUndefined();
            });
        });

        it('... should create an overlay group', () => {
            const rootGroup: D3Selection = expectedSvgRootGroup;
            const id = 'tkk-1';
            const dim = expectedSvgRootGroup.nodes()[0].getBBox();
            const type = EditionSvgOverlayTypes.tkk;

            const d3selections = (service as any)._createTkkOverlayGroup(rootGroup, id, dim);

            expect(d3selections).toBeDefined();
            expectToBe(d3selections.node().nodeName, 'rect');
            expectToContain(d3selections.node().classList, `${type}-overlay-group-box`);
            expectToBe(d3selections.attr('class'), `${type}-overlay-group-box`);
            expectToBe(d3selections.attr('fill'), expectedTkkOverlayFillColor);
            expectToBe(d3selections.attr('opacity'), expectedOverlayBoxesOpacity.toString());
            expectToBe(d3selections.attr('rx'), expectedOverlayBoxCornerRadius.toString());
        });
    });

    describe('#_createTkkOverlayHandlers()', () => {
        let expectedOverlayType: string;
        let expectedOverlaysState: EditionSvgOverlayState;
        let mockOverlayGroupRectSelection: any;
        let onOverlaySelectSpy: Spy;

        beforeEach(() => {
            expectedOverlayType = EditionSvgOverlayTypes.tkk;
            (service as any)._tkkOverlaysState.available = expectedTkkOverlays;
            expectedOverlaysState = (service as any)._tkkOverlaysState;
            mockOverlayGroupRectSelection = {
                on: vi.fn().mockImplementation(function (this: any, event: string, handler: any) {
                    this._handlers = this._handlers || {};
                    this._handlers[event] = handler;
                    return this;
                }),
                style: vi.fn(),
                attr: vi.fn(),
            };

            onOverlaySelectSpy = vi.fn();
            getOverlaysAndSelectionSpy.mockImplementation((_rootGroup, overlays, dataId) => {
                const found = overlays.filter((o: EditionSvgOverlay) => o.dataId === dataId);
                return [found, mockOverlayGroupRectSelection];
            });
        });

        it('... should use default overlayType argument ("tkk") if not provided', () => {
            (service as any)._createTkkOverlayHandlers(
                expectedSvgRootGroup,
                expectedOverlaysState,
                onOverlaySelectSpy
                // Omit overlayType to use default
            );

            expect(getOverlaysAndSelectionSpy).toHaveBeenCalledWith(
                expectedSvgRootGroup,
                expectedOverlaysState.available,
                'tkk-1',
                EditionSvgOverlayTypes.tkk
            );
            expect(getOverlaysAndSelectionSpy).toHaveBeenCalledWith(
                expectedSvgRootGroup,
                expectedOverlaysState.available,
                'tkk-2',
                EditionSvgOverlayTypes.tkk
            );
        });

        it('... should set up mouseover, mouseout, and click handlers for each unique dataId', () => {
            (service as any)._createTkkOverlayHandlers(
                expectedSvgRootGroup,
                expectedOverlaysState,
                onOverlaySelectSpy,
                expectedOverlayType
            );

            // Should set up handlers for both overlays
            expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('mouseover', expect.any(Function));
            expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('mouseout', expect.any(Function));
            expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('click', expect.any(Function));
            expectToBe(typeof mockOverlayGroupRectSelection._handlers['mouseover'], 'function');
            expectToBe(typeof mockOverlayGroupRectSelection._handlers['mouseout'], 'function');
            expectToBe(typeof mockOverlayGroupRectSelection._handlers['click'], 'function');
        });

        describe('... on `mouseover`', () => {
            it('... should update color`', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                mockOverlayGroupRectSelection._handlers['mouseover']();

                expectSpyCall(updateTkkOverlayColorSpy, 1, [
                    [expectedTkkOverlays[1]],
                    mockOverlayGroupRectSelection,
                    EditionSvgOverlayActionTypes.hover,
                ]);
            });

            it('... should update cursor style`', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                mockOverlayGroupRectSelection._handlers['mouseover']();

                expectSpyCall(mockOverlayGroupRectSelection.style, 1, ['cursor', 'pointer']);
            });
        });

        describe('... on `mouseout`', () => {
            it('... should update color', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                mockOverlayGroupRectSelection._handlers['mouseout']();

                expectSpyCall(updateTkkOverlayColorSpy, 1, [
                    [expectedTkkOverlays[1]],
                    mockOverlayGroupRectSelection,
                    EditionSvgOverlayActionTypes.fill,
                ]);
            });
        });

        describe('... on `click`', () => {
            it('... should toggle selection', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                expectToBe(expectedTkkOverlays[0].isSelected, true);
                expectToBe(expectedTkkOverlays[1].isSelected, true);

                mockOverlayGroupRectSelection._handlers['click']();

                expectToBe(expectedTkkOverlays[0].isSelected, true);
                expectToBe(expectedTkkOverlays[1].isSelected, false);
            });

            it('... should trigger update color', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                mockOverlayGroupRectSelection._handlers['click']();

                expectSpyCall(updateTkkOverlayColorSpy, 1, [
                    [expectedTkkOverlays[1]],
                    mockOverlayGroupRectSelection,
                    EditionSvgOverlayActionTypes.hover,
                ]);
            });

            it('... should emit selected overlays via the callback on `click`', () => {
                const expectedSelectedOverlays = [expectedTkkOverlays[0]];

                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                expectToBe(expectedTkkOverlays[0].isSelected, true);
                expectToBe(expectedTkkOverlays[1].isSelected, true);

                mockOverlayGroupRectSelection._handlers['click']();

                expectToBe(expectedTkkOverlays[0].isSelected, true);
                expectToBe(expectedTkkOverlays[1].isSelected, false);

                expectToEqual((service as any)._tkkOverlaysState.selected, expectedSelectedOverlays);

                expectSpyCall(onOverlaySelectSpy, 1, [expectedSelectedOverlays]);
            });

            it('... should keep selection empty if no overlays are found', () => {
                expectedTkkOverlays.forEach(overlay => (overlay.isSelected = false));
                getOverlaysAndSelectionSpy.mockReturnValue([[], mockOverlayGroupRectSelection]);

                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                mockOverlayGroupRectSelection._handlers['click']();

                expectToEqual((service as any)._tkkOverlaysState.selected, []);
                expectSpyCall(updateTkkOverlayColorSpy, 1, [
                    [],
                    mockOverlayGroupRectSelection,
                    EditionSvgOverlayActionTypes.hover,
                ]);
                expectSpyCall(onOverlaySelectSpy, 1, [[]]);
            });
        });

        describe('... with multiple overlays sharing the same dataId', () => {
            let overlays: EditionSvgOverlay[];

            beforeEach(() => {
                const dataId = 'shared-id';
                overlays = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', dataId, false),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', dataId, false),
                ];

                (service as any)._tkkOverlaysState.available = overlays;
                expectedOverlaysState = (service as any)._tkkOverlaysState;

                getOverlaysAndSelectionSpy.mockReturnValue([overlays, mockOverlayGroupRectSelection]);
            });

            it('... should toggle selection for all overlays with the same data-id', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                // Simulate click event
                mockOverlayGroupRectSelection._handlers['click']();

                // Both overlays should have toggled selection
                expectToBe(overlays[0].isSelected, true);
                expectToBe(overlays[1].isSelected, true);
            });

            it('... should update color for all overlays with the same data-id', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                // Simulate click event
                mockOverlayGroupRectSelection._handlers['click']();

                // Should update color for both overlays
                expect(updateTkkOverlayColorSpy).toHaveBeenCalledWith(
                    overlays,
                    mockOverlayGroupRectSelection,
                    EditionSvgOverlayActionTypes.hover
                );
            });

            it('... should emit all selected overlays via the callback on `click`', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    onOverlaySelectSpy,
                    expectedOverlayType
                );

                // Simulate click event
                mockOverlayGroupRectSelection._handlers['click']();

                expectToBe(overlays[0].isSelected, true);
                expectToBe(overlays[1].isSelected, true);

                // Should emit both overlays as selected
                expect(onOverlaySelectSpy).toHaveBeenCalledWith(overlays);
            });
        });
    });

    describe('#_getOverlayGroupRectSelection()', () => {
        it('... should have a method `_getOverlayGroupRectSelection`', () => {
            expect((service as any)._getOverlayGroupRectSelection).toBeDefined();
        });

        describe('... should handle missing parameters if', () => {
            it('... no svgRootGroup is provided (return undefined)', () => {
                let d3selections = (service as any)._getOverlayGroupRectSelection(
                    null,
                    'tkk-1',
                    EditionSvgOverlayTypes.tkk
                );

                expect(d3selections).toBeUndefined();

                d3selections = (service as any)._getOverlayGroupRectSelection(
                    undefined,
                    'tkk-1',
                    EditionSvgOverlayTypes.tkk
                );

                expect(d3selections).toBeUndefined();
            });

            it('... no id is provided (return empty selection)', () => {
                const expectedEmptySelection = expectedSvgRootGroup.selectAll(null);

                let d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    null,
                    EditionSvgOverlayTypes.tkk
                );

                expectToEqual(d3selections, expectedEmptySelection);

                d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    undefined,
                    EditionSvgOverlayTypes.tkk
                );

                expectToEqual(d3selections, expectedEmptySelection);

                d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    '',
                    EditionSvgOverlayTypes.tkk
                );

                expectToEqual(d3selections, expectedEmptySelection);
            });

            it('... no type is provided (return empty selection)', () => {
                const expectedEmptySelection = expectedSvgRootGroup.selectAll(null);
                let d3selections = (service as any)._getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', null);

                expectToEqual(d3selections, expectedEmptySelection);

                d3selections = (service as any)._getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', undefined);

                expectToEqual(d3selections, expectedEmptySelection);

                d3selections = (service as any)._getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', '');

                expectToEqual(d3selections, expectedEmptySelection);
            });
        });

        describe('... should return an empty array if', () => {
            it('... all inputs are provided, but has no overlay group box', () => {
                const d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'tkk-1',
                    EditionSvgOverlayTypes.tkk
                );

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });

            it('... all inputs are provided, but has no overlay group box with given type', () => {
                const tkkGroups = mockEditionSvgDrawingService.getGroupsBySelector(
                    expectedSvgRootGroup,
                    EditionSvgOverlayTypes.tkk
                );
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();
                const otherType = 'other-type';

                (service as any)._createTkkOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions);

                const d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'tkk-1',
                    otherType
                );

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });

            it('... no matching group exists', () => {
                const d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'nonexistent',
                    EditionSvgOverlayTypes.tkk
                );

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 0);
            });
        });

        describe('... should return an array of D3 selections if ...', () => {
            it('... all inputs are provided and has overlay group box with given type', () => {
                const tkkGroups = mockEditionSvgDrawingService.getGroupsBySelector(
                    expectedSvgRootGroup,
                    EditionSvgOverlayTypes.tkk
                );
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();
                const expectedType = EditionSvgOverlayTypes.tkk;

                (service as any)._createTkkOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions);

                const d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'tkk-1',
                    expectedType
                );

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 1);
                expectToContain(d3selections.nodes()[0].classList, `${expectedType}-overlay-group-box`);
            });

            it('... should return the overlay group box if found by id', () => {
                const tkkGroups = mockEditionSvgDrawingService.getGroupsBySelector(
                    expectedSvgRootGroup,
                    EditionSvgOverlayTypes.tkk
                );
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();
                const expectedType = EditionSvgOverlayTypes.tkk;

                (service as any)._createTkkOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions);

                const d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'tkk-1',
                    expectedType
                );

                expect(d3selections).toBeDefined();
                expect(d3selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3selections.nodes().length, 1);
                expectToContain(d3selections.nodes()[0].classList, 'tkk-overlay-group-box');
            });

            it('... a single selection matches the data id', () => {
                const expectedType = EditionSvgOverlayTypes.tkk;
                const group = expectedSvgRootGroup
                    .append('g')
                    .attr('data-tkk-id', 'custom-data-id')
                    .attr('class', EditionSvgOverlayTypes.tkk);
                group.append('rect').attr('class', 'tkk-overlay-group-box');

                const d3Selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'custom-data-id',
                    expectedType
                );

                expect(d3Selections).toBeDefined();
                expect(d3Selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections.nodes().length, 1);
                expectToContain(d3Selections.nodes()[0].classList, `${expectedType}-overlay-group-box`);
            });

            it('... multiple selections match the data id', () => {
                const expectedType = EditionSvgOverlayTypes.tkk;
                const group1 = expectedSvgRootGroup
                    .append('g')
                    .attr('data-tkk-id', 'duplicate-data-id')
                    .attr('class', EditionSvgOverlayTypes.tkk)
                    .attr('id', 'group1');
                group1.append('rect').attr('class', 'tkk-overlay-group-box');
                const group2 = expectedSvgRootGroup
                    .append('g')
                    .attr('data-tkk-id', 'duplicate-data-id')
                    .attr('class', EditionSvgOverlayTypes.tkk)
                    .attr('id', 'group2');
                group2.append('rect').attr('class', 'tkk-overlay-group-box');

                const d3Selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'duplicate-data-id',
                    expectedType
                );

                expect(d3Selections).toBeDefined();
                expect(d3Selections.nodes()).toBeInstanceOf(Array);
                expectToBe(d3Selections.nodes().length, 2);
                const nodeIds = d3Selections.nodes().map(node => node.parentNode.id);
                expectToContain(nodeIds, 'group1');
                expectToContain(nodeIds, 'group2');
            });
        });
    });

    describe('#_getOverlaysAndSelection()', () => {
        it('... should have a method `_getOverlaysAndSelection`', () => {
            expect((service as any)._getOverlaysAndSelection).toBeDefined();
        });

        it('... should trigger `_getOverlaysById` method with correct parameters', () => {
            const expectedOverlayType = EditionSvgOverlayTypes.tkk;
            const expectedOverlayDataId = expectedTkkOverlays[0].dataId;
            const getOverlaysByIdSpy = vi.spyOn(service as any, '_getOverlaysById');

            (service as any)._getOverlaysAndSelection(
                expectedSvgRootGroup,
                expectedTkkOverlays,
                expectedOverlayDataId,
                expectedOverlayType
            );

            expectSpyCall(getOverlaysByIdSpy, 1, [expectedTkkOverlays, expectedOverlayDataId]);
        });

        it('... should trigger `getOverlayGroupRectSelection` method with correct parameters', () => {
            const expectedOverlayType = EditionSvgOverlayTypes.tkk;
            const expectedOverlay = expectedTkkOverlays[0];
            const expectedOverlayGroupRectSelection = expectedSvgRootGroup.select(`#${expectedOverlay.dataId}`);
            const getOverlayGroupRectSelectionSpy = vi
                .spyOn(service as any, '_getOverlayGroupRectSelection')
                .mockReturnValue(expectedOverlayGroupRectSelection);

            (service as any)._getOverlaysAndSelection(
                expectedSvgRootGroup,
                expectedTkkOverlays,
                expectedOverlay.dataId,
                expectedOverlayType
            );

            expectSpyCall(getOverlayGroupRectSelectionSpy, 1, [
                expectedSvgRootGroup,
                expectedOverlay.dataId,
                expectedOverlayType,
            ]);
        });

        it('... should return an overlay array and a selection', () => {
            const expectedOverlayType = EditionSvgOverlayTypes.tkk;
            const expectedOverlay = expectedTkkOverlays[0];
            const expectedOverlayGroupRectSelection = expectedSvgRootGroup.select(`#${expectedOverlay.dataId}`);

            vi.spyOn(service as any, '_getOverlayGroupRectSelection').mockReturnValue(
                expectedOverlayGroupRectSelection
            );

            const [resultOverlays, resultSelection] = (service as any)._getOverlaysAndSelection(
                expectedSvgRootGroup,
                expectedTkkOverlays,
                expectedOverlay.dataId,
                expectedOverlayType
            );

            expectToEqual(resultOverlays, [expectedOverlay]);
            expectToEqual(resultSelection, expectedOverlayGroupRectSelection);
        });
    });

    describe('#_getOverlaysById()', () => {
        it('... should have a method `_getOverlaysById`', () => {
            expect((service as any)._getOverlaysById).toBeDefined();
        });

        describe('... should return empty array', () => {
            it('... if no overlays are given', () => {
                const noOverlays = [];
                const overlay = (service as any)._getOverlaysById(noOverlays, expectedTkkOverlays[0].dataId);

                expectToEqual(overlay, []);
            });

            it('... if overlays is undefined', () => {
                const overlay = (service as any)._getOverlaysById(undefined, expectedTkkOverlays[0].dataId);

                expectToEqual(overlay, []);
            });

            it('... if overlays is null', () => {
                const overlay = (service as any)._getOverlaysById(null, expectedTkkOverlays[0].dataId);

                expectToEqual(overlay, []);
            });

            it('... if no overlay with given dataId is found', () => {
                const overlay = (service as any)._getOverlaysById(expectedTkkOverlays, 'unknown-id');

                expectToEqual(overlay, []);
            });

            it('... if dataId is undefined', () => {
                const overlay = (service as any)._getOverlaysById(expectedTkkOverlays, undefined);

                expectToEqual(overlay, []);
            });

            it('... if dataId is null', () => {
                const overlay = (service as any)._getOverlaysById(expectedTkkOverlays, null);

                expectToEqual(overlay, []);
            });
        });

        it('... should return an overlay with given dataId', () => {
            const overlay = (service as any)._getOverlaysById(expectedTkkOverlays, expectedTkkOverlays[0].dataId);

            expectToEqual(overlay, [expectedTkkOverlays[0]]);
        });

        it('... should return multiple overlays with the same dataId', () => {
            const duplicateDataId = 'duplicate-id';
            const overlaysWithDuplicates = [
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', duplicateDataId, false),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', duplicateDataId, false),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'other-id', 'other-id', false),
            ];

            const result = (service as any)._getOverlaysById(overlaysWithDuplicates, duplicateDataId);

            expectToBe(result.length, 2);
            expectToEqual(result[0].dataId, duplicateDataId);
            expectToEqual(result[1].dataId, duplicateDataId);
        });
    });

    describe('#_getSelectedOverlays()', () => {
        it('... should have a method `_getSelectedOverlays`', () => {
            expect((service as any)._getSelectedOverlays).toBeDefined();
        });

        it('... should return an empty array if no overlays are selected', () => {
            const noSelectedOverlays: EditionSvgOverlay[] = [
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', false),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', false),
            ];

            const selectedOverlays = (service as any)._getSelectedOverlays(noSelectedOverlays);

            expectToEqual(selectedOverlays, []);
        });

        it('... should return only selected overlays', () => {
            const selectableOverlays: EditionSvgOverlay[] = [
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-1', 'tkk-1', true),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-2', 'tkk-2', false),
                new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-3', 'tkk-3', true),
            ];

            const selectedOverlays = (service as any)._getSelectedOverlays(selectableOverlays);

            expectToBe(selectedOverlays.length, 2);
            expectToEqual(selectedOverlays[0], selectableOverlays[0]);
            expectToEqual(selectedOverlays[1], selectableOverlays[2]);
        });
    });

    describe('_getSvgGroupDataId()', () => {
        it('... should have a method `_getSvgGroupDataId`', () => {
            expect((service as any)._getSvgGroupDataId).toBeDefined();
        });

        it('should return data-tkk-id if present', () => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
            group.setAttribute('id', 'g-tkk-1');
            group.setAttribute('data-tkk-id', 'custom-tkk-id');

            const result = (service as any)._getSvgGroupDataId(group);

            expectToBe(result, 'custom-tkk-id');
        });

        it('should return id if data-tkk-id is not present', () => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
            group.setAttribute('id', 'g-tkk-2');
            group.removeAttribute('data-tkk-id');

            const result = (service as any)._getSvgGroupDataId(group);

            expectToBe(result, 'g-tkk-2');
        });

        it('should return empty string if neither id nor data-tkk-id is present', () => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement;
            group.removeAttribute('id');
            group.removeAttribute('data-tkk-id');

            const result = (service as any)._getSvgGroupDataId(group);

            expectToBe(result, '');
        });
    });

    describe('#_getTkkOverlayColor()', () => {
        it('... should have a method `_getTkkOverlayColor`', () => {
            expect((service as any)._getTkkOverlayColor).toBeDefined();
        });

        it('... should return a color string', () => {
            const color = (service as any)._getTkkOverlayColor(undefined, EditionSvgOverlayActionTypes.fill);

            expect(color).toBeDefined();
            expectToBe(typeof color, 'string');
        });

        it('... should return overlayFillColor if overlay is not given', () => {
            const color = (service as any)._getTkkOverlayColor(undefined, EditionSvgOverlayActionTypes.fill);

            expectToBe(color, expectedTkkOverlayFillColor);
        });

        it('... should return overlayTransparentFillColor if overlayActionType is `transparent` no matter if overlay is selected or not', () => {
            const overlay = expectedTkkOverlays[0];
            const color = (service as any)._getTkkOverlayColor(overlay, EditionSvgOverlayActionTypes.transparent);

            expectToBe(color, expectedTkkOverlayTransparentFillColor);

            overlay.isSelected = false;
            const color2 = (service as any)._getTkkOverlayColor(overlay, EditionSvgOverlayActionTypes.transparent);

            expectToBe(color2, expectedTkkOverlayTransparentFillColor);
        });

        it('... should return tkkOverlaySelectionFillColor if overlay is selected no matter if overlayActionType is `hover` or `fill`, but not for `transparent`', () => {
            const selectedOverlay = expectedTkkOverlays[0];
            const color = (service as any)._getTkkOverlayColor(selectedOverlay, EditionSvgOverlayActionTypes.fill);

            expectToBe(color, expectedTkkOverlaySelectionFillColor);

            const color2 = (service as any)._getTkkOverlayColor(selectedOverlay, EditionSvgOverlayActionTypes.hover);

            expectToBe(color2, expectedTkkOverlaySelectionFillColor);

            const color3 = (service as any)._getTkkOverlayColor(
                selectedOverlay,
                EditionSvgOverlayActionTypes.transparent
            );

            expect(color3).not.toBe(expectedTkkOverlaySelectionFillColor);
        });

        it('... should return overlayHoverFillColor if overlay is not selected and overlayActionType is `hover`', () => {
            const notSelectedOverlay = expectedTkkOverlays[0];
            notSelectedOverlay.isSelected = false;
            const color = (service as any)._getTkkOverlayColor(notSelectedOverlay, EditionSvgOverlayActionTypes.hover);

            expectToBe(color, expectedTkkOverlayHoverFillColor);
        });

        it('... should return overlayFillColor if overlay is not selected and overlayActionType is not `hover` or `transparent`', () => {
            const notSelectedOverlay = expectedTkkOverlays[0];
            notSelectedOverlay.isSelected = false;
            const color = (service as any)._getTkkOverlayColor(notSelectedOverlay, EditionSvgOverlayActionTypes.fill);

            expectToBe(color, expectedTkkOverlayFillColor);

            const color2 = (service as any)._getTkkOverlayColor(
                notSelectedOverlay,
                EditionSvgOverlayActionTypes.transparent
            );

            expect(color2).not.toBe(expectedTkkOverlayFillColor);
        });
    });

    describe('#_updateTkkOverlayColor()', () => {
        it('... should have a method `_updateTkkOverlayColor`', () => {
            expect((service as any)._updateTkkOverlayColor).toBeDefined();
        });

        describe('... should do nothing if', () => {
            let d3selections: D3Selection;

            beforeEach(() => {
                const expectedType = EditionSvgOverlayTypes.tkk;
                const tkkGroups = mockEditionSvgDrawingService.getGroupsBySelector(expectedSvgRootGroup, expectedType);
                const tkkNode = tkkGroups.nodes()[0] as any;
                const expectedDimensions = tkkNode?.getBBox ? tkkNode.getBBox() : { x: 0, y: 0, width: 10, height: 10 };

                (service as any)._createTkkOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions);

                d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'tkk-1',
                    expectedType
                );
            });

            it('... no overlays are provided', () => {
                (service as any)._updateTkkOverlayColor([], d3selections, EditionSvgOverlayActionTypes.fill);

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 0);
            });

            it('... no D3 selection is provided', () => {
                const overlay = expectedTkkOverlays[0];
                (service as any)._updateTkkOverlayColor([overlay], null, EditionSvgOverlayActionTypes.fill);

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 0);
            });

            it('... no overlayActionType is provided', () => {
                const overlay = expectedTkkOverlays[0];
                (service as any)._updateTkkOverlayColor([overlay], d3selections, null);

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 0);
            });
        });

        describe('... should trigger `fillD3SelectionWithColor` with the correct color when', () => {
            let d3selections: D3Selection;

            beforeEach(() => {
                const expectedType = EditionSvgOverlayTypes.tkk;
                const tkkGroups = mockEditionSvgDrawingService.getGroupsBySelector(expectedSvgRootGroup, expectedType);
                const tkkNode = tkkGroups.nodes()[0] as any;
                const expectedDimensions = tkkNode?.getBBox ? tkkNode.getBBox() : { x: 0, y: 0, width: 10, height: 10 };

                (service as any)._createTkkOverlayGroup(expectedSvgRootGroup, 'tkk-1', expectedDimensions);

                d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    'tkk-1',
                    expectedType
                );
            });

            it('... there is only a single overlay given', () => {
                const overlay = expectedTkkOverlays[0];

                (service as any)._updateTkkOverlayColor([overlay], d3selections, EditionSvgOverlayActionTypes.fill);

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [
                    d3selections,
                    expectedTkkOverlaySelectionFillColor,
                ]);
            });

            it('... there are multiple overlays given (all with the same color)', () => {
                (service as any)._updateTkkOverlayColor(
                    expectedTkkOverlays,
                    d3selections,
                    EditionSvgOverlayActionTypes.fill
                );

                // Only one call, color from first overlay
                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [
                    d3selections,
                    expectedTkkOverlaySelectionFillColor,
                ]);
            });

            it('... there are multiple overlays given (with different colors; log a warning)', () => {
                const overlays = [
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-10', 'data-tkk-id-1', true),
                    new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'tkk-20', 'data-tkk-id-1', false),
                ];
                const expectedUniqueColors = [expectedTkkOverlaySelectionFillColor, 'blue'];

                // Return different colors for each overlay
                vi.spyOn(service as any, '_getTkkOverlayColor').mockImplementation((overlay: any) => {
                    if (overlay && overlay.id === 'tkk-20') {
                        return expectedUniqueColors[1];
                    }
                    return expectedUniqueColors[0];
                });
                const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(mockConsole.log); // Catch console output

                (service as any)._updateTkkOverlayColor(overlays, d3selections, EditionSvgOverlayActionTypes.fill);

                expectSpyCall(consoleSpy, 1, [
                    '[EditionSvgOverlayService] Multiple overlays for the same group have different colors:',
                    expectedUniqueColors,
                    overlays,
                ]);

                // Should still trigger fillD3SelectionWithColor with the first unique color
                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [d3selections, expectedUniqueColors[0]]);
            });

            it('... overlayActionType is `transparent`', () => {
                const overlay = expectedTkkOverlays[0];

                (service as any)._updateTkkOverlayColor(
                    [overlay],
                    d3selections,
                    EditionSvgOverlayActionTypes.transparent
                );

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [
                    d3selections,
                    expectedTkkOverlayTransparentFillColor,
                ]);
            });

            it('... overlay is selected no matter if overlayActionType is `hover` or `fill`, but not for `transparent`', () => {
                const selectedOverlay = expectedTkkOverlays[0];

                (service as any)._updateTkkOverlayColor(
                    [selectedOverlay],
                    d3selections,
                    EditionSvgOverlayActionTypes.fill
                );

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [
                    d3selections,
                    expectedTkkOverlaySelectionFillColor,
                ]);

                (service as any)._updateTkkOverlayColor(
                    [selectedOverlay],
                    d3selections,
                    EditionSvgOverlayActionTypes.hover
                );

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 2, [
                    d3selections,
                    expectedTkkOverlaySelectionFillColor,
                ]);

                (service as any)._updateTkkOverlayColor(
                    [selectedOverlay],
                    d3selections,
                    EditionSvgOverlayActionTypes.transparent
                );

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 3, [
                    d3selections,
                    expectedTkkOverlayTransparentFillColor,
                ]);
            });

            it('... overlay is not selected and overlayActionType is `hover`', () => {
                const notSelectedOverlay = expectedTkkOverlays[0];

                notSelectedOverlay.isSelected = false;

                (service as any)._updateTkkOverlayColor(
                    [notSelectedOverlay],
                    d3selections,
                    EditionSvgOverlayActionTypes.hover
                );

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [d3selections, expectedTkkOverlayHoverFillColor]);
            });

            it('... overlay is not selected and overlayActionType is not `hover` or `transparent`', () => {
                const notSelectedOverlay = expectedTkkOverlays[0];
                notSelectedOverlay.isSelected = false;

                (service as any)._updateTkkOverlayColor(
                    [notSelectedOverlay],
                    d3selections,
                    EditionSvgOverlayActionTypes.fill
                );

                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [d3selections, expectedTkkOverlayFillColor]);
            });
        });
    });
});
