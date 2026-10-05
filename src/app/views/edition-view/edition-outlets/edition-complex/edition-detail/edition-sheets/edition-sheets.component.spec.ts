import { Component, DebugElement, input, isSignal, model, output, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { AlertErrorStubComponent, TwelveToneSpinnerStubComponent } from '@testing/component-stubs';
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
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { EditionNavigationSheetTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { EditionSvgOverlayTkk } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import {
    EditionSvgSheet,
    EditionSvgSheetIds,
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

// Mock components
@Component({
    selector: 'awg-edition-sheets-panel',
    template: '',
})
class EditionSheetsPanelStubComponent {
    readonly isSheetFacetMinimized = model.required<boolean>();
    readonly svgSheetsData = input.required<EditionSvgSheetsList | null>();
    readonly selectedSvgSheet = input.required<EditionSvgSheet | undefined>();
    readonly selectedSheetIds = input.required<EditionSvgSheetIds>();
    readonly displayedTextcritics = input.required<Textcritics | undefined>();
    readonly browseSheetRequest = output<1 | -1>();
    readonly selectLinkBoxRequest = output<string>();
    readonly selectTkkOverlaysRequest = output<EditionSvgOverlayTkk[]>();
}

@Component({
    selector: 'awg-edition-folios-panel',
    template: '',
})
class EditionFoliosPanelStubComponent {
    readonly selectedConvolute = input.required<FolioConvolute>();
    readonly selectedSheetIds = input.required<EditionSvgSheetIds>();
}

describe('EditionSheetsComponent (DONE)', () => {
    let component: EditionSheetsComponent;
    let fixture: ComponentFixture<EditionSheetsComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let expectedRouteUrl: UrlSegmentStub[] = [];
    const expectedPath = 'sheets';

    let editionStateService: EditionStateService;
    let mockNavigationService: Partial<EditionNavigationService>;

    let onBrowseSvgSheetSpy: Spy;
    let onLinkBoxSelectSpy: Spy;
    let onOverlaySelectSpy: Spy;
    let onSvgSheetSelectSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let mockViewDataSignal: WritableSignal<EditionViewData<'sheets'>>;
    let expectedViewDataContent: EditionViewDataContent<'sheets'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'sheets'>;
    let expectedConvolute: FolioConvolute;
    let expectedComplex: EditionComplex;
    let expectedFolioConvoluteData: FolioConvoluteList;
    let expectedSvgSheetsData: EditionSvgSheetsList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedSvgSheetWithPartial: EditionSvgSheet;
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
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute,
                },
            ],
        })
            .overrideComponent(EditionSheetsComponent, {
                remove: {
                    imports: [
                        AlertErrorComponent,
                        EditionFoliosPanelComponent,
                        EditionSheetsPanelComponent,
                        TwelveToneSpinnerComponent,
                    ],
                },
                add: {
                    imports: [
                        AlertErrorStubComponent,
                        EditionFoliosPanelStubComponent,
                        EditionSheetsPanelStubComponent,
                        TwelveToneSpinnerStubComponent,
                    ],
                },
            })
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
        expectedSvgSheetWithPartial = structuredClone(mockEditionData.mockSvgSheet_Sk2a);
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
        onBrowseSvgSheetSpy = vi.spyOn(component, 'onBrowseSvgSheet');
        onLinkBoxSelectSpy = vi.spyOn(component, 'onLinkBoxSelect');
        onOverlaySelectSpy = vi.spyOn(component, 'onOverlaySelect');
        onSvgSheetSelectSpy = vi.spyOn(component, 'onSvgSheetSelect');
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

        it('... should have computed signal `selectedEditionType` to hold undefined', () => {
            expectToBe(isSignal(component.selectedEditionType), true);

            expect(component.selectedEditionType()).toBeUndefined();
        });

        it('... should have linked signal `selectedTkkOverlays` to hold an empty array', () => {
            expectToBe(isSignal(component.selectedTkkOverlays), true);

            expectToEqual(component.selectedTkkOverlays(), []);
        });

        it('... should have computed signal `selectedSheetIds` to hold an undefined id and full id', () => {
            expectToBe(isSignal(component.selectedSheetIds), true);

            expectToEqual(component.selectedSheetIds(), { id: undefined, fullId: undefined });
        });

        it('... should have computed signal `selectedConvolute` to hold undefined', () => {
            expectToBe(isSignal(component.selectedConvolute), true);

            expect(component.selectedConvolute()).toBeUndefined();
        });

        it('... should have computed signal `selectedTextcritics` to hold undefined', () => {
            expectToBe(isSignal(component.selectedTextcritics), true);

            expect(component.selectedTextcritics()).toBeUndefined();
        });

        it('... should have computed signal `displayedTextcritics` to hold undefined', () => {
            expectToBe(isSignal(component.displayedTextcritics), true);

            expect(component.displayedTextcritics()).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain no AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no EditionSheetsPanelComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelStubComponent, 0, 0);
            });

            it('... should contain no EditionFoliosPanelComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelStubComponent, 0, 0);
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
            it('... should hold the svg sheet of the sheet id given by the route', () => {
                expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
            });

            it('... should hold the svg sheet reduced to the partial given by the route', () => {
                setSheetIdInRoute('test-2a');

                expectToEqual(component.selectedSvgSheet(), expectedSvgSheetWithPartial);
            });

            it('... should hold undefined for an unknown sheet id', () => {
                setSheetIdInRoute('unknown-id');

                expect(component.selectedSvgSheet()).toBeUndefined();
            });

            it('... should hold undefined without sheet id', () => {
                setSheetIdInRoute('');

                expect(component.selectedSvgSheet()).toBeUndefined();
            });

            it('... should hold undefined without svgSheetsData', () => {
                mockViewDataSignal.set(createMockViewData({ ...expectedViewDataContent, svgSheetsData: null }));

                expect(component.selectedSvgSheet()).toBeUndefined();
            });
        });

        describe('... computed signal `selectedEditionType`', () => {
            it.each([
                ['test-WE1a', 'workEditions'],
                ['test-TF1a', 'textEditions'],
                ['test-1', 'sketchEditions'],
            ])('... should hold the edition type of the svg sheet %s', (id, expectedEditionType) => {
                setSheetIdInRoute(id);

                expectToBe(component.selectedEditionType(), expectedEditionType);
            });

            it('... should hold undefined for an unknown sheet id', () => {
                setSheetIdInRoute('unknown-id');

                expect(component.selectedEditionType()).toBeUndefined();
            });
        });

        describe('... computed signal `selectedSheetIds`', () => {
            it('... should hold the id and the full id of the selected svg sheet', () => {
                expectToEqual(component.selectedSheetIds(), {
                    id: expectedSvgSheet.id,
                    fullId: expectedSvgSheet.id,
                });
            });

            it('... should have recomputed signal `selectedSheetIds` when a svg sheet with partial is selected', () => {
                setSheetIdInRoute('test-2a');

                expectToEqual(component.selectedSheetIds(), { id: expectedSvgSheetWithPartial.id, fullId: 'test-2a' });
            });

            it('... should hold the full id of the first partial for a svg sheet with partials selected by its plain id', () => {
                setSheetIdInRoute('test-2');

                expectToEqual(component.selectedSheetIds(), { id: 'test-2', fullId: 'test-2a' });
            });

            it('... should hold an undefined id and full id without selected svg sheet', () => {
                setSheetIdInRoute('unknown-id');

                expectToEqual(component.selectedSheetIds(), { id: undefined, fullId: undefined });
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

        describe('... computed signal `selectedTextcritics`', () => {
            it('... should hold the textcritics of the selected svg sheet', () => {
                expectToEqual(component.selectedTextcritics(), expectedSelectedTextcritics);
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

        describe('... computed signal `displayedTextcritics`', () => {
            it('... should hold the selected textcritics with the commentary filtered for no overlays', () => {
                expectToEqual(component.displayedTextcritics(), {
                    ...expectedSelectedTextcritics,
                    commentary: { preamble: expectedSelectedTextcritics.commentary.preamble, comments: [] },
                });
            });

            it('... should hold the selected textcritics with the commentary filtered for the selected overlays', () => {
                const commentary = expectedSelectedTextcritics.commentary;

                for (const block of commentary.comments) {
                    for (const blockComment of block.blockComments) {
                        component.onOverlaySelect([createTestTkkOverlay(blockComment.svgGroupId ?? '')]);

                        expectToEqual(component.displayedTextcritics(), {
                            ...expectedSelectedTextcritics,
                            commentary: {
                                preamble: commentary.preamble,
                                comments: [{ ...block, blockComments: [blockComment] }],
                            },
                        });
                    }
                }
            });

            it('... should keep `selectedTextcritics` unchanged', () => {
                const expectedCommentary = structuredClone(expectedSelectedTextcritics.commentary);

                component.onOverlaySelect([createTestTkkOverlay('g1114')]);
                component.displayedTextcritics();

                expectToEqual(component.selectedTextcritics()?.commentary, expectedCommentary);
            });

            it('... should hold undefined without `selectedTextcritics`', () => {
                setSheetIdInRoute('unknown-id');

                expect(component.displayedTextcritics()).toBeUndefined();
            });

            it.each([
                ['a missing', undefined],
                ['an empty', {}],
            ])('... should hold %s commentary unfiltered', (_label, commentary) => {
                setSelectedTextcritics({ commentary: commentary as any });
                component.onOverlaySelect([createTestTkkOverlay('g1114')]);

                expect(component.displayedTextcritics()?.commentary).toEqual(commentary);
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

            it('... should navigate to the default svg sheet if no sheet id is given by the route', () => {
                setSheetIdInRoute('');
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
                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
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

                it('... should not contain sheets view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-sheets-view', 0, 0);
                    getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                describe('... should not contain sheets view or alert, but one TwelveToneSpinnerComponent (stubbed) if', () => {
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
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
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
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
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
                            TwelveToneSpinnerStubComponent,
                            1,
                            1
                        );
                        const spinnerCmp = spinnerDes[0].injector.get(
                            TwelveToneSpinnerStubComponent
                        ) as TwelveToneSpinnerStubComponent;

                        expectToBe(spinnerCmp.spinnerText(), 'loading');
                    });
                });
            });

            describe('on view data available', () => {
                let sheetsPanelCmp: EditionSheetsPanelStubComponent;

                beforeEach(async () => {
                    await detectChangesOnPush(fixture);

                    const sheetsPanelDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionSheetsPanelStubComponent,
                        1,
                        1
                    );
                    sheetsPanelCmp = sheetsPanelDes[0].injector.get(EditionSheetsPanelStubComponent);
                });

                it('... should contain one div.awg-edition-sheets-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheets-view', 1, 1);
                });

                describe('... EditionSheetsPanelComponent (stubbed)', () => {
                    it('... should contain one EditionSheetsPanelComponent (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelStubComponent, 1, 1);
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
                        expectToEqual(sheetsPanelCmp.selectedSvgSheet(), expectedSvgSheet);
                    });

                    it('... should pass down `selectedSheetIds` to the EditionSheetsPanelComponent', () => {
                        expectToEqual(sheetsPanelCmp.selectedSheetIds(), component.selectedSheetIds());
                    });

                    it('... should pass down `displayedTextcritics` to the EditionSheetsPanelComponent', () => {
                        expectToEqual(sheetsPanelCmp.displayedTextcritics(), component.displayedTextcritics());
                    });

                    it('... should pass down the svg sheet of a changed route to the EditionSheetsPanelComponent', async () => {
                        setSheetIdInRoute('test-2a');
                        await detectChangesOnPush(fixture);

                        expectToEqual(sheetsPanelCmp.selectedSvgSheet(), expectedSvgSheetWithPartial);
                    });
                });

                describe('... EditionFoliosPanelComponent (stubbed)', () => {
                    it('... should contain one EditionFoliosPanelComponent (stubbed) for a sketch edition', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelStubComponent, 1, 1);
                    });

                    it('... should pass down `selectedConvolute` to the EditionFoliosPanelComponent', () => {
                        const foliosPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionFoliosPanelStubComponent,
                            1,
                            1
                        );
                        const foliosPanelCmp = foliosPanelDes[0].injector.get(EditionFoliosPanelStubComponent);

                        expectToEqual(foliosPanelCmp.selectedConvolute(), expectedConvolute);
                    });

                    it('... should pass down `selectedSheetIds` to the EditionFoliosPanelComponent', () => {
                        const foliosPanelDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionFoliosPanelStubComponent,
                            1,
                            1
                        );
                        const foliosPanelCmp = foliosPanelDes[0].injector.get(EditionFoliosPanelStubComponent);

                        expectToEqual(foliosPanelCmp.selectedSheetIds(), component.selectedSheetIds());
                    });

                    it.each([
                        ['a text edition', 'test-TF1a'],
                        ['an unknown sheet id', 'unknown-id'],
                    ])('... should contain no EditionFoliosPanelComponent (stubbed) for %s', async (_label, id) => {
                        setSheetIdInRoute(id);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelStubComponent, 0, 0);
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#onBrowseSvgSheet()', () => {
                beforeEach(() => {
                    onSvgSheetSelectSpy.mockClear();
                });

                it('... should have a method `onBrowseSvgSheet`', () => {
                    expect(component.onBrowseSvgSheet).toBeDefined();
                });

                it('... should trigger on event from EditionSheetsPanelComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelStubComponent, 1, 1);
                    const sheetCmp = sheetDes[0].injector.get(EditionSheetsPanelStubComponent);

                    const expectedDirection = 1;
                    sheetCmp.browseSheetRequest.emit(expectedDirection);

                    expectSpyCall(onBrowseSvgSheetSpy, 1, [expectedDirection]);
                });

                it('... should do nothing without selected svg sheet', () => {
                    setSheetIdInRoute('unknown-id');

                    component.onBrowseSvgSheet(1);

                    expectSpyCall(onSvgSheetSelectSpy, 0);
                });

                describe('... should trigger `onSvgSheetSelect()` with the id of the', () => {
                    it.each([
                        ['next sheet', 'test-1', 1, 'test-2a'],
                        ['next partial', 'test-2a', 1, 'test-2b'],
                        ['next sheet after the last partial', 'test-2b', 1, 'test-3a'],
                        ['previous partial', 'test-3b', -1, 'test-3a'],
                        ['previous sheet before the first partial', 'test-3a', -1, 'test-2b'],
                        ['next partial of a sheet selected without partial', 'test-2', 1, 'test-2b'],
                        ['same sheet if there is no previous sheet', 'test-1', -1, 'test-1'],
                        ['same sheet if there is no next sheet', 'test-5', 1, 'test-5'],
                    ] as const)('... %s', (_label, currentId, direction, expectedId) => {
                        setSheetIdInRoute(currentId);

                        component.onBrowseSvgSheet(direction);

                        expectSpyCall(onSvgSheetSelectSpy, 1, { complexId: '', sheetId: expectedId });
                    });
                });
            });

            describe('#onLinkBoxSelect()', () => {
                beforeEach(() => {
                    onSvgSheetSelectSpy.mockClear();
                });

                it('... should have a method `onLinkBoxSelect`', () => {
                    expect(component.onLinkBoxSelect).toBeDefined();
                });

                it('... should trigger on event from EditionSheetsPanelComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelStubComponent, 1, 1);
                    const sheetCmp = sheetDes[0].injector.get(EditionSheetsPanelStubComponent);

                    const expectedLinkBoxId = 'link-box-1';
                    sheetCmp.selectLinkBoxRequest.emit(expectedLinkBoxId);

                    expectSpyCall(onLinkBoxSelectSpy, 1, [expectedLinkBoxId]);
                });

                describe('... should do nothing if', () => {
                    it('... selectedSvgSheet is not defined', () => {
                        setSheetIdInRoute('unknown-id');

                        component.onLinkBoxSelect('linkBox1');

                        expectSpyCall(onSvgSheetSelectSpy, 0);
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

                        expectSpyCall(onSvgSheetSelectSpy, 0);
                    });
                });

                it('... should find correct link box and trigger `onSvgSheetSelect()` method with correct parameters', () => {
                    const expectedLinkBoxId = 'linkBox1';
                    const expectedLinkBox = {
                        svgGroupId: expectedLinkBoxId,
                        linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' },
                    };
                    setSelectedTextcritics({ linkBoxes: [expectedLinkBox] });

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(onSvgSheetSelectSpy, 1, expectedLinkBox.linkTo);
                });
            });

            describe('#onOverlaySelect()', () => {
                it('... should have a method `onOverlaySelect`', () => {
                    expect(component.onOverlaySelect).toBeDefined();
                });

                it('... should trigger on event from EditionSheetsPanelComponent', () => {
                    const sheetDes = getAndExpectDebugElementByDirective(compDe, EditionSheetsPanelStubComponent, 1, 1);
                    const sheetCmp = sheetDes[0].injector.get(EditionSheetsPanelStubComponent);

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

            describe('#onSvgSheetSelect()', () => {
                beforeEach(() => {
                    onSvgSheetSelectSpy.mockClear();
                    serviceNavigateToSvgSheetSpy.mockClear();
                });

                it('... should have a method `onSvgSheetSelect`', () => {
                    expect(component.onSvgSheetSelect).toBeDefined();
                });

                it('... should do nothing if no sheetId is provided', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = { complexId: 'op25', sheetId: '' };
                    component.onSvgSheetSelect(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
                });

                it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.onSvgSheetSelect(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.onSvgSheetSelect(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });

                it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                    const expectedSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.onSvgSheetSelect(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: EditionNavigationSheetTarget = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.onSvgSheetSelect(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });
            });
        });
    });
});
