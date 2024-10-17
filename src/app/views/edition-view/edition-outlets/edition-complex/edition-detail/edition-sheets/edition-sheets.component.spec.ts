/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonPipe } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { ActivatedRouteStub, UrlSegmentStub } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalCommentBlock,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import {
    EditionComplexesService,
    EditionDataService,
    EditionSheetsService,
    EditionStateService,
} from '@awg-views/edition-view/services';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionSheetsComponent } from './edition-sheets.component';

@Component({ selector: 'awg-edition-accolade', template: '' })
class EditionAccoladeStubComponent {
    @Input()
    svgSheetsData: EditionSvgSheetList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedTextcriticalCommentBlocks: TextcriticalCommentBlock[];
    @Input()
    selectedTextcritics: Textcritics;
    @Input()
    showTkA: boolean;
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();
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

@Component({ selector: 'awg-error-alert', template: '' })
class ErrorAlertStubComponent {
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

describe('EditionSheetsComponent', () => {
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

    let editionDataServiceGetEditionSheetsDataSpy: Spy;
    let editionSheetsServiceSelectSvgSheetByIdSpy: Spy;
    let editionSheetsServiceSelectConvoluteSpy: Spy;
    let editionStateServiceGetSelectedEditionComplexSpy: Spy;
    let getEditionSheetsDataSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateWithComplexIdSpy: Spy;
    let navigationSpy: Spy;
    let onSvgSheetSelectSpy: Spy;
    let selectSvgSheetSpy: Spy;

    let expectedEditionComplex: EditionComplex;
    let expectedFolioConvoluteData: FolioConvoluteList;
    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedTextcriticsData: TextcriticsList;
    let expectedEditionComplexBaseRoute: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSheetId: string;
    let expectedReportFragment: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    const jsonPipe = new JsonPipe();

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
            getEditionSheetsData: (
                editionComplex: EditionComplex
            ): Observable<(FolioConvoluteList | EditionSvgSheetList | TextcriticsList)[]> => observableOf([]),
        };
        mockEditionStateService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => observableOf(),
        };
        mockEditionSheetsService = {
            selectSvgSheetById: (sheets: EditionSvgSheetList['sheets'], id: string): EditionSvgSheet =>
                new EditionSvgSheet(),
            selectConvolute: (
                convolutes: FolioConvolute[],
                sheets: EditionSvgSheetList['sheets'],
                selectedSheet: EditionSvgSheet
            ): FolioConvolute | undefined => new FolioConvolute(),
        };

        TestBed.configureTestingModule({
            declarations: [
                CompileHtmlComponent,
                EditionSheetsComponent,
                EditionConvoluteStubComponent,
                EditionAccoladeStubComponent,
                ErrorAlertStubComponent,
                ModalStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionStateService, useValue: mockEditionStateService },
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
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedComplexId = 'op12';
        expectedNextComplexId = 'testComplex2';
        expectedEditionComplexBaseRoute = `/edition/complex/${expectedComplexId}/`;
        expectedSheetId = 'M_212_Sk1';
        expectedReportFragment = 'source_A';

        expectedFolioConvoluteData = JSON.parse(JSON.stringify(mockEditionData.mockFolioConvoluteData));
        expectedSvgSheetsData = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheetList));
        expectedTextcriticsData = JSON.parse(JSON.stringify(mockEditionData.mockTextcriticsData));

        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

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
        editionSheetsServiceSelectSvgSheetByIdSpy = spyOn(
            mockEditionSheetsService,
            'selectSvgSheetById'
        ).and.returnValue(expectedSvgSheet);
        editionSheetsServiceSelectConvoluteSpy = spyOn(mockEditionSheetsService, 'selectConvolute').and.returnValue(
            expectedFolioConvoluteData[0]
        );

        navigationSpy = mockRouter.navigate as jasmine.Spy;

