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
import { EditionSvgOverlayTkk } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import {
    EditionSvgSheet,
    EditionSvgSheetContent,
    EditionSvgSheetId,
    EditionSvgSheetsList,
} from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioConvolute, FolioConvoluteList } from '@awg-views/edition-view/models/folio.model';
import { TextcriticalCommentary, Textcritics, TextcriticsList } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';
import { EditionSheetsService } from '@awg-views/edition-view/services/edition-sheets.service';
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
    readonly selectedSheetId = input.required<EditionSvgSheetId>();
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
    readonly selectedSheetId = input.required<EditionSvgSheetId>();
}

describe('EditionSheetsComponent (DONE)', () => {
    let component: EditionSheetsComponent;
    let fixture: ComponentFixture<EditionSheetsComponent>;
    let compDe: DebugElement;

    let mockActivatedRoute: ActivatedRouteStub;
    let expectedRouteUrl: UrlSegmentStub[] = [];
    const expectedPath = 'sheets';

    let editionStateService: EditionStateService;
    let mockEditionSheetsService: Partial<EditionSheetsService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let editionSheetsServiceFindTextcriticsSpy: Spy;
    let editionSheetsServiceGetCurrentEditionTypeSpy: Spy;
    let editionSheetsServiceGetNextSheetIdSpy: Spy;
    let editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy: Spy;
    let editionSheetsServiceSelectSvgSheetByIdSpy: Spy;
    let editionSheetsServiceSelectConvoluteSpy: Spy;
    let onBrowseSvgSheetSpy: Spy;
    let onLinkBoxSelectSpy: Spy;
    let onOverlaySelectSpy: Spy;
    let onSvgSheetSelectSpy: Spy;
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
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedTextcriticsListData: TextcriticsList;
    let expectedSelectedTextcritics: Textcritics;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedNextSheetId: string;

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

        mockEditionSheetsService = {
            findTextcritics: (): Textcritics => new Textcritics(),
            getCurrentEditionType: (): keyof EditionSvgSheetsList['sheets'] | undefined => undefined,
            getNextSheetId: (): string => '',
            filterTextcriticalCommentaryForOverlays: (): TextcriticalCommentary => new TextcriticalCommentary(),
            selectSvgSheetById: (): EditionSvgSheet => new EditionSvgSheet(),
            selectConvolute: (): FolioConvolute | undefined => new FolioConvolute(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionSheetsComponent],
            providers: [
                { provide: EditionNavigationService, useValue: mockNavigationService },
                { provide: EditionSheetsService, useValue: mockEditionSheetsService },
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
        mockActivatedRoute.testQueryParamMap = { id: '' };

        expectedFolioConvoluteData = structuredClone(mockEditionData.mockFolioConvoluteData);
        expectedSvgSheetsData = structuredClone(mockEditionData.mockSvgSheetList);
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'M212_Sk1';
        expectedNextSheetId = 'test_item_id_2';

        expectedConvolute = expectedFolioConvoluteData.convolutes[0];

        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2);

        expectedSelectedTextcritics = expectedTextcriticsListData.textcritics[0];

        // Serive spies
        editionSheetsServiceFindTextcriticsSpy = vi
            .spyOn(mockEditionSheetsService, 'findTextcritics')
            .mockReturnValue(expectedSelectedTextcritics);
        editionSheetsServiceGetCurrentEditionTypeSpy = vi.spyOn(mockEditionSheetsService, 'getCurrentEditionType');
        editionSheetsServiceGetNextSheetIdSpy = vi.spyOn(mockEditionSheetsService, 'getNextSheetId');
        editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy = vi.spyOn(
            mockEditionSheetsService,
            'filterTextcriticalCommentaryForOverlays'
        );
        editionSheetsServiceSelectConvoluteSpy = vi
            .spyOn(mockEditionSheetsService, 'selectConvolute')
            .mockReturnValue(expectedConvolute);
        editionSheetsServiceSelectSvgSheetByIdSpy = vi
            .spyOn(mockEditionSheetsService, 'selectSvgSheetById')
            .mockReturnValue(expectedSvgSheet);

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
        selectSvgSheetSpy = vi.spyOn(component, '_selectSvgSheet' as any);
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

        it('... should have signal `selectedSvgSheet` to hold undefined', () => {
            expectToBe(isSignal(component.selectedSvgSheet), true);

            expect(component.selectedSvgSheet()).toBeUndefined();
        });

        it('... should have signal `selectedTkkOverlays` to hold an empty array', () => {
            expectToBe(isSignal(component.selectedTkkOverlays), true);

            expectToEqual(component.selectedTkkOverlays(), []);
        });

        it('... should have computed signal `selectedSheetId` to hold an undefined id and partial', () => {
            expectToBe(isSignal(component.selectedSheetId), true);

            expectToEqual(component.selectedSheetId(), { id: undefined, partial: undefined });
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

        describe('... computed signal `selectedSheetId`', () => {
            it('... should hold the id and the partial of the selected svg sheet', () => {
                component.selectedSvgSheet.set(expectedSvgSheet);

                expectToEqual(component.selectedSheetId(), {
                    id: expectedSvgSheet.id,
                    partial: expectedSvgSheet.content[0].partial,
                });
            });

            it('... should have recomputed signal `selectedSheetId` when a svg sheet with partial is selected', () => {
                const expectedSvgSheetWithPartial = structuredClone(mockEditionData.mockSvgSheet_Sk2a);

                component.selectedSvgSheet.set(expectedSvgSheetWithPartial);

                expectToEqual(component.selectedSheetId(), { id: expectedSvgSheetWithPartial.id, partial: 'a' });
            });

            it('... should hold an undefined id and partial without selected svg sheet', () => {
                component.selectedSvgSheet.set(undefined);

                expectToEqual(component.selectedSheetId(), { id: undefined, partial: undefined });
            });
        });

        describe('... computed signal `selectedConvolute`', () => {
            it('... should hold the expected convolute of the selected svg sheet', () => {
                component.selectedSvgSheet.set(expectedSvgSheet);

                expectToEqual(component.selectedConvolute(), expectedConvolute);
                expectSpyCall(editionSheetsServiceSelectConvoluteSpy, 1, [
                    expectedFolioConvoluteData.convolutes,
                    expectedSvgSheetsData.sheets,
                    expectedSvgSheet,
                ]);
            });

            it('... should hold undefined without selected svg sheet', () => {
                component.selectedSvgSheet.set(undefined);

                expect(component.selectedConvolute()).toBeUndefined();
                expectSpyCall(editionSheetsServiceSelectConvoluteSpy, 0);
            });

            it.each([
                ['svgSheetsData', { svgSheetsData: undefined }],
                ['folioConvoluteData', { folioConvoluteData: undefined }],
            ])('... should hold undefined if %s is missing', (_label, missingContent) => {
                mockViewDataSignal.set(createMockViewData({ ...expectedViewDataContent, ...missingContent } as any));
                component.selectedSvgSheet.set(expectedSvgSheet);

                expect(component.selectedConvolute()).toBeUndefined();
                expectSpyCall(editionSheetsServiceSelectConvoluteSpy, 0);
            });

            it('... should have recomputed signal `selectedConvolute` when selected svg sheet changes', () => {
                const expectedNextConvolute = expectedFolioConvoluteData.convolutes[1];
                component.selectedSvgSheet.set(expectedSvgSheet);

                expectToEqual(component.selectedConvolute(), expectedConvolute);

                editionSheetsServiceSelectConvoluteSpy.mockReturnValue(expectedNextConvolute);
                component.selectedSvgSheet.set(expectedNextSvgSheet);

                expectToEqual(component.selectedConvolute(), expectedNextConvolute);
                expectSpyCall(editionSheetsServiceSelectConvoluteSpy, 2, [
                    expectedFolioConvoluteData.convolutes,
                    expectedSvgSheetsData.sheets,
                    expectedNextSvgSheet,
                ]);
            });
        });

        describe('... computed signal `selectedTextcritics`', () => {
            it('... should hold the expected textcritics of the selected svg sheet', () => {
                component.selectedSvgSheet.set(expectedSvgSheet);

                expectToEqual(component.selectedTextcritics(), expectedSelectedTextcritics);
                expectSpyCall(editionSheetsServiceFindTextcriticsSpy, 1, [
                    expectedTextcriticsListData.textcritics,
                    expectedSvgSheet,
                ]);
            });

            it('... should hold undefined without selected svg sheet', () => {
                component.selectedSvgSheet.set(undefined);

                expect(component.selectedTextcritics()).toBeUndefined();
                expectSpyCall(editionSheetsServiceFindTextcriticsSpy, 0);
            });

            it('... should hold undefined if textcriticsData is missing', () => {
                mockViewDataSignal.set(
                    createMockViewData({ ...expectedViewDataContent, textcriticsData: undefined } as any)
                );
                component.selectedSvgSheet.set(expectedSvgSheet);

                expect(component.selectedTextcritics()).toBeUndefined();
                expectSpyCall(editionSheetsServiceFindTextcriticsSpy, 0);
            });
        });

        describe('... computed signal `displayedTextcritics`', () => {
            beforeEach(() => {
                component.selectedSvgSheet.set(expectedSvgSheet);
            });

            it('... should hold the selected textcritics with the commentary filtered for the selected overlays', () => {
                const commentary = expectedSelectedTextcritics.commentary;

                for (const comment of commentary.comments) {
                    for (const blockComment of comment.blockComments) {
                        const expectedOverlays = [createTestTkkOverlay(blockComment.svgGroupId ?? '')];
                        const expectedCommentary = {
                            preamble: commentary.preamble,
                            comments: [{ ...comment, blockComments: [blockComment] }],
                        };
                        editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy.mockReturnValue(
                            expectedCommentary
                        );

                        component.selectedTkkOverlays.set(expectedOverlays);

                        expectToEqual(component.displayedTextcritics(), {
                            ...expectedSelectedTextcritics,
                            commentary: expectedCommentary,
                        });
                        expect(editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy).toHaveBeenLastCalledWith(
                            commentary,
                            expectedOverlays
                        );
                    }
                }
            });

            it('... should hold the selected textcritics with the commentary filtered for no overlays', () => {
                const expectedEmptyCommentary = { preamble: '', comments: [] };
                editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy.mockReturnValue(expectedEmptyCommentary);

                expectToEqual(component.displayedTextcritics(), {
                    ...expectedSelectedTextcritics,
                    commentary: expectedEmptyCommentary,
                });
                expectSpyCall(editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy, 1, [
                    expectedSelectedTextcritics.commentary,
                    [],
                ]);
            });

            it('... should keep `selectedTextcritics` unchanged', () => {
                const expectedCommentary = structuredClone(expectedSelectedTextcritics.commentary);

                component.selectedTkkOverlays.set([createTestTkkOverlay('g1114')]);
                component.displayedTextcritics();

                expectToEqual(component.selectedTextcritics()?.commentary, expectedCommentary);
            });

            it('... should hold undefined without `selectedTextcritics`', () => {
                component.selectedSvgSheet.set(undefined);
                component.selectedTkkOverlays.set([createTestTkkOverlay('g1114')]);

                expect(component.displayedTextcritics()).toBeUndefined();
            });

            it.each([
                ['a missing', undefined],
                ['an empty', {}],
            ])('... should hold %s commentary unfiltered', (_label, commentary) => {
                editionSheetsServiceFindTextcriticsSpy.mockReturnValue({
                    ...expectedSelectedTextcritics,
                    commentary: commentary as any,
                });
                component.selectedTkkOverlays.set([createTestTkkOverlay('g1114')]);

                expect(component.displayedTextcritics()?.commentary).toEqual(commentary);
                expectSpyCall(editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy, 0);
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
                    // Mock data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: null,
                        })
                    );

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

                    it('... should pass down `selectedSvgSheet` to the EditionSheetsPanelComponent', async () => {
                        component.selectedSvgSheet.set(expectedSvgSheet);
                        await detectChangesOnPush(fixture);

                        expectToEqual(sheetsPanelCmp.selectedSvgSheet(), expectedSvgSheet);
                    });

                    it('... should pass down `selectedSheetId` to the EditionSheetsPanelComponent', async () => {
                        component.selectedSvgSheet.set(expectedSvgSheet);
                        await detectChangesOnPush(fixture);

                        expectToEqual(sheetsPanelCmp.selectedSheetId(), component.selectedSheetId());
                    });

                    it('... should pass down `displayedTextcritics` to the EditionSheetsPanelComponent', async () => {
                        editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy.mockReturnValue(
                            expectedSelectedTextcritics.commentary
                        );
                        component.selectedSvgSheet.set(expectedSvgSheet);
                        await detectChangesOnPush(fixture);

                        expectToEqual(sheetsPanelCmp.displayedTextcritics(), expectedSelectedTextcritics);
                    });
                });

                describe('... EditionFoliosPanelComponent (stubbed)', () => {
                    it('... should contain no EditionFoliosPanelComponent (stubbed) if no svg sheet is selected', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelStubComponent, 0, 0);
                    });

                    it('... should contain no EditionFoliosPanelComponent (stubbed) if no convolute is found', async () => {
                        editionSheetsServiceSelectConvoluteSpy.mockReturnValue(undefined);
                        component.selectedSvgSheet.set(expectedSvgSheet);
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(compDe, EditionFoliosPanelStubComponent, 0, 0);
                    });

                    describe('... with selected svg sheet and convolute', () => {
                        beforeEach(async () => {
                            component.selectedSvgSheet.set(expectedSvgSheet);
                            await detectChangesOnPush(fixture);
                        });

                        it('... should contain one EditionFoliosPanelComponent (stubbed)', () => {
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

                        it('... should pass down `selectedSheetId` to the EditionFoliosPanelComponent', () => {
                            const foliosPanelDes = getAndExpectDebugElementByDirective(
                                compDe,
                                EditionFoliosPanelStubComponent,
                                1,
                                1
                            );
                            const foliosPanelCmp = foliosPanelDes[0].injector.get(EditionFoliosPanelStubComponent);

                            expectToEqual(foliosPanelCmp.selectedSheetId(), component.selectedSheetId());
                        });
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#onBrowseSvgSheet()', () => {
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

                describe('... should do nothing if', () => {
                    it('... selectedSvgSheet is undefined', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;

                        component.selectedSvgSheet.set(undefined);

                        component.onBrowseSvgSheet(1);

                        expectSpyCall(editionSheetsServiceGetCurrentEditionTypeSpy, 0);
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
                    });

                    it('... edition type is undefined', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedDirection = 1;
                        component.selectedSvgSheet.set(expectedSvgSheet);
                        editionSheetsServiceGetCurrentEditionTypeSpy.mockReturnValue(undefined);

                        component.onBrowseSvgSheet(expectedDirection);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
                    });
                });

                describe('... should trigger `onSvgSheetSelect()` method with correct sheet id', () => {
                    it('... if direction is 1', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedDirection = 1;
                        const expectedEditionType = 'sketchEditions';
                        editionSheetsServiceGetCurrentEditionTypeSpy.mockReturnValue(expectedEditionType);
                        editionSheetsServiceGetNextSheetIdSpy.mockReturnValue(expectedNextSvgSheet.id + 'a');
                        component.selectedSvgSheet.set(expectedSvgSheet);

                        component.onBrowseSvgSheet(expectedDirection);

                        expectSpyCall(editionSheetsServiceGetNextSheetIdSpy, 1, [
                            expectedDirection,
                            expectedSvgSheet,
                            expectedSvgSheetsData.sheets[expectedEditionType],
                        ]);
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls + 1, {
                            complexId: '',
                            sheetId: expectedNextSvgSheet.id + 'a',
                        });
                    });

                    it('... if direction is -1', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedDirection = -1;
                        const expectedEditionType = 'sketchEditions';
                        editionSheetsServiceGetCurrentEditionTypeSpy.mockReturnValue(expectedEditionType);
                        editionSheetsServiceGetNextSheetIdSpy.mockReturnValue(expectedSvgSheet.id);
                        component.selectedSvgSheet.set(expectedNextSvgSheet);

                        component.onBrowseSvgSheet(expectedDirection);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls + 1, {
                            complexId: '',
                            sheetId: expectedSvgSheet.id,
                        });
                    });
                });
            });

            describe('#onLinkBoxSelect()', () => {
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
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedLinkBoxId = 'linkBox1';
                        component.selectedSvgSheet.set(undefined);

                        component.onLinkBoxSelect(expectedLinkBoxId);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
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
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedLinkBoxId = 'linkBox1';
                        editionSheetsServiceFindTextcriticsSpy.mockReturnValue({
                            ...expectedSelectedTextcritics,
                            linkBoxes,
                        });
                        component.selectedSvgSheet.set(expectedSvgSheet);

                        component.onLinkBoxSelect(expectedLinkBoxId);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
                    });
                });

                it('... should find correct link box and trigger `onSvgSheetSelect()` method with correct parameters', () => {
                    const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                    expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                    const expectedLinkBoxId = 'linkBox1';
                    const expectedLinkBox = {
                        svgGroupId: expectedLinkBoxId,
                        linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' },
                    };
                    editionSheetsServiceFindTextcriticsSpy.mockReturnValue({
                        ...expectedSelectedTextcritics,
                        linkBoxes: [expectedLinkBox],
                    });
                    component.selectedSvgSheet.set(expectedSvgSheet);

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(onSvgSheetSelectSpy, initialCalls + 1, expectedLinkBox.linkTo);
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
                    const expectedSheetIds: SheetClickEvent = { complexId: 'op25', sheetId: '' };
                    component.onSvgSheetSelect(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);
                });

                it('... should trigger NavigationService with selected svg sheet within same complex', () => {
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.onSvgSheetSelect(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.onSvgSheetSelect(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });

                it('... should trigger NavigationService with selected svg sheet for another complex', () => {
                    const expectedSheetIds: SheetClickEvent = {
                        complexId: expectedComplexId,
                        sheetId: expectedSheetId,
                    };
                    component.onSvgSheetSelect(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 1, expectedSheetIds);

                    const expectedNextSheetIds: SheetClickEvent = {
                        complexId: expectedNextComplexId,
                        sheetId: expectedNextSheetId,
                    };
                    component.onSvgSheetSelect(expectedNextSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 2, expectedNextSheetIds);
                });
            });

            describe('#_getDefaultSheetId()', () => {
                it('... should have a method `_getDefaultSheetId`', () => {
                    expect(component['_getDefaultSheetId']).toBeDefined();
                });

                describe('... should return an empty string if', () => {
                    it('... textEditions and sketchEditions are empty', () => {
                        const mockSvgSheetsData = {
                            sheets: { textEditions: [] as EditionSvgSheet[], sketchEditions: [] as EditionSvgSheet[] },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, '');
                    });
                });

                describe('... with text editions', () => {
                    it('... should default to text editions when text and sketch editions are present', () => {
                        const mockSheet1 = { id: 'sheet1', content: [] as EditionSvgSheetContent[] } as EditionSvgSheet;
                        const mockSheet2 = { id: 'sheet2', content: [] as EditionSvgSheetContent[] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [mockSheet1],
                                sketchEditions: [mockSheet2],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, mockSheet1.id);
                    });

                    it('... should return the id of the first text edition sheet by default (no partials)', () => {
                        const mockSheet1 = { id: 'sheet1', content: [] as EditionSvgSheetContent[] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [mockSheet1],
                                sketchEditions: [] as EditionSvgSheet[],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, mockSheet1.id);
                    });

                    it('... should return the id and first partial of the first text edition sheet by default if partials are present', () => {
                        const mockSheet1 = {
                            id: 'sheet1',
                            content: [
                                { svg: '', image: '', partial: 'a' },
                                { svg: '', image: '', partial: 'b' },
                            ],
                        } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [mockSheet1],
                                sketchEditions: [] as EditionSvgSheet[],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, 'sheet1a');
                    });

                    it('... should return the first id and partial of the first text edition sheet from a list of multiple sheets', () => {
                        const mockSheet1 = {
                            id: 'sheet1',
                            content: [
                                { svg: '', image: '', partial: 'a' },
                                { svg: '', image: '', partial: 'b' },
                            ],
                        } as EditionSvgSheet;
                        const mockSheet2 = {
                            id: 'sheet2',
                            content: [
                                { svg: '', image: '', partial: 'c' },
                                { svg: '', image: '', partial: 'd' },
                            ],
                        } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [mockSheet1, mockSheet2],
                                sketchEditions: [] as EditionSvgSheet[],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, 'sheet1a');
                    });

                    it('... should return the first id and partial of the first sketch edition sheet from a list of multiple edition types', () => {
                        const mockSheet1 = {
                            id: 'sheet1',
                            content: [
                                { svg: '', image: '', partial: 'a' },
                                { svg: '', image: '', partial: 'b' },
                            ],
                        } as EditionSvgSheet;
                        const mockSheet2 = {
                            id: 'sheet2',
                            content: [
                                { svg: '', image: '', partial: 'c' },
                                { svg: '', image: '', partial: 'd' },
                            ],
                        } as EditionSvgSheet;
                        const mockSheet3 = { id: 'sheet3', content: [] as EditionSvgSheetContent[] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                workEditions: [mockSheet1],
                                textEditions: [mockSheet2],
                                sketchEditions: [mockSheet3],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, 'sheet2c');
                    });
                });

                describe('... without text editions', () => {
                    it('... should return the id of the first sketch sheet by default (no partials)', () => {
                        const mockSheet1 = { id: 'sheet1', content: [] as EditionSvgSheetContent[] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [] as EditionSvgSheet[],
                                sketchEditions: [mockSheet1],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, mockSheet1.id);
                    });

                    it('... should return the id and first partial of the first sketch sheet by default if partials are present', () => {
                        const mockSheet1 = {
                            id: 'sheet1',
                            content: [
                                { svg: '', image: '', partial: 'a' },
                                { svg: '', image: '', partial: 'b' },
                            ],
                        } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [] as EditionSvgSheet[],
                                sketchEditions: [mockSheet1],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, 'sheet1a');
                    });

                    it('... should return the first id and partial of the first sketch sheet from a list of multiple sheets', () => {
                        const mockSheet1 = {
                            id: 'sheet1',
                            content: [
                                { svg: '', image: '', partial: 'a' },
                                { svg: '', image: '', partial: 'b' },
                            ],
                        } as EditionSvgSheet;
                        const mockSheet2 = {
                            id: 'sheet2',
                            content: [
                                { svg: '', image: '', partial: 'c' },
                                { svg: '', image: '', partial: 'd' },
                            ],
                        } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [] as EditionSvgSheet[],
                                sketchEditions: [mockSheet1, mockSheet2],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, 'sheet1a');
                    });

                    it('... should return the first id and partial of the first sketch sheet from a list of multiple edition types', () => {
                        const mockSheet1 = {
                            id: 'sheet1',
                            content: [
                                { svg: '', image: '', partial: 'a' },
                                { svg: '', image: '', partial: 'b' },
                            ],
                        } as EditionSvgSheet;
                        const mockSheet2 = { id: 'sheet2', content: [] as EditionSvgSheetContent[] } as EditionSvgSheet;
                        const mockSheet3 = {
                            id: 'sheet3',
                            content: [
                                { svg: '', image: '', partial: 'c' },
                                { svg: '', image: '', partial: 'd' },
                            ],
                        } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                workEditions: [mockSheet1, mockSheet2],
                                textEditions: [],
                                sketchEditions: [mockSheet3],
                            },
                        } as EditionSvgSheetsList;

                        const result = component['_getDefaultSheetId'](mockSvgSheetsData);

                        expectToBe(result, 'sheet3c');
                    });
                });
            });

            describe('#_handleQueryParams()', () => {
                beforeEach(() => {
                    selectSvgSheetSpy.mockClear();
                    onSvgSheetSelectSpy.mockClear();
                });

                it('... should have a method `_handleQueryParams`', () => {
                    expect(component['_handleQueryParams']).toBeDefined();
                });

                describe('... with svgSheetsData available and id given from query params', () => {
                    it('... should trigger `_selectSvgSheet` with the correct sheet id', () => {
                        const sheetId = 'test-TF1';
                        mockActivatedRoute.testQueryParamMap = { id: sheetId };

                        if (!mockActivatedRoute.testQueryParamMap) {
                            expect.fail('Expected mockActivatedRoute.testQueryParamMap to be defined');
                        }

                        component['_handleQueryParams'](mockActivatedRoute.testQueryParamMap, expectedSvgSheetsData);

                        expectSpyCall(selectSvgSheetSpy, 1, sheetId);
                    });
                });

                describe('... with svgSheetsData available and id not given from query params', () => {
                    it('... should always trigger `onSvgSheetSelect` with the default sheet id', () => {
                        const defaultSheetId = 'test-TF1a';
                        mockActivatedRoute.testQueryParamMap = { id: '' };

                        if (!mockActivatedRoute.testQueryParamMap) {
                            expect.fail('Expected mockActivatedRoute.testQueryParamMap to be defined');
                        }

                        component['_handleQueryParams'](mockActivatedRoute.testQueryParamMap, expectedSvgSheetsData);

                        expectSpyCall(onSvgSheetSelectSpy, 1, {
                            complexId: '',
                            sheetId: defaultSheetId,
                        });
                    });
                });

                describe('... with svgSheetsData not available and id not given from query params', () => {
                    let mockSvgSheetsData: EditionSvgSheetsList;

                    beforeEach(() => {
                        mockActivatedRoute.testQueryParamMap = { id: '' };

                        mockSvgSheetsData = {
                            sheets: {
                                textEditions: [],
                                sketchEditions: [],
                            },
                        } as any;
                    });
                    it('... should trigger `onSvgSheetSelect` with no id', () => {
                        if (!mockActivatedRoute.testQueryParamMap) {
                            expect.fail('Expected mockActivatedRoute.testQueryParamMap to be defined');
                        }

                        component['_handleQueryParams'](mockActivatedRoute.testQueryParamMap, mockSvgSheetsData);

                        expectSpyCall(onSvgSheetSelectSpy, 1, {
                            complexId: '',
                            sheetId: '',
                        });
                    });

                    it('... should reset `selectedSvgSheet` to undefined', () => {
                        if (!mockActivatedRoute.testQueryParamMap) {
                            expect.fail('Expected mockActivatedRoute.testQueryParamMap to be defined');
                        }
                        component.selectedSvgSheet.set(expectedSvgSheet);

                        component['_handleQueryParams'](mockActivatedRoute.testQueryParamMap, mockSvgSheetsData);

                        expect(component.selectedSvgSheet()).toBeUndefined();
                    });
                });

                it('... should set `isFirstPageLoad` to false after handling query params', () => {
                    component.isFirstPageLoad.set(true);
                    mockActivatedRoute.testQueryParamMap = { id: 'sheetId' };

                    if (!mockActivatedRoute.testQueryParamMap) {
                        expect.fail('Expected mockActivatedRoute.testQueryParamMap to be defined');
                    }

                    component['_handleQueryParams'](mockActivatedRoute.testQueryParamMap, expectedSvgSheetsData);

                    expectToBe(component.isFirstPageLoad(), false);
                });
            });

            describe('#_selectSvgSheet()', () => {
                it('... should have a method `_selectSvgSheet`', () => {
                    expect(component['_selectSvgSheet']).toBeDefined();
                });

                describe('... should do nothing if', () => {
                    it.each([
                        {
                            desc: 'sheet id is undefined',
                            sheetId: undefined as any,
                            content: () => expectedViewDataContent,
                        },
                        {
                            desc: 'sheet id is null',
                            sheetId: null as any,
                            content: () => expectedViewDataContent,
                        },
                        {
                            desc: 'sheet id is an empty string',
                            sheetId: '',
                            content: () => expectedViewDataContent,
                        },
                        {
                            desc: 'svgSheetsData.sheets is missing',
                            sheetId: 'validId',
                            content: () => ({
                                ...expectedViewDataContent,
                                svgSheetsData: undefined,
                            }),
                        },
                        {
                            desc: 'folioConvoluteData.convolutes is missing',
                            sheetId: 'validId',
                            content: () => ({
                                ...expectedViewDataContent,
                                folioConvoluteData: undefined,
                            }),
                        },
                        {
                            desc: 'textcriticsData.textcritics is missing',
                            sheetId: 'validId',
                            content: () => ({
                                ...expectedViewDataContent,
                                textcriticsData: undefined,
                            }),
                        },
                    ])('... $desc', async ({ sheetId, content }) => {
                        mockViewDataSignal.set(
                            createMockViewData(content() as any, {
                                isLoading: false,
                                error: null,
                            })
                        );
                        editionSheetsServiceSelectSvgSheetByIdSpy.mockClear();

                        component['_selectSvgSheet'](sheetId);

                        expectSpyCall(editionSheetsServiceSelectSvgSheetByIdSpy, 0);
                        expect(component.selectedSvgSheet()).toBeUndefined();
                    });
                });

                describe('... with a valid sheet id', () => {
                    it('... should set `selectedSvgSheet` to hold the expected svg sheet', () => {
                        component['_selectSvgSheet'](expectedSvgSheet.id);

                        expectSpyCall(editionSheetsServiceSelectSvgSheetByIdSpy, 1, [
                            expectedSvgSheetsData.sheets,
                            expectedSvgSheet.id,
                        ]);
                        expectToEqual(component.selectedSvgSheet(), expectedSvgSheet);
                    });

                    it('... should have computed signals `selectedConvolute` and `selectedTextcritics` to hold the expected values', () => {
                        component['_selectSvgSheet'](expectedSvgSheet.id);

                        expectToEqual(component.selectedConvolute(), expectedConvolute);
                        expectToEqual(component.selectedTextcritics(), expectedSelectedTextcritics);
                    });

                    it('... should reset `selectedTkkOverlays` to an empty array', () => {
                        component.selectedTkkOverlays.set([createTestTkkOverlay('g1114')]);

                        component['_selectSvgSheet'](expectedSvgSheet.id);

                        expectToEqual(component.selectedTkkOverlays(), []);
                    });
                });

                describe('... with an unknown sheet id', () => {
                    it('... should set `selectedSvgSheet` and its computed signals to hold undefined', () => {
                        editionSheetsServiceSelectSvgSheetByIdSpy.mockReturnValue(undefined);

                        component['_selectSvgSheet']('unknown-id');

                        expect(component.selectedSvgSheet()).toBeUndefined();
                        expect(component.selectedConvolute()).toBeUndefined();
                        expect(component.selectedTextcritics()).toBeUndefined();
                        expect(component.displayedTextcritics()).toBeUndefined();
                    });
                });
            });
        });
    });
});
