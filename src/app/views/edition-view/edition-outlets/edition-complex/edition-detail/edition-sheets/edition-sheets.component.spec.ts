import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { ActivatedRouteStub, UrlSegmentStub } from '@testing/router-stubs';
import { createTestTkkOverlay } from '@testing/svg-drawing-helper';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { FullscreenService } from '@awg-shared/fullscreen/fullscreen.service';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { EditionNavigationSheetTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import {
    EditionSvgSheet,
    EditionSvgSheetSelection,
    EditionSvgSheetsList,
} from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioConvolute, FolioConvoluteList } from '@awg-views/edition-view/models/folio.model';
import { Textcritics, TextcriticsList } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionFoliosPanelComponent } from './edition-folios-panel/edition-folios-panel.component';
import { EditionSheetsPanelComponent } from './edition-sheets-panel/edition-sheets-panel.component';
import { EditionSheetsComponent } from './edition-sheets.component';
import { EDITION_SHEETS_UTILS } from './edition-sheets.utils';

describe('EditionSheetsComponent (DONE)', () => {
    let component: EditionSheetsComponent;
    let fixture: ComponentFixture<EditionSheetsComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let expectedRouteUrl: UrlSegmentStub[] = [];
    const expectedPath = 'sheets';

    let editionStateService: EditionStateService;
    let mockNavigationService: Partial<EditionNavigationService>;

    let onSheetBrowseSpy: Spy;
    let onLinkBoxSelectSpy: Spy;
    let onOverlaySelectSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let mockViewDataSignal: WritableSignal<EditionViewData<'sheets'>>;
    let expectedViewDataContent: EditionViewDataContent<'sheets'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'sheets'>;
    let expectedConvolute: FolioConvolute;
    let expectedComplex: EditionComplex;
    let expectedFolioConvoluteData: FolioConvoluteList;
    let expectedSvgSheetsData: EditionSvgSheetsList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSelection: EditionSvgSheetSelection;
    let expectedSelectionWithPartial: EditionSvgSheetSelection;
    let expectedTextcriticsListData: TextcriticsList;
    let expectedSelectedTextcritics: Textcritics;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

    /**
     * Sets the view data with the given changes to the textcritics of the expected svg sheet.
     */
    const setSelectedTextcritics = (changes: Partial<Textcritics>): void => {
        const textcritics = expectedTextcriticsListData.textcritics.map(textcritic =>
            textcritic.id === expectedSvgSheet.id ? { ...textcritic, ...changes } : textcritic
        );
        mockViewDataSignal.set(
            createMockViewData({ ...expectedViewDataContent, textcriticsData: { textcritics } as TextcriticsList })
        );
    };

    /**
     * Sets the given sheet id as query param `id` of the route.
     */
    const setSheetIdInRoute = (id: string): void => {
        mockActivatedRoute.testQueryParamMap = { id };
    };

    beforeEach(async () => {
        // Mocked activated route
        // See https://gist.github.com/benjamincharity/3d25cd2c95b6ecffadb18c3d4dbbd80b
        expectedRouteUrl = [{ path: expectedPath }];

        mockActivatedRoute = new ActivatedRouteStub();
        mockActivatedRoute.testUrl = expectedRouteUrl;

        // Mock services
        expectedDefaultViewDataContent = {
            folioConvoluteData: new FolioConvoluteList(),
            svgSheetsData: new EditionSvgSheetsList(),
            textcriticsData: new TextcriticsList(),
        };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetsComponent],
            providers: [
                { provide: EditionNavigationService, useValue: mockNavigationService },
                { provide: EditionViewService, useValue: { sheetsViewData: mockViewDataSignal.asReadonly() } },
                { provide: FullscreenService, useValue: { isFullscreen: signal(false).asReadonly() } },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute,
                },
            ],
        })
            .overrideComponent(AlertErrorComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionFoliosPanelComponent, { set: { template: '', imports: [] } })
            .overrideComponent(EditionSheetsPanelComponent, { set: { template: '', imports: [] } })
            .overrideComponent(TwelveToneSpinnerComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedFolioConvoluteData = structuredClone(mockEditionData.mockFolioConvoluteData);
        expectedSvgSheetsData = structuredClone(mockEditionData.mockSvgSheetList);
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'test-1';
        expectedNextSheetId = 'test-2a';

        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedSelection = EDITION_SHEETS_UTILS.toSvgSheetSelection(expectedSvgSheet, expectedSvgSheet.content[0]);
        expectedSelectionWithPartial = EDITION_SHEETS_UTILS.toSvgSheetSelection(
            mockEditionData.mockSvgSheet_Sk2,
            mockEditionData.mockSvgSheet_Sk2.content[0]
        );
        // Convolute A of the sketch edition test-1
        expectedConvolute = expectedFolioConvoluteData.convolutes[0];
        // Textcritics of the sketch edition test-1
        expectedSelectedTextcritics = expectedTextcriticsListData.textcritics[0];

        // Mocked route with the expected sheet id
        setSheetIdInRoute(expectedSheetId);

        serviceNavigateToSvgSheetSpy = vi.spyOn(mockNavigationService, 'navigateToSvgSheet');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSheetsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        onSheetBrowseSpy = vi.spyOn(component, 'onSheetBrowse');
        onLinkBoxSelectSpy = vi.spyOn(component, 'onLinkBoxSelect');
        onOverlaySelectSpy = vi.spyOn(component, 'onOverlaySelect');
        selectSvgSheetSpy = vi.spyOn(component as any, '_selectSvgSheet');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        it('... should have signal `isFirstPageLoad` to hold true', () => {
            expectToBe(isSignal(component.isFirstPageLoad), true);

            expectToBe(component.isFirstPageLoad(), true);
        });

        it('... should have signal `isSheetFacetMinimized` to hold false', () => {
            expectToBe(isSignal(component.isSheetFacetMinimized), true);

            expectToBe(component.isSheetFacetMinimized(), false);
        });

        it('... should have computed signal `selectedSvgSheet` to hold undefined', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(component.selectedSvgSheet()).toBeUndefined();
        });

        it('... should have linked signal `selectedTkkOverlays` to hold an empty array', () => {
            expectToBe(isSignal(component.selectedTkkOverlays), true);

            expectToEqual(component.selectedTkkOverlays(), []);
        });

        it('... should have computed signal `selectedConvolute` to hold undefined', () => {
            expectToBe(isSignal(component.selectedConvolute), true);

            expect(component.selectedConvolute()).toBeUndefined();
        });

        it('... should have computed signal `selectedTextcritics` to hold undefined', () => {
            expectToBe(isSignal(component.selectedTextcritics), true);

            expect(component.selectedTextcritics()).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain no AlertErrorComponent (hollow)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (hollow)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
            });

            it('... should contain no EditionSheetsPanelComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelComponent, 0, 0);
            });

            it('... should contain no EditionFoliosPanelComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionStateService.updateSelectedEditionComplex(expectedComplex);
            expectedViewDataContent = {
                folioConvoluteData: expectedFolioConvoluteData,
                svgSheetsData: expectedSvgSheetsData,
                textcriticsData: expectedTextcriticsListData,
            };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should change urls', () => {
            expectToEqual(mockActivatedRoute.snapshot.url[0].path, expectedPath);

            const changedPath = 'other';
            const changedRouteUrl: UrlSegmentStub[] = [{ path: changedPath }];

            mockActivatedRoute.testUrl = changedRouteUrl;

            expectToEqual(mockActivatedRoute.snapshot.url[0].path, changedPath);
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        it('... should have signal `isFirstPageLoad` to hold false', () => {
            expectToBe(component.isFirstPageLoad(), false);
        });

        describe('... computed signal `selectedSvgSheet`', () => {
            it('... should hold the selection of the svg sheet given by the route', () => {
                expectToEqual(component.selectedSvgSheet(), expectedSelection);
            });

            it('... should hold the selection of the partial given by the route', () => {
                setSheetIdInRoute('test-2a');

                expectToEqual(component.selectedSvgSheet(), expectedSelectionWithPartial);
            });

            it('... should hold the selection of the first partial for a svg sheet with partials selected by its plain id', () => {
                setSheetIdInRoute('test-2');

                expectToEqual(component.selectedSvgSheet(), expectedSelectionWithPartial);
            });

            it('... should hold the selection of another partial given by the route', () => {
                setSheetIdInRoute('test-2b');

                expectToEqual(
                    component.selectedSvgSheet(),
                    EDITION_SHEETS_UTILS.toSvgSheetSelection(
                        mockEditionData.mockSvgSheet_Sk2,
                        mockEditionData.mockSvgSheet_Sk2.content[1]
                    )
                );
            });

            it('... should keep its reference if the view data is emitted again with the same data', () => {
                const selection = component.selectedSvgSheet();
                component.onOverlaySelect([createTestTkkOverlay('g1114')]);

                mockViewDataSignal.set(createMockViewData({ ...expectedViewDataContent }));

                expectToBe(component.selectedSvgSheet(), selection);
                expectToEqual(component.selectedTkkOverlays(), [createTestTkkOverlay('g1114')]);
            });

            it('... should hold undefined for an unknown sheet id', () => {
                setSheetIdInRoute('unknown-id');

                expect(component.selectedSvgSheet()).toBeUndefined();
            });

            it.each([
                ['an empty sheet id', { id: '' }],
                ['a missing sheet id', {}],
            ])('... should hold undefined with %s in the route', (_label, queryParams) => {
                mockActivatedRoute.testQueryParamMap = queryParams;

                expect(component.selectedSvgSheet()).toBeUndefined();
            });

            it('... should hold undefined without svgSheetsData', () => {
                mockViewDataSignal.set(createMockViewData({ ...expectedViewDataContent, svgSheetsData: null }));

                expect(component.selectedSvgSheet()).toBeUndefined();
            });
        });

        describe('... computed signal `selectedConvolute`', () => {
            it('... should hold the convolute of the selected sketch edition', () => {
                expectToEqual(component.selectedConvolute(), expectedConvolute);
            });

            it('... should have recomputed signal `selectedConvolute` when another sketch edition is selected', () => {
                setSheetIdInRoute('test-3a');

                expectToEqual(
                    component.selectedConvolute(),
                    expectedFolioConvoluteData.convolutes.find(convolute => convolute.convoluteId === 'B')
                );
            });

            it('... should hold undefined for a text edition', () => {
                setSheetIdInRoute('test-TF1a');

                expect(component.selectedConvolute()).toBeUndefined();
            });

            it('... should hold undefined without selected svg sheet', () => {
                setSheetIdInRoute('unknown-id');

                expect(component.selectedConvolute()).toBeUndefined();
            });

            it('... should hold undefined without folioConvoluteData', () => {
                mockViewDataSignal.set(
                    createMockViewData({ ...expectedViewDataContent, folioConvoluteData: undefined } as any)
                );

                expect(component.selectedConvolute()).toBeUndefined();
            });
        });

        describe('... linked signal `selectedTkkOverlays`', () => {
            it('... should hold the overlays set by `onOverlaySelect`', () => {
                const expectedOverlays = [createTestTkkOverlay('g1114')];

                component.onOverlaySelect(expectedOverlays);

                expectToEqual(component.selectedTkkOverlays(), expectedOverlays);
            });

            it('... should hold an empty array again when the selected svg sheet changes', () => {
                component.onOverlaySelect([createTestTkkOverlay('g1114')]);

                setSheetIdInRoute('test-2a');

                expectToEqual(component.selectedTkkOverlays(), []);
            });
        });

        describe('... computed signal `selectedTextcritics`', () => {
            it('... should hold the textcritics of the selected svg sheet with the commentary filtered for no overlays', () => {
                expectToEqual(component.selectedTextcritics(), {
                    ...expectedSelectedTextcritics,
                    commentary: { preamble: expectedSelectedTextcritics.commentary.preamble, comments: [] },
                });
            });

            it('... should hold the textcritics of the selected svg sheet with the commentary filtered for the selected overlays', () => {
                const commentary = expectedSelectedTextcritics.commentary;

                for (const block of commentary.comments) {
                    for (const blockComment of block.blockComments) {
                        component.onOverlaySelect([createTestTkkOverlay(blockComment.svgGroupId ?? '')]);

                        expectToEqual(component.selectedTextcritics(), {
                            ...expectedSelectedTextcritics,
                            commentary: {
                                preamble: commentary.preamble,
                                comments: [{ ...block, blockComments: [blockComment] }],
                            },
                        });
                    }
                }
            });

            it('... should keep the link boxes of the selected svg sheet', () => {
                const expectedLinkBoxes = [
                    { svgGroupId: 'linkBox1', linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' } },
                ];
                setSelectedTextcritics({ linkBoxes: expectedLinkBoxes });
                component.onOverlaySelect([createTestTkkOverlay('g1114')]);

                expectToEqual(component.selectedTextcritics()?.linkBoxes, expectedLinkBoxes);
            });

            it('... should not mutate the textcritics of the view data', () => {
                const expectedCommentary = structuredClone(expectedSelectedTextcritics.commentary);

                component.onOverlaySelect([createTestTkkOverlay('g1114')]);
                component.selectedTextcritics();

                expectToEqual(expectedSelectedTextcritics.commentary, expectedCommentary);
            });

            it('... should hold undefined without selected svg sheet', () => {
                setSheetIdInRoute('unknown-id');

                expect(component.selectedTextcritics()).toBeUndefined();
            });

            it('... should hold undefined without textcriticsData', () => {
                mockViewDataSignal.set(
                    createMockViewData({ ...expectedViewDataContent, textcriticsData: undefined } as any)
                );

                expect(component.selectedTextcritics()).toBeUndefined();
            });

            it('... should hold undefined if no textcritics are found for the selected svg sheet', () => {
                setSheetIdInRoute('test-4');

                expect(component.selectedTextcritics()).toBeUndefined();
            });

            it.each([
                ['a missing commentary', undefined],
                ['an empty commentary', {}],
            ])('... should hold %s unfiltered', (_label, commentary) => {
                setSelectedTextcritics({ commentary: commentary as any });
                component.onOverlaySelect([createTestTkkOverlay('g1114')]);

                expect(component.selectedTextcritics()?.commentary).toEqual(commentary);
            });
        });

        describe('... effect', () => {
            beforeEach(() => {
                serviceNavigateToSvgSheetSpy.mockClear();
            });

            it('... should not navigate if a sheet id is given by the route', () => {
                setSheetIdInRoute('test-2a');
                fixture.detectChanges();

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0);
            });

            it.each([
                ['an empty sheet id', { id: '' }],
                ['a missing sheet id', {}],
            ])('... should navigate to the default svg sheet with %s in the route', (_label, queryParams) => {
                mockActivatedRoute.testQueryParamMap = queryParams;
                fixture.detectChanges();

                expectSpyCall(serviceNavigateToSvgSheetSpy, 1, { complexId: '', sheetId: 'test-TF1a' });
            });

            it('... should not navigate without default svg sheet', () => {
                mockViewDataSignal.set(
                    createMockViewData({
                        ...expectedViewDataContent,
                        svgSheetsData: { sheets: { workEditions: [], textEditions: [], sketchEditions: [] } },
                    })
                );
                setSheetIdInRoute('');
                fixture.detectChanges();

                expectSpyCall(serviceNavigateToSvgSheetSpy, 0);
            });

            it('... should set `isFirstPageLoad` to false once the svg sheets data is available', () => {
                component.isFirstPageLoad.set(true);
                mockViewDataSignal.set(createMockViewData({ ...expectedViewDataContent }));
                fixture.detectChanges();

                expectToBe(component.isFirstPageLoad(), false);
            });

            it('... should keep `isFirstPageLoad` true without svg sheets data', () => {
                component.isFirstPageLoad.set(true);
                mockViewDataSignal.set(createMockViewData({ ...expectedViewDataContent, svgSheetsData: null }));
                fixture.detectChanges();

                expectToBe(component.isFirstPageLoad(), true);
            });
        });

        describe('VIEW', () => {
            it('... should render nothing if viewData is not available', async () => {
                mockViewDataSignal.set(null as any);

                await detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-sheets-view', 0, 0);
            });

            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'svgSheets',
                    error: { status: 404, statusText: 'Data not found' },
                };

                beforeEach(async () => {
                    // Mock error state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: expectedErrorObject,
                        })
                    );
                    component.isFirstPageLoad.set(false);

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain sheets view or spinner, but one AlertErrorComponent (hollow)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-sheets-view', 0, 0);
                    getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);

                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(AlertErrorComponent) as AlertErrorComponent;

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                describe('... should not contain sheets view or alert, but one TwelveToneSpinnerComponent (hollow) if', () => {
                    it('... `isFirstPageLoad` holds true', async () => {
                        component.isFirstPageLoad.set(true);
                        // Unset sheetsData to avoid query param handling
                        mockViewDataSignal.set(
                            createMockViewData(
                                {
                                    folioConvoluteData: expectedFolioConvoluteData,
                                    svgSheetsData: null,
                                    textcriticsData: expectedTextcriticsListData,
                                },
                                {
                                    isLoading: false,
                                    error: null,
                                }
                            )
                        );

                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheets-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);

                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                    });

                    it('... `viewData.isLoading` holds true', async () => {
                        component.isFirstPageLoad.set(false);
                        mockViewDataSignal.set(
                            createMockViewData(expectedViewDataContent, {
                                isLoading: true,
                                error: null,
                            })
                        );

                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheets-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);

                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                    });

                    it('... should have default spinnerText on TwelveToneSpinnerComponent', async () => {
                        component.isFirstPageLoad.set(false);
                        mockViewDataSignal.set(
                            createMockViewData(expectedViewDataContent, {
                                isLoading: true,
                                error: null,
                            })
                        );

                        await detectChangesOnPush(fixture);

                        const spinnerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TwelveToneSpinnerComponent,
                            1,
                            1
                        );
                        const spinnerCmp = spinnerDes[0].injector.get(
                            TwelveToneSpinnerComponent
                        ) as TwelveToneSpinnerComponent;

                        expectToBe(spinnerCmp.spinnerText(), 'loading');
                    });
                });
            });

            describe('on view data available', () => {
                let sheetsPanelCmp: EditionSheetsPanelComponent;

                beforeEach(async () => {
                    await detectChangesOnPush(fixture);

                    const sheetsPanelDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSheetsPanelComponent,
                        1,
                        1
                    );
                    sheetsPanelCmp = sheetsPanelDes[0].injector.get(EditionSheetsPanelComponent);
                });

                it('... should contain one div.awg-edition-sheets-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheets-view', 1, 1);
                });

                describe('... EditionSheetsPanelComponent (hollow)', () => {
                    it('... should contain one EditionSheetsPanelComponent (hollow)', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelComponent, 1, 1);
                    });

                    it('... should pass down `isSheetFacetMinimized` to the EditionSheetsPanelComponent', () => {
                        expectToBe(sheetsPanelCmp.isSheetFacetMinimized(), false);
                    });

                    it('... should have signal `isSheetFacetMinimized` to hold the value set by the EditionSheetsPanelComponent', () => {
                        sheetsPanelCmp.isSheetFacetMinimized.set(true);

                        expectToBe(component.isSheetFacetMinimized(), true);

                        sheetsPanelCmp.isSheetFacetMinimized.set(false);

                        expectToBe(component.isSheetFacetMinimized(), false);
                    });

                    it('... should pass down `svgSheetsData` to the EditionSheetsPanelComponent', () => {
                        expectToEqual(sheetsPanelCmp.svgSheetsData(), expectedSvgSheetsData);
                    });

                    it('... should pass down `selectedSvgSheet` to the EditionSheetsPanelComponent', () => {
                        expectToEqual(sheetsPanelCmp.selectedSvgSheet(), expectedSelection);
                    });

                    it('... should pass down `selectedTextcritics` to the EditionSheetsPanelComponent', () => {
                        expectToEqual(sheetsPanelCmp.selectedTextcritics(), component.selectedTextcritics());
                    });

                    it('... should pass down the svg sheet of a changed route to the EditionSheetsPanelComponent', async () => {
                        setSheetIdInRoute('test-2a');
                        await detectChangesOnPush(fixture);

                        expectToEqual(sheetsPanelCmp.selectedSvgSheet(), expectedSelectionWithPartial);
                    });
                });

                describe('... EditionFoliosPanelComponent (hollow)', () => {
                    it('... should contain one EditionFoliosPanelComponent (hollow) for a sketch edition', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelComponent, 1, 1);
                    });

                    it('... should pass down `selectedConvolute` to the EditionFoliosPanelComponent', () => {
                        const foliosPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionFoliosPanelComponent,
                            1,
                            1
                        );
                        const foliosPanelCmp = foliosPanelDes[0].injector.get(EditionFoliosPanelComponent);

                        expectToEqual(foliosPanelCmp.selectedConvolute(), expectedConvolute);
                    });

                    it('... should pass down `selectedSvgSheet` to the EditionFoliosPanelComponent', () => {
                        const foliosPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionFoliosPanelComponent,
                            1,
                            1
                        );
                        const foliosPanelCmp = foliosPanelDes[0].injector.get(EditionFoliosPanelComponent);

                        expectToEqual(foliosPanelCmp.selectedSvgSheet(), expectedSelection);
                    });

                    it.each([
                        ['a text edition', 'test-TF1a'],
                        ['an unknown sheet id', 'unknown-id'],
                    ])('... should contain no EditionFoliosPanelComponent (hollow) for %s', async (_label, id) => {
                        setSheetIdInRoute(id);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelComponent, 0, 0);
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#onSheetBrowse()', () => {
                beforeEach(() => {
                    selectSvgSheetSpy.mockClear();
                });

                it('... should have a method `onSheetBrowse`', () => {
                    expect(component.onSheetBrowse).toBeDefined();
                });

                it('... should trigger on event from EditionSheetsPanelComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelComponent, 1, 1);
                    const sheetCmp = sheetDes[0].injector.get(EditionSheetsPanelComponent);

                    const expectedDirection = 1;
                    sheetCmp.browseSheetRequest.emit(expectedDirection);

                    expectSpyCall(onSheetBrowseSpy, 1, [expectedDirection]);
                });

                it('... should do nothing without selected svg sheet', () => {
                    setSheetIdInRoute('unknown-id');

                    component.onSheetBrowse(1);

                    expectSpyCall(selectSvgSheetSpy, 0);
                });

                describe('... should trigger `_selectSvgSheet()` with the id of the', () => {
                    it.each([
                        ['next sheet', 'test-1', 1, 'test-2a'],
                        ['next partial', 'test-2a', 1, 'test-2b'],
                        ['next sheet after the last partial', 'test-2b', 1, 'test-3a'],
                        ['previous partial', 'test-3b', -1, 'test-3a'],
                        ['previous sheet before the first partial', 'test-3a', -1, 'test-2b'],
                        ['next partial of a sheet selected without partial', 'test-2', 1, 'test-2b'],
                        ['same sheet if there is no previous sheet', 'test-1', -1, 'test-1'],
                        ['same sheet if there is no next sheet', 'test-5', 1, 'test-5'],
                        ['next partial within a text edition', 'test-TF1a', 1, 'test-TF1b'],
                        ['previous partial within a work edition', 'test-WE1b', -1, 'test-WE1a'],
                        ['same sheet at the end of an edition type', 'test-TF1b', 1, 'test-TF1b'],
                    ] as const)('... %s', (_label, currentId, direction, expectedId) => {
                        setSheetIdInRoute(currentId);

                        component.onSheetBrowse(direction);

                        expectSpyCall(selectSvgSheetSpy, 1, { complexId: '', sheetId: expectedId });
                    });
                });
            });

            describe('#onLinkBoxSelect()', () => {
                beforeEach(() => {
                    selectSvgSheetSpy.mockClear();
                });

                it('... should have a method `onLinkBoxSelect`', () => {
                    expect(component.onLinkBoxSelect).toBeDefined();
                });

                it('... should trigger on event from EditionSheetsPanelComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelComponent, 1, 1);
                    const sheetCmp = sheetDes[0].injector.get(EditionSheetsPanelComponent);

                    const expectedLinkBoxId = 'link-box-1';
                    sheetCmp.selectLinkBoxRequest.emit(expectedLinkBoxId);

                    expectSpyCall(onLinkBoxSelectSpy, 1, [expectedLinkBoxId]);
                });

                describe('... should do nothing if', () => {
                    it('... selectedSvgSheet is not defined', () => {
                        setSheetIdInRoute('unknown-id');

                        component.onLinkBoxSelect('linkBox1');

                        expectSpyCall(selectSvgSheetSpy, 0);
                    });

                    it.each([
                        ['are not defined', undefined],
                        ['are empty', []],
                        [
                            'do not contain the given link box',
                            [
                                {
                                    svgGroupId: 'unknown-link-box',
                                    linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' },
                                },
                            ],
                        ],
                    ])('... selectedTextcritics.linkBoxes %s', (_label, linkBoxes) => {
                        setSelectedTextcritics({ linkBoxes });

                        component.onLinkBoxSelect('linkBox1');

                        expectSpyCall(selectSvgSheetSpy, 0);
                    });
                });

                it('... should find correct link box and trigger `_selectSvgSheet()` method with correct parameters', () => {
                    const expectedLinkBoxId = 'linkBox1';
                    const expectedLinkBox = {
                        svgGroupId: expectedLinkBoxId,
                        linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' },
                    };
                    setSelectedTextcritics({ linkBoxes: [expectedLinkBox] });

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(selectSvgSheetSpy, 1, expectedLinkBox.linkTo);
                });
            });

            describe('#onOverlaySelect()', () => {
                it('... should have a method `onOverlaySelect`', () => {
                    expect(component.onOverlaySelect).toBeDefined();
                });

                it('... should trigger on event from EditionSheetsPanelComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelComponent, 1, 1);
                    const sheetCmp = sheetDes[0].injector.get(EditionSheetsPanelComponent);

                    const expectedOverlays = [createTestTkkOverlay('g1114')];

                    sheetCmp.selectTkkOverlaysRequest.emit(expectedOverlays);

                    expectSpyCall(onOverlaySelectSpy, 1, [expectedOverlays]);
                });

                it('... should set `selectedTkkOverlays` to hold the given overlays', () => {
                    const expectedOverlays = [createTestTkkOverlay('g1114'), createTestTkkOverlay('g1115')];

                    component.onOverlaySelect(expectedOverlays);

                    expectToEqual(component.selectedTkkOverlays(), expectedOverlays);
                });
            });

            describe('#_selectSvgSheet()', () => {
                beforeEach(() => {
                    selectSvgSheetSpy.mockClear();
                    serviceNavigateToSvgSheetSpy.mockClear();
                });

                it('... should have a method `_selectSvgSheet`', () => {
                    expect(component['_selectSvgSheet']).toBeDefined();
                });

                it('... should do nothing if no sheetId is provided', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = { complexId: 'op25', sheetId: '' };
                    component['_selectSvgSheet'](expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
                });

                it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component['_selectSvgSheet'](expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component['_selectSvgSheet'](expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });

                it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component['_selectSvgSheet'](expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component['_selectSvgSheet'](expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });
            });
        });
    });
});