        getEditionSheetsDataSpy = spyOn(component, 'getEditionSheetsData').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'onReportFragmentNavigate').and.callThrough();
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

        it('... should have `isLoading===true`', () => {
            expectToBe(component.isLoading, true);
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

        it('... should not have `selectedTextcriticalCommentBlocks`', () => {
            expect(component.selectedTextcriticalCommentBlocks).toBeUndefined();
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

        describe('VIEW', () => {
            it('... should contain a `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ModalStubComponent, 1, 1);
            });

            it('... should not contain an error alert component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ErrorAlertStubComponent, 0, 0);
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

        describe('VIEW', () => {
            it('... should contain one div.awg-sheets-view', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-sheets-view', 1, 1);
            });

            it('... should contain one AccoladeComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
            });

            it('... should contain no ConvoluteComponent (stubbed) if no convolute is provided', () => {
                getAndExpectDebugElementByDirective(compDe, EditionConvoluteStubComponent, 0, 0);
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

                it('... should not contain sheets view, but one ErrorAlertComponent (stubbed)', waitForAsync(() => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-sheets-view', 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], ErrorAlertStubComponent, 1, 1);
                }));

                it('... should pass down error object to ErrorAlertComponent', waitForAsync(() => {
                    const errorAlertDes = getAndExpectDebugElementByDirective(compDe, ErrorAlertStubComponent, 1, 1);
                    const errorAlertCmp = errorAlertDes[0].injector.get(
                        ErrorAlertStubComponent
                    ) as ErrorAlertStubComponent;

                    expectToEqual(errorAlertCmp.errorObject, expectedError);
                }));
            });

            describe('on loading', () => {
                describe('... should contain only TwelveToneSpinnerComponent (stubbed) if ... ', () => {
                    it('... isLoading is true', () => {
                        component.isLoading = true;
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-sheets-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, ErrorAlertStubComponent, 0, 0);

                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
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

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
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

        describe('#_getDefaultSheetId()', () => {
            it('... should have a method `_getDefaultSheetId`', () => {
                expect((component as any)._getDefaultSheetId).toBeDefined();
            });

            describe('... should return an empty string if', () => {
                it('... should return an empty string if svgSheetsData is undefined', () => {
                    component.svgSheetsData = undefined;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, '');
                });

                it('... should return an empty string if svgSheetsData.sheets.sketchEditions is an empty array', () => {
                    component.svgSheetsData = { sheets: { sketchEditions: [] } } as EditionSvgSheetList;
                    detectChangesOnPush(fixture);

                    const result = (component as any)._getDefaultSheetId();

                    expectToBe(result, '');
                });
            });

            it('... should return the id of the first sketch sheet by default (no partials)', () => {
                const mockSheet1 = { id: 'sheet1', content: [] } as EditionSvgSheet;

                component.svgSheetsData = {
                    sheets: { sketchEditions: [mockSheet1] },
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
                    sheets: { sketchEditions: [mockSheet1] },
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
                    sheets: { sketchEditions: [mockSheet1, mockSheet2] },
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
                        workEditions: [mockSheet1],
                        textEditions: [mockSheet2],
                        sketchEditions: [mockSheet3],
                    },
                } as EditionSvgSheetList;

                const result = (component as any)._getDefaultSheetId();

                expectToBe(result, 'sheet3c');
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

                    const snapShotSheetId = 'test-TF1';
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

                    const defaultSheetId = 'test-1';
                    const snapShotSheetId = 'test-TF1';
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

            it('... should set _isFirstPageLoad and isLoading to false after handling query params', () => {
                component.isLoading = true;
                (component as any)._isFirstPageLoad = true;
                mockActivatedRoute.testQueryParamMap = { id: 'sheetId' };
                detectChangesOnPush(fixture);

                (component as any)._handleQueryParams(mockActivatedRoute.testQueryParamMap);

                expectToBe((component as any)._isFirstPageLoad, false);
                expectToBe(component.isLoading, false);
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
    });
});
