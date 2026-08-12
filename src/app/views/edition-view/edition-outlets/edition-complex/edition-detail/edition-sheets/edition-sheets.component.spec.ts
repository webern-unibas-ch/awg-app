import { Component, DebugElement, EventEmitter, Input, isSignal, Output, signal, WritableSignal } from '@angular/core';
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

import {
    EditionComplex,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetsList,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalCommentary,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';
import { EditionSheetsService } from '@awg-views/edition-view/services/edition-sheets.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionSheetsComponent } from './edition-sheets.component';

// Mock components
@Component({
    selector: 'awg-edition-accolade',
    template: '',
    standalone: false,
})
class EditionAccoladeStubComponent {
    @Input()
    isSheetFacetMinimized: boolean;
    @Input()
    svgSheetsData: EditionSvgSheetsList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedTextcriticalCommentary: TextcriticalCommentary;
    @Input()
    selectedTextcritics: Textcritics;
    @Input()
    showTkA: boolean;
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();
    @Output()
    selectLinkBoxRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();
    @Output()
    toggleSheetFacetRequest: EventEmitter<boolean> = new EventEmitter();
}

@Component({
    selector: 'awg-edition-convolute',
    template: '',
    standalone: false,
})
class EditionConvoluteStubComponent {
    @Input()
    selectedConvolute: FolioConvolute;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
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
    let onToggleSheetFacetSpy: Spy;
    let serviceNavigateToSvgSheetSpy: Spy;

    let mockViewDataSignal: WritableSignal<EditionViewData<'sheets'>>;
    let expectedViewDataContent: EditionViewDataContent<'sheets'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'sheets'>;
    let expectedConvolute: FolioConvolute;
    let expectedIsSheetFacetMinimized: boolean;
    let expectedComplex: EditionComplex;
    let expectedFolioConvoluteData: FolioConvoluteList;
    let expectedSvgSheetsData: EditionSvgSheetsList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedTextcriticsListData: TextcriticsList;
    let expectedSelectedTextcritics: Textcritics;
    let expectedSelectedTextcriticalCommentary: TextcriticalCommentary;
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
            imports: [AlertErrorStubComponent, TwelveToneSpinnerStubComponent],
            declarations: [EditionSheetsComponent, EditionConvoluteStubComponent, EditionAccoladeStubComponent],
            providers: [
                { provide: EditionNavigationService, useValue: mockNavigationService },
                { provide: EditionSheetsService, useValue: mockEditionSheetsService },
                { provide: EditionViewService, useValue: { sheetsViewData: mockViewDataSignal.asReadonly() } },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        mockActivatedRoute.testQueryParamMap = { id: '' };

        expectedFolioConvoluteData = structuredClone(mockEditionData.mockFolioConvoluteData);
        expectedSvgSheetsData = structuredClone(mockEditionData.mockSvgSheetList);
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        expectedIsSheetFacetMinimized = false;

        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);
        expectedNextComplexId = 'testComplex2';
        expectedSheetId = 'M212_Sk1';
        expectedNextSheetId = 'test_item_id_2';

        expectedConvolute = expectedFolioConvoluteData.convolutes[0];

        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedNextSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk2);

        expectedSelectedTextcritics = expectedTextcriticsListData.textcritics[0];
        expectedSelectedTextcriticalCommentary = expectedSelectedTextcritics.commentary;

        // Serive spies
        editionSheetsServiceFindTextcriticsSpy = vi.spyOn(mockEditionSheetsService, 'findTextcritics');
        editionSheetsServiceGetCurrentEditionTypeSpy = vi.spyOn(mockEditionSheetsService, 'getCurrentEditionType');
        editionSheetsServiceGetNextSheetIdSpy = vi.spyOn(mockEditionSheetsService, 'getNextSheetId');
        editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy = vi.spyOn(
            mockEditionSheetsService,
            'filterTextcriticalCommentaryForOverlays'
        );
        editionSheetsServiceSelectConvoluteSpy = vi
            .spyOn(mockEditionSheetsService, 'selectConvolute')
            .mockReturnValue(expectedFolioConvoluteData.convolutes[0]);
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
        onToggleSheetFacetSpy = vi.spyOn(component, 'onToggleSheetFacet');
        selectSvgSheetSpy = vi.spyOn(component as any, '_selectSvgSheet');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `isSheetFacetMinimized` = false', () => {
            expectToBe(component.isSheetFacetMinimized, false);
        });

        it('... should not have `selectedConvolute`', () => {
            expect(component.selectedConvolute).toBeUndefined();
        });

        it('... should not have `selectedSvgSheet`', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should not have `selectedTextcriticalCommentary`', () => {
            expect(component.selectedTextcriticalCommentary).toBeUndefined();
        });

        it('... should not have `selectedTextcritics`', () => {
            expect(component.selectedTextcritics).toBeUndefined();
        });

        it('... should have `showTkA` = false', () => {
            expectToBe(component.showTkA, false);
        });

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

            it('... should contain no AccoladeComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 0, 0);
            });

            it('... should contain no ConvoluteComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionConvoluteStubComponent, 0, 0);
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

        describe('VIEW', () => {
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
                                    svgSheetsData: undefined,
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
                beforeEach(async () => {
                    // Mock data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.awg-edition-sheets-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sheets-view', 1, 1);
                });

                describe('... AccoladeComponent (stubbed)', () => {
                    it('... should contain one AccoladeComponent (stubbed)', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    });

                    it('... should pass down `isSheetFacetMinimized` to the EditionAccoladeComponent', () => {
                        const accoladeDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionAccoladeStubComponent,
                            1,
                            1
                        );
                        const accoladeCmp = accoladeDes[0].injector.get(
                            EditionAccoladeStubComponent
                        ) as EditionAccoladeStubComponent;

                        expectToEqual(accoladeCmp.isSheetFacetMinimized, expectedIsSheetFacetMinimized);
                    });

                    it('... should pass down `svgSheetsData` to the EditionAccoladeComponent', () => {
                        const accoladeDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionAccoladeStubComponent,
                            1,
                            1
                        );
                        const accoladeCmp = accoladeDes[0].injector.get(
                            EditionAccoladeStubComponent
                        ) as EditionAccoladeStubComponent;

                        expectToEqual(accoladeCmp.svgSheetsData, expectedSvgSheetsData);
                    });

                    it('... should pass down `selectedSvgSheet` to the EditionAccoladeComponent', async () => {
                        component.selectedSvgSheet = expectedSvgSheet;
                        await detectChangesOnPush(fixture);

                        await detectChangesOnPush(fixture);
                        const accoladeDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionAccoladeStubComponent,
                            1,
                            1
                        );
                        const accoladeCmp = accoladeDes[0].injector.get(
                            EditionAccoladeStubComponent
                        ) as EditionAccoladeStubComponent;

                        expectToEqual(accoladeCmp.selectedSvgSheet, expectedSvgSheet);
                    });

                    it('... should pass down `selectedTextcritics` to the EditionAccoladeComponent', async () => {
                        component.selectedTextcritics = expectedSelectedTextcritics;
                        await detectChangesOnPush(fixture);

                        const accoladeDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionAccoladeStubComponent,
                            1,
                            1
                        );
                        const accoladeCmp = accoladeDes[0].injector.get(
                            EditionAccoladeStubComponent
                        ) as EditionAccoladeStubComponent;

                        expectToEqual(accoladeCmp.selectedTextcritics, expectedSelectedTextcritics);
                    });

                    it('... should pass down `selectedTextcriticalCommentary` to the EditionAccoladeComponent', async () => {
                        component.selectedTextcriticalCommentary = expectedSelectedTextcriticalCommentary;
                        await detectChangesOnPush(fixture);

                        const accoladeDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionAccoladeStubComponent,
                            1,
                            1
                        );
                        const accoladeCmp = accoladeDes[0].injector.get(
                            EditionAccoladeStubComponent
                        ) as EditionAccoladeStubComponent;

                        expectToEqual(
                            accoladeCmp.selectedTextcriticalCommentary,
                            expectedSelectedTextcriticalCommentary
                        );
                    });

                    it('... should pass down `showTkA` to the EditionAccoladeComponent', () => {
                        const accoladeDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionAccoladeStubComponent,
                            1,
                            1
                        );
                        const accoladeCmp = accoladeDes[0].injector.get(
                            EditionAccoladeStubComponent
                        ) as EditionAccoladeStubComponent;

                        expectToEqual(accoladeCmp.showTkA, false);
                    });
                });

                describe('... ConvoluteComponent (stubbed)', () => {
                    it('... should contain no ConvoluteComponent (stubbed) if no convolute is provided', () => {
                        getAndExpectDebugElementByDirective(compDe, EditionConvoluteStubComponent, 0, 0);
                    });

                    it('... should contain one ConvoluteComponent (stubbed) if convolute is provided', async () => {
                        component.selectedConvolute = expectedConvolute;
                        component.selectedSvgSheet = expectedSvgSheet;
                        await detectChangesOnPush(fixture);

                        getAndExpectDebugElementByDirective(compDe, EditionConvoluteStubComponent, 1, 1);
                    });

                    it('... should pass down `selectedConvolute` to the EditionConvoluteComponent', async () => {
                        component.selectedConvolute = expectedConvolute;
                        component.selectedSvgSheet = expectedSvgSheet;
                        await detectChangesOnPush(fixture);

                        const convoluteDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionConvoluteStubComponent,
                            1,
                            1
                        );
                        const convoluteCmp = convoluteDes[0].injector.get(
                            EditionConvoluteStubComponent
                        ) as EditionConvoluteStubComponent;

                        expectToEqual(convoluteCmp.selectedConvolute, expectedConvolute);
                    });

                    it('... should pass down `selectedSvgSheet` to the EditionConvoluteComponent', async () => {
                        component.selectedConvolute = expectedConvolute;
                        component.selectedSvgSheet = expectedSvgSheet;
                        await detectChangesOnPush(fixture);

                        const convoluteDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionConvoluteStubComponent,
                            1,
                            1
                        );
                        const convoluteCmp = convoluteDes[0].injector.get(
                            EditionConvoluteStubComponent
                        ) as EditionConvoluteStubComponent;

                        expectToEqual(convoluteCmp.selectedSvgSheet, expectedSvgSheet);
                    });
                });
            });
        });

        describe('METHODS', () => {
            describe('#onBrowseSvgSheet()', () => {
                it('... should have a method `onBrowseSvgSheet`', () => {
                    expect(component.onBrowseSvgSheet).toBeDefined();
                });

                it('... should trigger on event from EditionAccoladeComponent', () => {
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    const expectedDirection = 1;
                    accoladeCmp.browseSvgSheetRequest.emit(expectedDirection);

                    expectSpyCall(onBrowseSvgSheetSpy, 1, [expectedDirection]);
                });

                describe('... should do nothing if', () => {
                    it('... edition type is undefined', async () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedDirection = 1;
                        component.selectedSvgSheet = expectedSvgSheet;
                        editionSheetsServiceGetCurrentEditionTypeSpy.mockReturnValue(undefined);

                        component.onBrowseSvgSheet(expectedDirection);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
                    });
                });

                describe('... should trigger `onSvgSheetSelect()` method with correct sheet id', () => {
                    beforeEach(() => {
                        editionStateService.updateSelectedEditionComplex(expectedComplex);
                        mockViewDataSignal.set(createMockViewData(expectedViewDataContent));

                        // Trigger initial data binding
                        fixture.detectChanges();
                    });

                    it('... if direction is 1', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedDirection = 1;
                        const expectedEditionType = 'sketchEditions';
                        editionSheetsServiceGetCurrentEditionTypeSpy.mockReturnValue(expectedEditionType);
                        editionSheetsServiceGetNextSheetIdSpy.mockReturnValue(expectedNextSvgSheet.id + 'a');
                        component.selectedSvgSheet = expectedSvgSheet;

                        component.onBrowseSvgSheet(expectedDirection);

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
                        component.selectedSvgSheet = expectedNextSvgSheet;

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

                it('... should trigger on event from EditionAccoladeComponent', () => {
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    const expectedLinkBoxId = 'link-box-1';
                    accoladeCmp.selectLinkBoxRequest.emit(expectedLinkBoxId);

                    expectSpyCall(onLinkBoxSelectSpy, 1, [expectedLinkBoxId]);
                });

                describe('... should do nothing if', () => {
                    it('... selectedSvgSheet is not defined', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedLinkBoxId = 'linkBox1';
                        component.selectedSvgSheet = null;

                        component.onLinkBoxSelect(expectedLinkBoxId);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
                    });

                    it('... selectedTextcritics.linkBoxes are not defined', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedLinkBoxId = 'linkBox1';
                        component.selectedSvgSheet = expectedSvgSheet;
                        component.selectedTextcritics = expectedSelectedTextcritics;
                        component.selectedTextcritics.linkBoxes = null;

                        component.onLinkBoxSelect(expectedLinkBoxId);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
                    });

                    it('... selectedTextcritics.linkBoxes are empty', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedLinkBoxId = 'linkBox1';
                        component.selectedSvgSheet = expectedSvgSheet;
                        component.selectedTextcritics = expectedSelectedTextcritics;
                        component.selectedTextcritics.linkBoxes = [];

                        component.onLinkBoxSelect(expectedLinkBoxId);

                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);
                    });

                    it('... link box is not found', () => {
                        const initialCalls = onSvgSheetSelectSpy.mock.calls.length;
                        expectSpyCall(onSvgSheetSelectSpy, initialCalls);

                        const expectedLinkBoxId = 'linkBox1';
                        component.selectedSvgSheet = expectedSvgSheet;
                        component.selectedTextcritics = expectedSelectedTextcritics;
                        component.selectedTextcritics.linkBoxes = [
                            {
                                svgGroupId: 'unknown-link-box',
                                linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' },
                            },
                        ];

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
                    component.selectedSvgSheet = expectedSvgSheet;
                    component.selectedTextcritics = expectedSelectedTextcritics;
                    component.selectedTextcritics.linkBoxes = [expectedLinkBox];

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(onSvgSheetSelectSpy, initialCalls + 1, expectedLinkBox.linkTo);
                });
            });

            describe('#onOverlaySelect()', () => {
                it('... should have a method `onOverlaySelect`', () => {
                    expect(component.onOverlaySelect).toBeDefined();
                });

                it('... should trigger on event from EditionAccoladeComponent', async () => {
                    component.selectedTextcritics = expectedSelectedTextcritics;
                    await detectChangesOnPush(fixture);

                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    const expectedOverlays = [
                        new EditionSvgOverlay(EditionSvgOverlayTypes.tkk, 'g1114', 'g1114', true),
                    ];

                    accoladeCmp.selectOverlaysRequest.emit(expectedOverlays);

                    expectSpyCall(onOverlaySelectSpy, 1, [expectedOverlays]);
                });

                it('... should correctly filter textcritical commentary and set `showTka` to true', () => {
                    for (const comment of expectedSelectedTextcriticalCommentary.comments) {
                        for (const blockComment of comment.blockComments) {
                            const expectedOverlays = [
                                new EditionSvgOverlay(
                                    EditionSvgOverlayTypes.tkk,
                                    blockComment.svgGroupId,
                                    blockComment.svgGroupId,
                                    true
                                ),
                            ];
                            const expectedCommentary = {
                                preamble: expectedSelectedTextcriticalCommentary.preamble,
                                comments: [
                                    {
                                        ...comment,
                                        blockComments: [blockComment],
                                    },
                                ],
                            };
                            editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy.mockReturnValue(
                                expectedCommentary
                            );
                            component.selectedTextcritics = expectedSelectedTextcritics;

                            component.onOverlaySelect(expectedOverlays);

                            expectToEqual(component.selectedTextcriticalCommentary, expectedCommentary);
                            expectToBe(component.showTkA, true);
                        }
                    }
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

                it('... should do nothing if no id is provided', () => {
                    const expectedSheetIds: SheetClickEvent = undefined;
                    component.onSvgSheetSelect(expectedSheetIds);

                    expectSpyCall(serviceNavigateToSvgSheetSpy, 0, undefined);

                    const expectedNextSheetIds: SheetClickEvent = { complexId: undefined, sheetId: undefined };
                    component.onSvgSheetSelect(expectedNextSheetIds);

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

            describe('#onToggleSheetFacet()', () => {
                it('... should have a method `onToggleSheetFacet`', () => {
                    expect(component.onToggleSheetFacet).toBeDefined();
                });

                it('... should trigger on event from EditionAccoladeComponent', () => {
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    expectedIsSheetFacetMinimized = true;
                    accoladeCmp.toggleSheetFacetRequest.emit(expectedIsSheetFacetMinimized);

                    expectSpyCall(onToggleSheetFacetSpy, 1, [expectedIsSheetFacetMinimized]);
                });

                it('... should toggle `isSheetFacetMinimized` variable', () => {
                    expectToBe(component.isSheetFacetMinimized, false);

                    component.onToggleSheetFacet(true);

                    expectToBe(component.isSheetFacetMinimized, true);

                    component.onToggleSheetFacet(false);

                    expectToBe(component.isSheetFacetMinimized, false);
                });
            });

            describe('#_getDefaultSheetId()', () => {
                it('... should have a method `_getDefaultSheetId`', () => {
                    expect((component as any)._getDefaultSheetId).toBeDefined();
                });

                describe('... should return an empty string if', () => {
                    it('... svgSheetsData is undefined', () => {
                        const mockSvgSheetsData: EditionSvgSheetsList = undefined;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

                        expectToBe(result, '');
                    });

                    it('... textEditions are empty', () => {
                        const mockSvgSheetsData = { sheets: { textEditions: [] } } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

                        expectToBe(result, '');
                    });

                    it('... sketchEditions are empty', () => {
                        const mockSvgSheetsData = { sheets: { sketchEditions: [] } } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

                        expectToBe(result, '');
                    });

                    it('... textEditions and sketchEditions are empty', () => {
                        const mockSvgSheetsData = {
                            sheets: { textEditions: [], sketchEditions: [] },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

                        expectToBe(result, '');
                    });
                });

                describe('... with text editions', () => {
                    it('... should default to text editions when text and sketch editions are present', () => {
                        const mockSheet1 = { id: 'sheet1', content: [] } as EditionSvgSheet;
                        const mockSheet2 = { id: 'sheet2', content: [] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [mockSheet1],
                                sketchEditions: [mockSheet2],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

                        expectToBe(result, mockSheet1.id);
                    });

                    it('... should return the id of the first text edition sheet by default (no partials)', () => {
                        const mockSheet1 = { id: 'sheet1', content: [] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [mockSheet1],
                                sketchEditions: [],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

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
                                sketchEditions: [],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

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
                                sketchEditions: [],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

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
                        const mockSheet3 = { id: 'sheet3', content: [] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                workEditions: [mockSheet1],
                                textEditions: [mockSheet2],
                                sketchEditions: [mockSheet3],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

                        expectToBe(result, 'sheet2c');
                    });
                });

                describe('... without text editions', () => {
                    it('... should return the id of the first sketch sheet by default (no partials)', () => {
                        const mockSheet1 = { id: 'sheet1', content: [] } as EditionSvgSheet;
                        const mockSvgSheetsData = {
                            sheets: {
                                textEditions: [],
                                sketchEditions: [mockSheet1],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

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
                                textEditions: [],
                                sketchEditions: [mockSheet1],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

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
                                textEditions: [],
                                sketchEditions: [mockSheet1, mockSheet2],
                            },
                        } as EditionSvgSheetsList;

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

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
                        const mockSheet2 = { id: 'sheet2', content: [] } as EditionSvgSheet;
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

                        const result = (component as any)._getDefaultSheetId(mockSvgSheetsData);

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
                    expect((component as any)._handleQueryParams).toBeDefined();
                });

                describe('... with svgSheetsData available and id given from query params', () => {
                    it('... should trigger `_selectSvgSheet` with the correct sheet id', () => {
                        const sheetId = 'test-TF1';
                        mockActivatedRoute.testQueryParamMap = { id: sheetId };

                        (component as any)._handleQueryParams(
                            mockActivatedRoute.testQueryParamMap,
                            expectedSvgSheetsData
                        );

                        expectSpyCall(selectSvgSheetSpy, 1, sheetId);
                    });
                });

                describe('... with svgSheetsData available and id not given from query params', () => {
                    it('... should always trigger `onSvgSheetSelect` with the default sheet id', () => {
                        mockActivatedRoute.testQueryParamMap = { id: '' };
                        const defaultSheetId = 'test-TF1a';

                        (component as any)._handleQueryParams(
                            mockActivatedRoute.testQueryParamMap,
                            expectedSvgSheetsData
                        );

                        expectSpyCall(onSvgSheetSelectSpy, 1, {
                            complexId: '',
                            sheetId: defaultSheetId,
                        });
                    });
                });

                describe('... with svgSheetsData not available and id not given from query params', () => {
                    it('... should trigger `onSvgSheetSelect` with no id', () => {
                        mockActivatedRoute.testQueryParamMap = { id: '' };
                        const mockSvgSheetsData: EditionSvgSheetsList = undefined;

                        (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap, mockSvgSheetsData);

                        expectSpyCall(onSvgSheetSelectSpy, 1, {
                            complexId: '',
                            sheetId: '',
                        });
                    });

                    it('... should reset `selectedSvgSheet` to undefined', () => {
                        mockActivatedRoute.testQueryParamMap = { id: '' };
                        const mockSvgSheetsData: EditionSvgSheetsList = undefined;

                        (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap, mockSvgSheetsData);

                        expect(component.selectedSvgSheet).toBeUndefined();
                    });
                });

                it('... should set `isFirstPageLoad` to false after handling query params', () => {
                    component.isFirstPageLoad.set(true);
                    mockActivatedRoute.testQueryParamMap = { id: 'sheetId' };

                    (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap, expectedSvgSheetsData);

                    expectToBe(component.isFirstPageLoad(), false);
                });
            });

            describe('#_selectSvgSheet()', () => {
                it('... should have a method `_selectSvgSheet`', () => {
                    expect((component as any)._selectSvgSheet).toBeDefined();
                });

                describe('... should do nothing if', () => {
                    it('... sheet id is undefined', () => {
                        (component as any)._selectSvgSheet(undefined);

                        expectSpyCall(editionSheetsServiceSelectSvgSheetByIdSpy, 0);
                    });

                    it('... sheet id is null', () => {
                        (component as any)._selectSvgSheet(null);

                        expectSpyCall(editionSheetsServiceSelectSvgSheetByIdSpy, 0);
                    });

                    it('... sheet id is empty string', () => {
                        (component as any)._selectSvgSheet('');

                        expectSpyCall(editionSheetsServiceSelectSvgSheetByIdSpy, 0);
                    });
                });

                describe('... with a valid sheet id', () => {
                    beforeEach(() => {
                        editionSheetsServiceSelectSvgSheetByIdSpy.mockReturnValue(expectedSvgSheet);
                        editionSheetsServiceSelectConvoluteSpy.mockReturnValue(expectedConvolute);
                        editionSheetsServiceFindTextcriticsSpy.mockReturnValue(expectedSelectedTextcritics);
                    });

                    it('... should set correct `selectedSvgSheet`, `selectedConvolute` and `selectedTextcritics`', () => {
                        (component as any)._selectSvgSheet(expectedSvgSheet.id);

                        expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
                        expectToEqual(component.selectedConvolute, expectedConvolute);
                        expectToEqual(component.selectedTextcritics, expectedSelectedTextcritics);
                    });

                    it('... should trigger `onOverlaySelect()` with empty array to clear overlay selections and textcritical comments', () => {
                        expectSpyCall(onOverlaySelectSpy, 0);

                        (component as any)._selectSvgSheet(expectedSvgSheet.id);

                        expectSpyCall(onOverlaySelectSpy, 1, []);
                    });

                    it('... should set correct `selectedTextcriticalCommentary`', () => {
                        (component as any)._selectSvgSheet(expectedSvgSheet.id);

                        expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
                        expectToEqual(component.selectedConvolute, expectedConvolute);
                        expectToEqual(component.selectedTextcritics, expectedSelectedTextcritics);
                        expectToEqual(component.selectedTextcriticalCommentary, expectedSelectedTextcritics.commentary);
                    });
                });
            });
        });
    });
});
