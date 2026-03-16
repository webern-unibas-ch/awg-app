import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

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

import { DOCUMENT } from '@angular/core';
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
        createTkkOverlayGroupSpy = spyOn(service as any, '_createTkkOverlayGroup').and.callThrough();
        createTkkOverlayHandlersSpy = spyOn(service as any, '_createTkkOverlayHandlers').and.callThrough();
        getOverlaysAndSelectionSpy = spyOn(service as any, '_getOverlaysAndSelection').and.callThrough();
        getSvgGroupDataIdSpy = spyOn(service as any, '_getSvgGroupDataId').and.callThrough();
        updateTkkOverlayColorSpy = spyOn(service as any, '_updateTkkOverlayColor').and.callThrough();

        serviceFillD3SelectionWithColorSpy = spyOn(
            mockEditionSvgDrawingService,
            'fillD3SelectionWithColor'
        ).and.callThrough();
        serviceGetD3SelectionByIdSpy = spyOn(mockEditionSvgDrawingService, 'getD3SelectionById').and.callThrough();
        serviceGetGroupsBySelectorSpy = spyOn(mockEditionSvgDrawingService, 'getGroupsBySelector').and.callThrough();
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

            expect((service as any)._tkkOverlaysState).toEqual({ available: [], selected: [] });
        });
    });

    describe('#createSvgOverlays()', () => {
        it('... should have a method `createSvgOverlays`', () => {
            expect(service.createSvgOverlays).toBeDefined();
        });

        it('... should not throw if svgRootGroupSelection is undefined', () => {
            const onTkkOverlaySelectFn = jasmine.createSpy('onTkkOverlaySelectFn');
            const onLinkBoxSelectFn = jasmine.createSpy('onLinkBoxSelectFn');

            expect(() => service.createSvgOverlays(undefined, onLinkBoxSelectFn, onTkkOverlaySelectFn)).not.toThrow();
        });

        it('... should trigger `_createOverlaysByType` for both overlay types', () => {
            const overlaysState = (service as any)._tkkOverlaysState;
            const onTkkOverlaySelectFnSpy = jasmine.createSpy('onTkkOverlaySelectFn');
            const onLinkBoxSelectFnSpy = jasmine.createSpy('onLinkBoxSelectFn');
            const createOverlaysByTypeSpy = spyOn(service as any, '_createOverlaysByType').and.stub();
            const createLinkBoxOverlaySpy = spyOn(service as any, '_createLinkBoxOverlay').and.stub();
            const createTkkOverlaySpy = spyOn(service as any, '_createTkkOverlay').and.stub();
            const mockGroup = { id: 'test-group' };

            service.createSvgOverlays(expectedSvgRootGroup, onLinkBoxSelectFnSpy, onTkkOverlaySelectFnSpy);

            expectSpyCall(createOverlaysByTypeSpy, 2);
            const callArgsLinkBox = createOverlaysByTypeSpy.calls.all()[0].args;
            const callArgsTkk = createOverlaysByTypeSpy.calls.all()[1].args;

            // Link box overlay call
            expectToEqual(callArgsLinkBox[0], EditionSvgOverlayTypes.linkBox);
            expectToEqual(callArgsLinkBox[1], expectedSvgRootGroup);
            expectToEqual(callArgsLinkBox[2], overlaysState);
            expectToEqual(callArgsLinkBox[3], jasmine.any(Function));
            expectToEqual(callArgsLinkBox[4], jasmine.any(Function));
            // Test that the 4th param is a function that does nothing when called
            expect(callArgsLinkBox[3]()).toBeUndefined();
            // Test that the 5th param wraps the correct call to _createLinkBoxOverlay
            callArgsLinkBox[4](mockGroup, EditionSvgOverlayTypes.linkBox);
            expect(createLinkBoxOverlaySpy).toHaveBeenCalledWith(expectedSvgRootGroup, mockGroup, onLinkBoxSelectFnSpy);

            // Tkk overlay call
            expectToEqual(callArgsTkk[0], EditionSvgOverlayTypes.tkk);
            expectToEqual(callArgsTkk[1], expectedSvgRootGroup);
            expectToEqual(callArgsTkk[2], overlaysState);
            expectToEqual(callArgsTkk[3], onTkkOverlaySelectFnSpy);
            expectToEqual(callArgsTkk[4], jasmine.any(Function));
            // Test that the 5th param wraps the correct call to _createTkkOverlay
            callArgsTkk[4](mockGroup, EditionSvgOverlayTypes.tkk);
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

            serviceGetGroupsBySelectorSpy.and.returnValue(expectedOverlayGroups);

            getOverlaysAndSelectionSpy.and.callFake((_rootGroup, overlays, dataId, overlayType) => {
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

        it('... should trigger `getGroupsBySelector` from service with correct parameters', () => {
            const isCurrentlyHighlighted = true;

            service.toggleTkkOverlayHighlights(expectedSvgRootGroup, expectedOverlayType, isCurrentlyHighlighted);

            expectSpyCall(serviceGetGroupsBySelectorSpy, 1, [expectedSvgRootGroup, expectedOverlayType]);
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
                    expect(dataId).toBe('custom-data-id-1');
                });
                it('... without data-tkk-id attribute', () => {
                    const groupWithoutDataTkkId = {
                        id: 'tkk-2',
                        getAttribute: () => null,
                    } as any;

                    const dataId = (service as any)._getSvgGroupDataId(groupWithoutDataTkkId);

                    expect(getSvgGroupDataIdSpy).toHaveBeenCalledWith(groupWithoutDataTkkId);
                    expect(dataId).toBe('tkk-2');
                });
            });

            it('... should trigger `_getOverlaysAndSelection` with correct parameters', () => {
                const isCurrentlyHighlighted = true;

                service.toggleTkkOverlayHighlights(expectedSvgRootGroup, expectedOverlayType, isCurrentlyHighlighted);

                expectSpyCall(getOverlaysAndSelectionSpy, expectedOverlayGroups.nodes().length);

                expectedOverlayGroups.nodes().forEach((_node, index) => {
                    const callArgs = getOverlaysAndSelectionSpy.calls.argsFor(index);
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

                        expectedOverlayGroups.nodes().forEach((_node, index) => {
                            const overlays = [expectedTkkOverlays[index]];
                            const overlayGroupRectSelection = expectedSvgRootGroup.selectAll(
                                `#${expectedTkkOverlays[index].dataId} rect.${expectedOverlayType}`
                            );
                            overlaysArr.push(overlays);
                            selectionsArr.push(overlayGroupRectSelection);
                            getOverlaysAndSelectionSpy
                                .withArgs(
                                    expectedSvgRootGroup,
                                    expectedTkkOverlays,
                                    expectedTkkOverlays[index].dataId,
                                    expectedOverlayType
                                )
                                .and.returnValue([overlays, overlayGroupRectSelection]);
                        });

                        service.toggleTkkOverlayHighlights(
                            expectedSvgRootGroup,
                            expectedOverlayType,
                            isCurrentlyHighlighted
                        );

                        expectSpyCall(updateTkkOverlayColorSpy, expectedOverlayGroups.nodes().length);
                        expectedOverlayGroups.nodes().forEach((_node, index) => {
                            const updateColorSpyCalls = updateTkkOverlayColorSpy.calls.all()[index];
                            expectToEqual(updateColorSpyCalls.args[0], overlaysArr[index]);
                            expectToEqual(updateColorSpyCalls.args[1], selectionsArr[index]);
                            expectToBe(updateColorSpyCalls.args[2], expectedActionType);
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
                const onTkkOverlaySelectFnSpy = jasmine.createSpy('onTkkOverlaySelectFn');
                const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
                const mockD3Selection = {
                    nodes: () => mockGroups,
                };

                serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

                // Record spy call count before current call
                const countBefore = serviceGetGroupsBySelectorSpy.calls.count();

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
            const onTkkOverlaySelectFnSpy = jasmine.createSpy('onTkkOverlaySelectFn');
            const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');

            serviceGetGroupsBySelectorSpy.and.returnValue(undefined);

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
                const onTkkOverlaySelectFnSpy = jasmine.createSpy('onTkkOverlaySelectFn');
                const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
                const mockD3Selection = {
                    nodes: () => mockGroups,
                };

                serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

                // Record spy call count before current call
                const countBefore = serviceGetGroupsBySelectorSpy.calls.count();

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
            const onTkkOverlaySelectFnSpy = jasmine.createSpy('onTkkOverlaySelectFn');
            const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
            const mockGroups = [{ id: 'g-tkk-1' }];
            const mockD3Selection = {
                nodes: () => mockGroups,
            };

            serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

            const countBefore = createTkkOverlayHandlersSpy.calls.count();

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
                overlayType,
                onTkkOverlaySelectFnSpy,
            ]);
        });

        it('... should not trigger `_createTkkOverlayHandlers` for non-tkk overlayTypes', () => {
            const overlayType = EditionSvgOverlayTypes.linkBox;
            const overlaysState = (service as any)._tkkOverlaysState;
            const onTkkOverlaySelectFnSpy = jasmine.createSpy('onTkkOverlaySelectFn');
            const createOverlayFnSpy = jasmine.createSpy('createOverlayFn');
            const mockGroups = [{ id: 'g-lb-1' }];
            const mockD3Selection = {
                nodes: () => mockGroups,
            };
            serviceGetGroupsBySelectorSpy.and.returnValue(mockD3Selection);

            const countBefore = createTkkOverlayHandlersSpy.calls.count();

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
                style: jasmine.createSpy('style'),
                attr: jasmine.createSpy('attr'),
            };
            mockLinkBoxGroupSelection = {
                select: jasmine.createSpy('select').and.returnValue(mockLinkBoxGroupPathSelection),
                on: jasmine.createSpy('on').and.callFake(function (event, handler) {
                    this._handlers = this._handlers || {};
                    this._handlers[event] = handler;
                    return this;
                }),
                style: jasmine.createSpy('style'),
            };

            onLinkBoxSelectSpy = jasmine.createSpy('onLinkBoxSelect');
            serviceGetD3SelectionByIdSpy.and.returnValue(mockLinkBoxGroupSelection);
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
            const createLinkBoxOverlayHandlersSpy = spyOn(
                service as any,
                '_createLinkBoxOverlayHandlers'
            ).and.callThrough();

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
                style: jasmine.createSpy('style'),
                attr: jasmine.createSpy('attr'),
            };
            mockLinkBoxGroupSelection = {
                select: jasmine.createSpy('select').and.returnValue(mockLinkBoxGroupPathSelection),
                on: jasmine.createSpy('on').and.callFake(function (event, handler) {
                    this._handlers = this._handlers || {};
                    this._handlers[event] = handler;
                    return this;
                }),
                style: jasmine.createSpy('style'),
                attr: jasmine.createSpy('attr'),
            };

            onLinkBoxSelectSpy = jasmine.createSpy('onLinkBoxSelect');
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
            expect(mockLinkBoxGroupSelection.on).toHaveBeenCalledWith('mouseover', jasmine.any(Function));
            expect(mockLinkBoxGroupSelection.on).toHaveBeenCalledWith('mouseout', jasmine.any(Function));
            expect(mockLinkBoxGroupSelection.on).toHaveBeenCalledWith('click', jasmine.any(Function));
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
                on: jasmine.createSpy('on').and.callFake(function (event, handler) {
                    this._handlers = this._handlers || {};
                    this._handlers[event] = handler;
                    return this;
                }),
                style: jasmine.createSpy('style'),
                attr: jasmine.createSpy('attr'),
            };

            onOverlaySelectSpy = jasmine.createSpy('onOverlaySelect');
            getOverlaysAndSelectionSpy.and.callFake((_rootGroup, overlays, dataId) => {
                const found = overlays.filter((o: EditionSvgOverlay) => o.dataId === dataId);
                return [found, mockOverlayGroupRectSelection];
            });
        });

        it('... should use default overlayType argument ("tkk") if not provided', () => {
            (service as any)._createTkkOverlayHandlers(
                expectedSvgRootGroup,
                expectedOverlaysState,
                undefined, // Omit overlayType to use default
                onOverlaySelectSpy
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
                expectedOverlayType,
                onOverlaySelectSpy
            );

            // Should set up handlers for both overlays
            expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('mouseover', jasmine.any(Function));
            expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('mouseout', jasmine.any(Function));
            expect(mockOverlayGroupRectSelection.on).toHaveBeenCalledWith('click', jasmine.any(Function));
            expectToBe(typeof mockOverlayGroupRectSelection._handlers['mouseover'], 'function');
            expectToBe(typeof mockOverlayGroupRectSelection._handlers['mouseout'], 'function');
            expectToBe(typeof mockOverlayGroupRectSelection._handlers['click'], 'function');
        });

        describe('... on `mouseover`', () => {
            it('... should update color`', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    expectedOverlayType,
                    onOverlaySelectSpy
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
                    expectedOverlayType,
                    onOverlaySelectSpy
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
                    expectedOverlayType,
                    onOverlaySelectSpy
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
                    expectedOverlayType,
                    onOverlaySelectSpy
                );

                expect(expectedTkkOverlays[0].isSelected).toBe(true);
                expect(expectedTkkOverlays[1].isSelected).toBe(true);

                mockOverlayGroupRectSelection._handlers['click']();

                expect(expectedTkkOverlays[0].isSelected).toBe(true);
                expect(expectedTkkOverlays[1].isSelected).toBe(false);
            });

            it('... should trigger update color', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    expectedOverlayType,
                    onOverlaySelectSpy
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
                    expectedOverlayType,
                    onOverlaySelectSpy
                );

                expect(expectedTkkOverlays[0].isSelected).toBe(true);
                expect(expectedTkkOverlays[1].isSelected).toBe(true);

                mockOverlayGroupRectSelection._handlers['click']();

                expect(expectedTkkOverlays[0].isSelected).toBe(true);
                expect(expectedTkkOverlays[1].isSelected).toBe(false);

                expectToEqual((service as any)._tkkOverlaysState.selected, expectedSelectedOverlays);

                expectSpyCall(onOverlaySelectSpy, 1, [expectedSelectedOverlays]);
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

                getOverlaysAndSelectionSpy.and.returnValue([overlays, mockOverlayGroupRectSelection]);
            });

            it('... should toggle selection for all overlays with the same data-id', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    expectedOverlayType,
                    onOverlaySelectSpy
                );

                // Simulate click event
                mockOverlayGroupRectSelection._handlers['click']();

                // Both overlays should have toggled selection
                expect(overlays[0].isSelected).toBe(true);
                expect(overlays[1].isSelected).toBe(true);
            });

            it('... should update color for all overlays with the same data-id', () => {
                (service as any)._createTkkOverlayHandlers(
                    expectedSvgRootGroup,
                    expectedOverlaysState,
                    expectedOverlayType,
                    onOverlaySelectSpy
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
                    expectedOverlayType,
                    onOverlaySelectSpy
                );

                // Simulate click event
                mockOverlayGroupRectSelection._handlers['click']();

                expect(overlays[0].isSelected).toBe(true);
                expect(overlays[1].isSelected).toBe(true);

                // Should emit both overlays as selected
                expect(onOverlaySelectSpy).toHaveBeenCalledWith(overlays);
            });
        });
    });

    describe('#_getOverlayGroupRectSelection()', () => {
        it('... should have a method `_getOverlayGroupRectSelection`', () => {
            expect((service as any)._getOverlayGroupRectSelection).toBeDefined();
        });

        describe('... should return undefined if', () => {
            it('... no svgRootGroup is provided', () => {
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

            it('... no id is provided', () => {
                let d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    null,
                    EditionSvgOverlayTypes.tkk
                );

                expect(d3selections).toBeUndefined();

                d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    undefined,
                    EditionSvgOverlayTypes.tkk
                );

                expect(d3selections).toBeUndefined();

                d3selections = (service as any)._getOverlayGroupRectSelection(
                    expectedSvgRootGroup,
                    '',
                    EditionSvgOverlayTypes.tkk
                );

                expect(d3selections).toBeUndefined();
            });

            it('... no type is provided', () => {
                let d3selections = (service as any)._getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', null);

                expect(d3selections).toBeUndefined();

                d3selections = (service as any)._getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', undefined);

                expect(d3selections).toBeUndefined();

                d3selections = (service as any)._getOverlayGroupRectSelection(expectedSvgRootGroup, 'tkk-1', '');

                expect(d3selections).toBeUndefined();
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
                expect(d3selections.nodes().length).toBe(0);
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
                expect(d3selections.nodes().length).toBe(1);
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
                expect(d3Selections.nodes().length).toBe(1);
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
                expect(d3Selections.nodes().length).toBe(2);
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
            const getOverlaysByIdSpy = spyOn(service as any, '_getOverlaysById').and.callThrough();

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
            const getOverlayGroupRectSelectionSpy = spyOn(
                service as any,
                '_getOverlayGroupRectSelection'
            ).and.returnValue(expectedOverlayGroupRectSelection);

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

            spyOn(service as any, '_getOverlayGroupRectSelection').and.returnValue(expectedOverlayGroupRectSelection);

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
            expect(color).toBeInstanceOf(String);
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
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();

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
                const expectedDimensions = tkkGroups.nodes()[0].getBBox();

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
                const colorSpy = spyOn(service as any, '_getTkkOverlayColor').and.callFake(
                    (overlay: EditionSvgOverlay) => {
                        if (overlay && overlay.id === 'tkk-20') {
                            return expectedUniqueColors[1];
                        }
                        return expectedUniqueColors[0];
                    }
                );
                const consoleSpy = spyOn(console, 'warn').and.callFake(mockConsole.log); // Catch console output

                (service as any)._updateTkkOverlayColor(overlays, d3selections, EditionSvgOverlayActionTypes.fill);

                expectSpyCall(consoleSpy, 1, [
                    '[EditionSvgDrawingService] Multiple overlays for the same group have different colors:',
                    expectedUniqueColors,
                    overlays,
                ]);

                // Should still trigger fillD3SelectionWithColor with the first unique color
                expectSpyCall(serviceFillD3SelectionWithColorSpy, 1, [d3selections, expectedUniqueColors[0]]);

                colorSpy.and.callThrough();
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
