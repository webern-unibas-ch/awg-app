import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { lastValueFrom, Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { ActivatedRouteStub, UrlSegmentStub } from '@testing/router-stubs';

import { LoadingService } from '@awg-app/core/services';
import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgOverlay,
    EditionSvgOverlayTypes,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalCommentary,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import {
    EditionComplexesService,
    EditionDataService,
    EditionSheetsService,
    EditionStateService,
} from '@awg-views/edition-view/services';

import { EditionSheetsComponent } from './edition-sheets.component';

@Component({ selector: 'awg-edition-accolade', template: '' })
class EditionAccoladeStubComponent {
    @Input()
    isFullscreen: boolean;
    @Input()
    svgSheetsData: EditionSvgSheetList;
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
    fullscreenToggleRequest: EventEmitter<boolean> = new EventEmitter();
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectLinkBoxRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-edition-convolute', template: '' })
class EditionConvoluteStubComponent {
    @Input()
    selectedConvolute: FolioConvolute;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-alert-error', template: '' })
class AlertErrorStubComponent {
    @Input()
    errorObject: any;
}

@Component({ selector: 'awg-modal', template: '' })
class ModalStubComponent {
    modalContent: string;
    open(modalContentSnippetKey: string): void {
        this.modalContent = modalContentSnippetKey;
    }
}
@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('EditionSheetsComponent (DONE)', () => {
    let component: EditionSheetsComponent;
    let fixture: ComponentFixture<EditionSheetsComponent>;
    let compDe: DebugElement;

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;
    let expectedRouteUrl: UrlSegmentStub[] = [];
    const expectedPath = 'sheets';

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionSheetsService: Partial<EditionSheetsService>;
    let mockEditionStateService: Partial<EditionStateService>;
    let mockLoadingService: Partial<LoadingService>;

    let editionDataServiceGetEditionSheetsDataSpy: Spy;
    let editionSheetsServiceFindTextcriticsSpy: Spy;
    let editionSheetsServiceGetCurrentEditionTypeSpy: Spy;
    let editionSheetsServiceGetNextSheetIdSpy: Spy;
    let editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy: Spy;
    let editionSheetsServiceSelectSvgSheetByIdSpy: Spy;
    let editionSheetsServiceSelectConvoluteSpy: Spy;
    let editionStateServiceGetSelectedEditionComplexSpy: Spy;
    let getEditionSheetsDataSpy: Spy;
    let navigateWithComplexIdSpy: Spy;
    let navigationSpy: Spy;
    let onBrowseSvgSheetSpy: Spy;
    let onFullscreenToggleSpy: Spy;
    let onLinkBoxSelectSpy: Spy;
    let onReportFragmentNavigateSpy: Spy;
    let onOverlaySelectSpy: Spy;
    let onSvgSheetSelectSpy: Spy;
    let selectSvgSheetSpy: Spy;

    let expectedConvolute: FolioConvolute;
    let expectedIsFullscreen: boolean;
    let expectedEditionComplex: EditionComplex;
    let expectedFolioConvoluteData: FolioConvoluteList;
    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedTextcriticsData: TextcriticsList;
    let expectedSelectedTextcritics: Textcritics;
    let expectedSelectedTextcriticalCommentary: TextcriticalCommentary;
    let expectedEditionComplexBaseRoute: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedReportFragment: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
    });

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        // Router spy object
        mockRouter = {
            url: '/test-url',
            events: observableOf(
                new NavigationEnd(0, 'http://localhost:4200/test-url', 'http://localhost:4200/test-url')
            ),
            navigate: jasmine.createSpy('navigate'),
        };

        // Mocked activated route
        // See https://gist.github.com/benjamincharity/3d25cd2c95b6ecffadb18c3d4dbbd80b
        expectedRouteUrl = [{ path: expectedPath }];

        mockActivatedRoute = new ActivatedRouteStub();
        mockActivatedRoute.testUrl = expectedRouteUrl;

        // Mock services
        mockEditionDataService = {
            getEditionSheetsData: (): Observable<(FolioConvoluteList | EditionSvgSheetList | TextcriticsList)[]> =>
                observableOf([]),
        };
        mockEditionStateService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => observableOf(),
        };
        mockEditionSheetsService = {
            findTextcritics: (): Textcritics => new Textcritics(),
            getCurrentEditionType: (): keyof EditionSvgSheetList['sheets'] | undefined => undefined,
            getNextSheetId: (): string => '',
            filterTextcriticalCommentaryForOverlays: (): TextcriticalCommentary => new TextcriticalCommentary(),
            selectSvgSheetById: (): EditionSvgSheet => new EditionSvgSheet(),
            selectConvolute: (): FolioConvolute | undefined => new FolioConvolute(),
        };
        mockLoadingService = { getLoadingStatus: () => observableOf(false) };

        TestBed.configureTestingModule({
            declarations: [
                CompileHtmlComponent,
                EditionSheetsComponent,
                EditionConvoluteStubComponent,
                EditionAccoladeStubComponent,
                AlertErrorStubComponent,
                ModalStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionSheetsService, useValue: mockEditionSheetsService },
                { provide: EditionStateService, useValue: mockEditionStateService },
                { provide: LoadingService, useValue: mockLoadingService },
                { provide: Router, useValue: mockRouter },
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSheetsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockActivatedRoute.testQueryParamMap = { id: '' };

        // Test data
        expectedIsFullscreen = false;

        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');

        expectedComplexId = 'op12';
        expectedNextComplexId = 'testComplex2';
        expectedEditionComplexBaseRoute = `/edition/complex/${expectedComplexId}/`;
        expectedSheetId = 'M_212_Sk1';
        expectedReportFragment = 'source_A';

        expectedFolioConvoluteData = JSON.parse(JSON.stringify(mockEditionData.mockFolioConvoluteData));
        expectedConvolute = expectedFolioConvoluteData.convolutes[0];

        expectedSvgSheetsData = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheetList));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

        expectedTextcriticsData = JSON.parse(JSON.stringify(mockEditionData.mockTextcriticsData));
        expectedSelectedTextcritics = expectedTextcriticsData.textcritics.at(1);
        expectedSelectedTextcriticalCommentary = expectedSelectedTextcritics.commentary;

        // Spies on service functions
        // Spies on service functions
        editionDataServiceGetEditionSheetsDataSpy = spyOn(
            mockEditionDataService,
            'getEditionSheetsData'
        ).and.returnValue(observableOf([expectedFolioConvoluteData, expectedSvgSheetsData, expectedTextcriticsData]));
        editionStateServiceGetSelectedEditionComplexSpy = spyOn(
            mockEditionStateService,
            'getSelectedEditionComplex'
        ).and.returnValue(observableOf(expectedEditionComplex));
        editionSheetsServiceFindTextcriticsSpy = spyOn(mockEditionSheetsService, 'findTextcritics').and.callThrough();
        editionSheetsServiceGetCurrentEditionTypeSpy = spyOn(
            mockEditionSheetsService,
            'getCurrentEditionType'
        ).and.callThrough();
        editionSheetsServiceGetNextSheetIdSpy = spyOn(mockEditionSheetsService, 'getNextSheetId').and.callThrough();
        editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy = spyOn(
            mockEditionSheetsService,
            'filterTextcriticalCommentaryForOverlays'
        ).and.callThrough();
        editionSheetsServiceSelectConvoluteSpy = spyOn(mockEditionSheetsService, 'selectConvolute').and.returnValue(
            expectedFolioConvoluteData[0]
        );
        editionSheetsServiceSelectSvgSheetByIdSpy = spyOn(
            mockEditionSheetsService,
            'selectSvgSheetById'
        ).and.returnValue(expectedSvgSheet);

        navigationSpy = mockRouter.navigate as jasmine.Spy;

        getEditionSheetsDataSpy = spyOn(component, 'getEditionSheetsData').and.callThrough();
        onBrowseSvgSheetSpy = spyOn(component, 'onBrowseSvgSheet').and.callThrough();
        onFullscreenToggleSpy = spyOn(component, 'onFullscreenToggle').and.callThrough();
        onLinkBoxSelectSpy = spyOn(component, 'onLinkBoxSelect').and.callThrough();
        onOverlaySelectSpy = spyOn(component, 'onOverlaySelect').and.callThrough();
        onReportFragmentNavigateSpy = spyOn(component, 'onReportFragmentNavigate').and.callThrough();
        onSvgSheetSelectSpy = spyOn(component, 'onSvgSheetSelect').and.callThrough();

        navigateWithComplexIdSpy = spyOn(component as any, '_navigateWithComplexId').and.callThrough();
        selectSvgSheetSpy = spyOn(component as any, '_selectSvgSheet').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should have `errorObject` = null', () => {
            expectToBe(component.errorObject, null);
        });

        it('... should have `isFullscreen` = false', () => {
            expectToBe(component.isFullscreen, false);
        });

        it('... should not have `folioConvoluteData`', () => {
            expect(component.folioConvoluteData).toBeUndefined();
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

        it('... should have `showTkA===false`', () => {
            expectToBe(component.showTkA, false);
        });

        it('... should not have `snapshotQueryParamsId`', () => {
            expect(component.snapshotQueryParamsId).toBeUndefined();
        });

        it('... should not have `svgSheetsData`', () => {
            expect(component.svgSheetsData).toBeUndefined();
        });

        it('... should not have `textcriticsData`', () => {
            expect(component.textcriticsData).toBeUndefined();
        });

        it('... should have `_isFirstPageLoad===true`', () => {
            expectToBe((component as any)._isFirstPageLoad, true);
        });

        it('... should have `editionRouteConstants` getter', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have `isLoading$` getter (with value false)', waitForAsync(() => {
            expect(component.isLoading$).toBeDefined();
            expectAsync(lastValueFrom(component.isLoading$)).toBeResolvedTo(false);
        }));

        describe('VIEW', () => {
            it('... should contain a `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ModalStubComponent, 1, 1);
            });

            it('... should not contain an AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should not contain a loading spinner component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should not contain an AccoladeComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 0, 0);
            });

            it('... should not contain a ConvoluteComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionConvoluteStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.editionComplex = expectedEditionComplex;
            component.folioConvoluteData = expectedFolioConvoluteData;
            component.svgSheetsData = expectedSvgSheetsData;
            component.textcriticsData = expectedTextcriticsData;

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

        it('... should have `folioConvoluteData`', () => {
            expectToEqual(component.folioConvoluteData, expectedFolioConvoluteData);
        });

        it('... should have `svgSheetsData`', () => {
            expectToEqual(component.svgSheetsData, expectedSvgSheetsData);
        });

        it('... should have `textcriticsData`', () => {
            expectToEqual(component.textcriticsData, expectedTextcriticsData);
        });

        describe('VIEW', () => {
            describe('on loading', () => {
                it('... should contain 1 TwelveToneSpinnerComponent (stubbed) if isLoading is true', () => {
                    spyOn(mockLoadingService, 'getLoadingStatus').and.returnValue(observableOf(true));
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-sheets-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });
            });

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(waitForAsync(() => {
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionSheetsDataSpy.and.returnValue(
                        observableThrowError(() => expectedError)
                    );

                    component.getEditionSheetsData();
                    detectChangesOnPush(fixture);
                }));

                it('... should not contain sheets view, but one AlertErrorComponent (stubbed)', waitForAsync(() => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-sheets-view', 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                }));

                it('... should pass down error object to AlertErrorComponent', waitForAsync(() => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject, expectedError);
                }));
            });

            it('... should contain one div.awg-sheets-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-sheets-view', 1, 1);
            });

            describe('... AccoladeComponent (stubbed)', () => {
                it('... should contain one AccoladeComponent (stubbed)', () => {
                    getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                });

                it('... should pass down `isFullscreen` to the EditionAccoladeComponent', () => {
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    expectToEqual(accoladeCmp.isFullscreen, expectedIsFullscreen);
                });

                it('... should pass down `svgSheetsData` to the EditionAccoladeComponent', () => {
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    expectToEqual(accoladeCmp.svgSheetsData, expectedSvgSheetsData);
                });

                it('... should pass down `selectedSvgSheet` to the EditionAccoladeComponent', () => {
                    component.selectedSvgSheet = expectedSvgSheet;
                    detectChangesOnPush(fixture);

                    detectChangesOnPush(fixture);
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    expectToEqual(accoladeCmp.selectedSvgSheet, expectedSvgSheet);
                });

                it('... should pass down `selectedTextcritics` to the EditionAccoladeComponent', () => {
                    component.selectedTextcritics = expectedSelectedTextcritics;
                    detectChangesOnPush(fixture);

                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    expectToEqual(accoladeCmp.selectedTextcritics, expectedSelectedTextcritics);
                });

                it('... should pass down `selectedTextcriticalCommentary` to the EditionAccoladeComponent', () => {
                    component.selectedTextcriticalCommentary = expectedSelectedTextcriticalCommentary;
                    detectChangesOnPush(fixture);

                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    expectToEqual(accoladeCmp.selectedTextcriticalCommentary, expectedSelectedTextcriticalCommentary);
                });

                it('... should pass down `showTkA` to the EditionAccoladeComponent', () => {
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
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

                it('... should contain one ConvoluteComponent (stubbed) if convolute is provided', () => {
                    component.selectedConvolute = expectedConvolute;
                    component.selectedSvgSheet = expectedSvgSheet;
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByDirective(compDe, EditionConvoluteStubComponent, 1, 1);
                });

                it('... should pass down `selectedConvolute` to the EditionConvoluteComponent', () => {
                    component.selectedConvolute = expectedConvolute;
                    component.selectedSvgSheet = expectedSvgSheet;
                    detectChangesOnPush(fixture);

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

                it('... should pass down `selectedSvgSheet` to the EditionConvoluteComponent', () => {
                    component.selectedConvolute = expectedConvolute;
                    component.selectedSvgSheet = expectedSvgSheet;
                    detectChangesOnPush(fixture);

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

        describe('#getEditionSheetsData()', () => {
            it('... should have a method `getEditionSheetsData`', () => {
                expect(component.getEditionSheetsData).toBeDefined();
            });

            it('... should have been called', () => {
                expectSpyCall(getEditionSheetsDataSpy, 1);
            });

            it('... should trigger `_fetchEditionComplexData()` with empty object if queryParams are not given', () => {
                mockActivatedRoute.testQueryParamMap = undefined;
                detectChangesOnPush(fixture);

                const handleQueryParamsSpy = spyOn(component as any, '_handleQueryParams').and.callThrough();

                expectSpyCall(handleQueryParamsSpy, 0);

                component.getEditionSheetsData();

                expectSpyCall(handleQueryParamsSpy, 1, mockActivatedRoute.testQueryParamMap);
            });

            it('... should trigger `_fetchEditionComplexData()` with correct parameters if queryParams are given', () => {
                const sheetId = 'test-TF1';
                mockActivatedRoute.testQueryParamMap = { id: sheetId };
                detectChangesOnPush(fixture);

                const handleQueryParamsSpy = spyOn(component as any, '_handleQueryParams').and.callThrough();

                expectSpyCall(handleQueryParamsSpy, 0);

                component.getEditionSheetsData();

                expectSpyCall(handleQueryParamsSpy, 1, mockActivatedRoute.testQueryParamMap);
                expectToBe(component.errorObject, null);
            });

            describe('... should handle errors and set errorObject when', () => {
                it('... when switchMap fails', waitForAsync(() => {
                    const expectedError = { status: 404, statusText: 'error' };
                    spyOn(component as any, '_fetchEditionComplexData').and.returnValue(
                        observableThrowError(() => expectedError)
                    );

                    component.getEditionSheetsData();

                    expectToEqual(component.errorObject, expectedError);
                }));

                it('... fetching edition complex data fails', waitForAsync(() => {
                    const expectedError = { status: 500, statusText: 'Internal Server Error' };
                    editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(
                        observableThrowError(() => expectedError)
                    );

                    component.getEditionSheetsData();

                    expect(component.errorObject).toEqual(expectedError);
                }));

                it('...  fetching edition sheets data fails', waitForAsync(() => {
                    const expectedError = { status: 500, statusText: 'Internal Server Error' };
                    editionDataServiceGetEditionSheetsDataSpy.and.returnValue(
                        observableThrowError(() => expectedError)
                    );

                    component.getEditionSheetsData();

                    expect(component.errorObject).toEqual(expectedError);
                }));
            });
        });

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
                it('... edition type is undefined', () => {
                    component.selectedSvgSheet = expectedSvgSheet;
                    detectChangesOnPush(fixture);

                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    const expectedDirection = 1;
                    editionSheetsServiceGetCurrentEditionTypeSpy.and.returnValue(undefined);

                    component.onBrowseSvgSheet(expectedDirection);

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });
            });

            describe('... should trigger `onSvgSheetSelect()` method with correct sheet id', () => {
                it('... if direction is 1', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    const expectedDirection = 1;
                    const expectedEditionType = 'sketchEditions';

                    editionSheetsServiceGetCurrentEditionTypeSpy.and.returnValue(expectedEditionType);
                    editionSheetsServiceGetNextSheetIdSpy.and.returnValue(expectedNextSvgSheet.id + 'a');

                    component.selectedSvgSheet = expectedSvgSheet;
                    detectChangesOnPush(fixture);

                    component.onBrowseSvgSheet(expectedDirection);

                    expectSpyCall(onSvgSheetSelectSpy, 2, { complexId: '', sheetId: expectedNextSvgSheet.id + 'a' });
                });

                it('... if direction is -1', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    const expectedDirection = -1;
                    const expectedEditionType = 'sketchEditions';

                    editionSheetsServiceGetCurrentEditionTypeSpy.and.returnValue(expectedEditionType);
                    editionSheetsServiceGetNextSheetIdSpy.and.returnValue(expectedSvgSheet.id);

                    component.selectedSvgSheet = expectedNextSvgSheet;
                    detectChangesOnPush(fixture);

                    component.onBrowseSvgSheet(expectedDirection);

                    expectSpyCall(onSvgSheetSelectSpy, 2, { complexId: '', sheetId: expectedSvgSheet.id });
                });
            });
        });

        describe('#onFullscreenToggle()', () => {
            it('... should have a method `onFullscreenToggle`', () => {
                expect(component.onFullscreenToggle).toBeDefined();
            });

            it('... should trigger on event from EditionAccoladeComponent', () => {
                const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                const accoladeCmp = accoladeDes[0].injector.get(
                    EditionAccoladeStubComponent
                ) as EditionAccoladeStubComponent;

                expectedIsFullscreen = true;
                accoladeCmp.fullscreenToggleRequest.emit(expectedIsFullscreen);

                expectSpyCall(onFullscreenToggleSpy, 1, [expectedIsFullscreen]);
            });

            it('... should toggle `isFullscreen` variable', () => {
                expectToBe(component.isFullscreen, false);

                component.onFullscreenToggle(true);

                expectToBe(component.isFullscreen, true);

                component.onFullscreenToggle(false);

                expectToBe(component.isFullscreen, false);
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
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    const expectedLinkBoxId = 'linkBox1';

                    component.selectedSvgSheet = null;
                    detectChangesOnPush(fixture);

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });

                it('... selectedTextcritics.linkBoxes are not defined', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    const expectedLinkBoxId = 'linkBox1';

                    component.selectedSvgSheet = expectedSvgSheet;
                    component.selectedTextcritics = expectedSelectedTextcritics;
                    component.selectedTextcritics.linkBoxes = null;
                    detectChangesOnPush(fixture);

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });

                it('... selectedTextcritics.linkBoxes are empty', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    const expectedLinkBoxId = 'linkBox1';

                    component.selectedSvgSheet = expectedSvgSheet;
                    component.selectedTextcritics = expectedSelectedTextcritics;
                    component.selectedTextcritics.linkBoxes = [];
                    detectChangesOnPush(fixture);

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });

                it('... link box is not found', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    const expectedLinkBoxId = 'linkBox1';

                    component.selectedSvgSheet = expectedSvgSheet;
                    component.selectedTextcritics = expectedSelectedTextcritics;
                    component.selectedTextcritics.linkBoxes = [
                        {
                            svgGroupId: 'unknown-link-box',
                            linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' },
                        },
                    ];

                    detectChangesOnPush(fixture);

                    component.onLinkBoxSelect(expectedLinkBoxId);

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });
            });

            it('... should find correct link box and trigger `_selectSvgSheet()` method with correct parameters', () => {
                expectSpyCall(onSvgSheetSelectSpy, 1);

                const expectedLinkBoxId = 'linkBox1';
                const expectedLinkBox = {
                    svgGroupId: expectedLinkBoxId,
                    linkTo: { complexId: 'test-complex', sheetId: 'test-sheet' },
                };

                component.selectedSvgSheet = expectedSvgSheet;
                component.selectedTextcritics = expectedSelectedTextcritics;
                component.selectedTextcritics.linkBoxes = [expectedLinkBox];

                detectChangesOnPush(fixture);

                component.onLinkBoxSelect(expectedLinkBoxId);

                expectSpyCall(onSvgSheetSelectSpy, 2, expectedLinkBox.linkTo);
            });
        });

        describe('#onOverlaySelect()', () => {
            it('... should have a method `onOverlaySelect`', () => {
                expect(component.onOverlaySelect).toBeDefined();
            });

            it('... should trigger on event from EditionAccoladeComponent', () => {
                component.selectedTextcritics = expectedSelectedTextcritics;
                detectChangesOnPush(fixture);

                const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                const accoladeCmp = accoladeDes[0].injector.get(
                    EditionAccoladeStubComponent
                ) as EditionAccoladeStubComponent;

                const expectedOverlays = [new EditionSvgOverlay(EditionSvgOverlayTypes.tka, 'g1114', true)];

                accoladeCmp.selectOverlaysRequest.emit(expectedOverlays);

                expectSpyCall(onOverlaySelectSpy, 1, [expectedOverlays]);
            });

            it('... should correctly filter textcritical commentary and set `showTka` to true', () => {
                expectedSelectedTextcriticalCommentary.comments.forEach(comment => {
                    comment.blockComments.forEach(blockComment => {
                        const expectedOverlays = [
                            new EditionSvgOverlay(EditionSvgOverlayTypes.tka, blockComment.svgGroupId, true),
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

                        editionSheetsServiceFilterTextcriticalCommentaryForOverlaysSpy.and.returnValue(
                            expectedCommentary
                        );

                        component.selectedTextcritics = expectedSelectedTextcritics;
                        detectChangesOnPush(fixture);

                        component.onOverlaySelect(expectedOverlays);

                        expectToEqual(component.selectedTextcriticalCommentary, expectedCommentary);
                        expectToBe(component.showTkA, true);
                    });
                });
            });
        });

        describe('#onReportFragmentNavigate()', () => {
            it('... should have a method `onReportFragmentNavigate`', () => {
                expect(component.onReportFragmentNavigate).toBeDefined();
            });

            it('... should trigger on event from EditionAccoladeComponent', () => {
                const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                const accoladeCmp = accoladeDes[0].injector.get(
                    EditionAccoladeStubComponent
                ) as EditionAccoladeStubComponent;

                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                accoladeCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                expectSpyCall(onReportFragmentNavigateSpy, 1, expectedReportIds);
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectSpyCall(navigateWithComplexIdSpy, 1);

                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                const expectedNavigationExtras = {
                    fragment: expectedReportIds.fragmentId,
                };

                component.onReportFragmentNavigate(expectedReportIds);
                fixture.detectChanges();

                expectSpyCall(navigateWithComplexIdSpy, 2, [
                    expectedReportIds.complexId,
                    expectedReportRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: undefined };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: null };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: '' };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });
        });

        describe('#onSvgSheetSelect()', () => {
            it('... should have a method `onSvgSheetSelect`', () => {
                expect(component.onSvgSheetSelect).toBeDefined();
            });

            describe('... should trigger on event from', () => {
                it('... EditionAccoladeComponent', () => {
                    const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                    const accoladeCmp = accoladeDes[0].injector.get(
                        EditionAccoladeStubComponent
                    ) as EditionAccoladeStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                    accoladeCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(onSvgSheetSelectSpy, 2, expectedSheetIds);
                });

                xit('... EditionConvoluteComponent', () => {
                    const convoluteDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionConvoluteStubComponent,
                        1,
                        1
                    );
                    const convoluteCmp = convoluteDes[0].injector.get(
                        EditionConvoluteStubComponent
                    ) as EditionConvoluteStubComponent;

                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSheetId };

                    convoluteCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                    expectSpyCall(onSvgSheetSelectSpy, 2, expectedSheetIds);
                });
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectSpyCall(navigateWithComplexIdSpy, 1);

                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedReportFragment };

                const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                const expectedNavigationExtras = {
                    queryParams: { id: expectedSheetIds.sheetId },
                    queryParamsHandling: 'merge',
                };

                component.onSvgSheetSelect(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(navigateWithComplexIdSpy, 2, [
                    expectedSheetIds.complexId,
                    expectedSheetRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                        queryParamsHandling: 'merge',
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: null };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                        queryParamsHandling: 'merge',
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                        queryParamsHandling: 'merge',
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });
        });

        describe('#_assignData()', () => {
            it('... should have a method `_assignData`', () => {
                expect((component as any)._assignData).toBeDefined();
            });

            it('... should assign data from the service to the component', () => {
                component.folioConvoluteData = undefined;
                component.svgSheetsData = undefined;
                component.textcriticsData = undefined;
                detectChangesOnPush(fixture);

                const expectedData = [expectedFolioConvoluteData, expectedSvgSheetsData, expectedTextcriticsData];

                (component as any)._assignData(expectedData);

                expectToEqual(component.folioConvoluteData, expectedFolioConvoluteData);
                expectToEqual(component.svgSheetsData, expectedSvgSheetsData);
                expectToEqual(component.textcriticsData, expectedTextcriticsData);
            });
        });

        describe('#_fetchEditionComplexData()', () => {
            beforeEach(() => {
                const sheetId = 'test-TF1';
                mockActivatedRoute.testQueryParamMap = { id: sheetId };
                detectChangesOnPush(fixture);

                editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(observableOf(expectedEditionComplex));
                editionDataServiceGetEditionSheetsDataSpy.and.returnValue(observableOf(expectedSvgSheetsData));
            });

            it('... should have a method `_fetchEditionComplexData`', () => {
                expect((component as any)._fetchEditionComplexData).toBeDefined();
            });

            it('... should set `editionComplex`', () => {
                (component as any)._fetchEditionComplexData(mockActivatedRoute.testQueryParamMap);

                expectToEqual(component.editionComplex, expectedEditionComplex);
            });

            it('... should trigger `getSelectedEditionComplex` from EditionStateService', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);

                (component as any)._fetchEditionComplexData(mockActivatedRoute.testQueryParamMap);

                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 3);
            });

            it('... should trigger `getEditionSheetsData` from EditionDataService with correct edition complex', () => {
                expectSpyCall(editionDataServiceGetEditionSheetsDataSpy, 2, [expectedEditionComplex]);

                (component as any)._fetchEditionComplexData(mockActivatedRoute.testQueryParamMap).subscribe(() => {
                    expectSpyCall(editionDataServiceGetEditionSheetsDataSpy, 3, [expectedEditionComplex]);
                });
            });

            it('... should trigger `_assignData` with correct parameters', () => {
                const assignDataSpy = spyOn(component as any, '_assignData').and.callThrough();

                expectSpyCall(assignDataSpy, 0);

                (component as any)._fetchEditionComplexData(mockActivatedRoute.testQueryParamMap).subscribe(() => {
                    expectSpyCall(assignDataSpy, 1, [expectedSvgSheetsData]);
                });
            });

            it('... should trigger `_handleQueryParams` with correct parameters', () => {
                const handleQueryParamsSpy = spyOn(component as any, '_handleQueryParams').and.callThrough();

                expectSpyCall(handleQueryParamsSpy, 0);

                (component as any)._fetchEditionComplexData(mockActivatedRoute.testQueryParamMap).subscribe(() => {
                    expectSpyCall(handleQueryParamsSpy, 1, mockActivatedRoute.testQueryParamMap);
                });
            });

            it('... should return svg sheets data', () => {
                (component as any)
                    ._fetchEditionComplexData(mockActivatedRoute.testQueryParamMap)
                    .subscribe((result: EditionSvgSheetList) => {
                        expectToEqual(result, expectedSvgSheetsData);
                    });
            });
        });

        describe('#_getDefaultSheetId()', () => {
            it('... should have a method `_getDefaultSheetId`', () => {
                expect((component as any)._getDefaultSheetId).toBeDefined();
            });

            describe('... should return an empty string if', () => {
                it('... svgSheetsData is undefined', () => {
                    component.svgSheetsData = undefined;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, '');
                });

                it('... textEditions are empty', () => {
                    component.svgSheetsData = { sheets: { textEditions: [] } } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, '');
                });

                it('... sketchEditions are empty', () => {
                    component.svgSheetsData = { sheets: { sketchEditions: [] } } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, '');
                });

                it('... textEditions and sketchEditions are empty', () => {
                    component.svgSheetsData = {
                        sheets: { textEditions: [], sketchEditions: [] },
                    } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, '');
                });
            });

            describe('... with text editions', () => {
                it('... should default to text editions when text and sketch editions are present', () => {
                    const mockSheet1 = { id: 'sheet1', content: [] } as EditionSvgSheet;
                    const mockSheet2 = { id: 'sheet2', content: [] } as EditionSvgSheet;

                    component.svgSheetsData = {
                        sheets: {
                            textEditions: [mockSheet1],
                            sketchEditions: [mockSheet2],
                        },
                    } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, mockSheet1.id);
                });

                it('... should return the id of the first text edition sheet by default (no partials)', () => {
                    const mockSheet1 = { id: 'sheet1', content: [] } as EditionSvgSheet;

                    component.svgSheetsData = {
                        sheets: {
                            textEditions: [mockSheet1],
                            sketchEditions: [],
                        },
                    } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

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
                    component.svgSheetsData = {
                        sheets: {
                            textEditions: [mockSheet1],
                            sketchEditions: [],
                        },
                    } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

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
                    component.svgSheetsData = {
                        sheets: {
                            textEditions: [mockSheet1, mockSheet2],
                            sketchEditions: [],
                        },
                    } as EditionSvgSheetList;

                    const result = (component as any)._getDefaultSheetId();

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
                    component.svgSheetsData = {
                        sheets: {
                            workEditions: [mockSheet1],
                            textEditions: [mockSheet2],
                            sketchEditions: [mockSheet3],
                        },
                    } as EditionSvgSheetList;

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, 'sheet2c');
                });
            });

            describe('... without text editions', () => {
                it('... should return the id of the first sketch sheet by default (no partials)', () => {
                    const mockSheet1 = { id: 'sheet1', content: [] } as EditionSvgSheet;

                    component.svgSheetsData = {
                        sheets: {
                            textEditions: [],
                            sketchEditions: [mockSheet1],
                        },
                    } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

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
                    component.svgSheetsData = {
                        sheets: {
                            textEditions: [],
                            sketchEditions: [mockSheet1],
                        },
                    } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

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
                    component.svgSheetsData = {
                        sheets: {
                            textEditions: [],
                            sketchEditions: [mockSheet1, mockSheet2],
                        },
                    } as EditionSvgSheetList;

                    const result = (component as any)._getDefaultSheetId();

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
                    component.svgSheetsData = {
                        sheets: {
                            workEditions: [mockSheet1, mockSheet2],
                            textEditions: [],
                            sketchEditions: [mockSheet3],
                        },
                    } as EditionSvgSheetList;

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, 'sheet3c');
                });
            });
        });

        describe('#_handleQueryParams()', () => {
            it('... should have a method `_handleQueryParams`', () => {
                expect((component as any)._handleQueryParams).toBeDefined();
            });

            describe('... with svgSheetsData available and id given from query params', () => {
                it('... should trigger `_selectSvgSheet` with the correct sheet id', () => {
                    const sheetId = 'test-TF1';
                    mockActivatedRoute.testQueryParamMap = { id: sheetId };
                    detectChangesOnPush(fixture);

                    (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap);

                    expectSpyCall(selectSvgSheetSpy, 2, sheetId);
                });
            });

            describe('... with svgSheetsData available and id not given from query params', () => {
                it('... should trigger `onSvgSheetSelect` with snapshotQueryParamsId on first page load', () => {
                    mockActivatedRoute.testQueryParamMap = { id: '' };
                    (component as any)._isFirstPageLoad = true;

                    const snapShotSheetId = 'test-TF1a';
                    component.snapshotQueryParamsId = snapShotSheetId;
                    detectChangesOnPush(fixture);

                    (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap);

                    expectSpyCall(onSvgSheetSelectSpy, 3, {
                        complexId: '',
                        sheetId: snapShotSheetId,
                    });
                });

                it('... should trigger `onSvgSheetSelect` with default id on subsequent page loads', () => {
                    mockActivatedRoute.testQueryParamMap = { id: '' };
                    (component as any)._isFirstPageLoad = false;

                    const defaultSheetId = 'test-TF1a';
                    const snapShotSheetId = 'another-test-id';
                    component.snapshotQueryParamsId = snapShotSheetId;
                    detectChangesOnPush(fixture);

                    (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap);

                    expectSpyCall(onSvgSheetSelectSpy, 3, {
                        complexId: '',
                        sheetId: defaultSheetId,
                    });
                });
            });

            describe('... with svgSheetsData not available and id not given from query params', () => {
                it('... should trigger `onSvgSheetSelect` with no id', () => {
                    mockActivatedRoute.testQueryParamMap = { id: '' };
                    (component as any)._isFirstPageLoad = true;

                    component.svgSheetsData = undefined;
                    component.snapshotQueryParamsId = '';
                    detectChangesOnPush(fixture);

                    (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap);

                    expectSpyCall(onSvgSheetSelectSpy, 3, {
                        complexId: '',
                        sheetId: '',
                    });
                });
                it('... should reset selectedSvgSheet to undefined', () => {
                    mockActivatedRoute.testQueryParamMap = { id: '' };
                    (component as any)._isFirstPageLoad = true;

                    component.svgSheetsData = undefined;
                    component.snapshotQueryParamsId = '';
                    detectChangesOnPush(fixture);

                    (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap);

                    expect(component.selectedSvgSheet).toBeUndefined();
                });
            });

            it('... should set _isFirstPageLoad to false after handling query params', () => {
                (component as any)._isFirstPageLoad = true;
                mockActivatedRoute.testQueryParamMap = { id: 'sheetId' };
                detectChangesOnPush(fixture);

                (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap);

                expectToBe((component as any)._isFirstPageLoad, false);
            });
        });

        describe('#_navigateWithComplexId()', () => {
            it('... should have a method `_navigateWithComplexId`', () => {
                expect((component as any)._navigateWithComplexId).toBeDefined();
            });

            describe('... should navigate within same complex if', () => {
                it('... complex id is undefined', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(undefined, expectedTargetRoute, expectedNavigationExtras);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        undefined,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 2, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is null', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(null, expectedTargetRoute, expectedNavigationExtras);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [null, expectedTargetRoute, expectedNavigationExtras]);
                    expectSpyCall(navigationSpy, 2, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is empty string', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId('', expectedTargetRoute, expectedNavigationExtras);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, ['', expectedTargetRoute, expectedNavigationExtras]);
                    expectSpyCall(navigationSpy, 2, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is equal to the current complex id', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(
                        expectedEditionComplex.complexId.route.replace('/', ''),
                        expectedTargetRoute,
                        expectedNavigationExtras
                    );
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedEditionComplex.complexId.route.replace('/', ''),
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 2, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should navigate to another complex if', () => {
                it('... complex id is given and not equal to the current complex id', () => {
                    expectSpyCall(navigateWithComplexIdSpy, 1);

                    const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras
                    );
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 2, [
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 2, [
                        [expectedNextComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... with no edition complex id given', () => {
                describe('... should navigate within same complex to a given report route', () => {
                    it('... with a given report fragment', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given sheet route', () => {
                    it('... with a given sheet id', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });

            describe('... with the current edition complex id given', () => {
                describe('... should navigate within same complex to a given report route', () => {
                    it('... with a given report fragment', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given sheet route', () => {
                    it('... with a given sheet id', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });

            describe('... with another edition complex id given', () => {
                describe('... should navigate to a given report route of another complex', () => {
                    it('... with a given report fragment', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate to a given sheet route of another complex', () => {
                    it('... with a given sheet id', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        expectSpyCall(navigateWithComplexIdSpy, 1);

                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 2, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 2, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });
        });

        describe('#_selectSvgSheet()', () => {
            it('... should have a method `_selectSvgSheet`', () => {
                expect((component as any)._selectSvgSheet).toBeDefined();
            });

            describe('... should do nothing if', () => {
                it('... sheet id is undefined', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    (component as any)._selectSvgSheet(undefined);

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });

                it('... sheet id is null', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    (component as any)._selectSvgSheet(null);

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });

                it('... sheet id is empty string', () => {
                    expectSpyCall(onSvgSheetSelectSpy, 1);

                    (component as any)._selectSvgSheet('');

                    expectSpyCall(onSvgSheetSelectSpy, 1);
                });
            });

            describe('... with a valid sheet id', () => {
                beforeEach(() => {
                    editionSheetsServiceSelectSvgSheetByIdSpy.and.returnValue(expectedSvgSheet);
                    editionSheetsServiceSelectConvoluteSpy.and.returnValue(expectedConvolute);
                    editionSheetsServiceFindTextcriticsSpy.and.returnValue(expectedSelectedTextcritics);
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
