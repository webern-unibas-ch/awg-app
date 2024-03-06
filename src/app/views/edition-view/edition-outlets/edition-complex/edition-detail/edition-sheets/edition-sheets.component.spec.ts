/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { expectSpyCall, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgOverlay,
    EditionSvgSheet,
    EditionSvgSheetList,
    FolioConvolute,
    FolioConvoluteList,
    TextcriticalComment,
    Textcritics,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { mockEditionData } from '@testing/mock-data';
import { ActivatedRouteStub, UrlSegmentStub } from '@testing/router-stubs';
import { EditionSheetsComponent } from './edition-sheets.component';

@Component({ selector: 'awg-edition-accolade', template: '' })
class EditionAccoladeStubComponent {
    @Input()
    svgSheetsData: EditionSvgSheetList;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedTextcriticalComments: TextcriticalComment[];
    @Input()
    selectedTextcritics: Textcritics;
    @Input()
    showTkA: boolean;
    @Output()
    browseSvgSheetRequest: EventEmitter<number> = new EventEmitter();
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();
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

describe('EditionSheetsComponent', () => {
    let component: EditionSheetsComponent;
    let fixture: ComponentFixture<EditionSheetsComponent>;
    let compDe: DebugElement;

    let mockRouter;
    let mockActivatedRoute: ActivatedRouteStub;
    let expectedRouteUrl: UrlSegmentStub[] = [];
    const expectedPath = 'sheets';

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionService: Partial<EditionService>;

    let editionDataServiceGetEditionSheetsDataSpy: Spy;
    let getEditionSheetsDataSpy: Spy;
    let getEditionComplexSpy: Spy;
    let navigationSpy: Spy;
    let navigateToReportFragmentSpy: Spy;

    let expectedEditionComplex: EditionComplex;
    let expectedFolioConvoluteData: FolioConvoluteList;
    let expectedSvgSheetsData: EditionSvgSheetList;
    let expectedTextcriticsData: TextcriticsList;
    let expectedEditionComplexBaseRoute: string;
    let expectedComplexId: string;
    let expectedSheetId: string;
    let expectedFragment: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

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
        mockEditionService = {
            getEditionComplex: (): Observable<EditionComplex> => observableOf(),
        };

        TestBed.configureTestingModule({
            imports: [NgbModalModule],
            declarations: [
                CompileHtmlComponent,
                EditionSheetsComponent,
                EditionConvoluteStubComponent,
                EditionAccoladeStubComponent,
                ModalComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService },
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
        expectedEditionComplex = EDITION_COMPLEXES.OP12;
        expectedComplexId = 'op12';
        expectedEditionComplexBaseRoute = `/edition/complex/${expectedComplexId}/`;
        expectedSheetId = 'M_212_Sk1';
        expectedFragment = 'source_A';

        expectedFolioConvoluteData = JSON.parse(JSON.stringify(mockEditionData.mockFolioConvoluteData));
        expectedSvgSheetsData = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheetList));
        expectedTextcriticsData = JSON.parse(JSON.stringify(mockEditionData.mockTextcriticsData));

        // Spies on service functions
        // Spies on service functions
        editionDataServiceGetEditionSheetsDataSpy = spyOn(
            mockEditionDataService,
            'getEditionSheetsData'
        ).and.callThrough();
        getEditionComplexSpy = spyOn(mockEditionService, 'getEditionComplex').and.returnValue(
            observableOf(expectedEditionComplex)
        );
        getEditionSheetsDataSpy = spyOn(component, 'getEditionSheetsData').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'onNavigateToReportFragment').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should not have `errorMessage`', () => {
            expect(component.errorMessage).toBeUndefined();
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

        it('... should not have `selectedTextcriticalComments`', () => {
            expect(component.selectedTextcriticalComments).toBeUndefined();
        });

        it('... should not have `selectedTextcritics`', () => {
            expect(component.selectedTextcritics).toBeUndefined();
        });

        it('... should have `showTkA===false`', () => {
            expect(component.showTkA).toBeFalse();
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
            expect((component as any)._isFirstPageLoad).toBeTrue();
        });

        it('... should have `editionRouteConstants` getter', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
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

        describe('#onNavigateToReportFragment()', () => {
            it('... should have a method `onNavigateToReportFragment`', () => {
                expect(component.onNavigateToReportFragment).toBeDefined();
            });

            xit('... should trigger on event from EditionAccoladeComponent', () => {
                const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                const accoladeCmp = accoladeDes[0].injector.get(
                    EditionAccoladeStubComponent
                ) as EditionAccoladeStubComponent;

                accoladeCmp.navigateToReportFragmentRequest.emit(expectedFragment);

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
            });

            it('... should navigate to fragment if given', () => {
                // Initial navigation
                const qpInit = { queryParams: { id: '' }, queryParamsHandling: 'merge' };
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qpInit,
                ]);

                // Navigate to fragment
                component.onNavigateToReportFragment(expectedFragment);
                fixture.detectChanges();

                const qp = { fragment: expectedFragment };
                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);

                // Navigate to other fragment
                const otherFragment = 'otherFragment';
                qp.fragment = otherFragment;
                component.onNavigateToReportFragment(otherFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, otherFragment);
                expectSpyCall(navigationSpy, 3, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);
            });

            it('... should navigate without fragment if none is given', () => {
                // Initial navigation
                const qpInit = { queryParams: { id: '' }, queryParamsHandling: 'merge' };
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qpInit,
                ]);

                // Navigate to fragment
                component.onNavigateToReportFragment(expectedFragment);
                fixture.detectChanges();

                const qp = { fragment: expectedFragment };
                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);

                // Navigate without fragment
                const noFragment = '';
                qp.fragment = noFragment;
                component.onNavigateToReportFragment(noFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, '');
                expectSpyCall(navigationSpy, 3, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);
            });
        });

        describe('#onSvgSheetSelect()', () => {
            it('... should have a method `onSvgSheetSelect`', () => {
                expect(component.onSvgSheetSelect).toBeDefined();
            });

            xit('... should trigger on event from EditionAccoladeComponent', () => {
                const accoladeDes = getAndExpectDebugElementByDirective(compDe, EditionAccoladeStubComponent, 1, 1);
                const accoladeCmp = accoladeDes[0].injector.get(
                    EditionAccoladeStubComponent
                ) as EditionAccoladeStubComponent;

                accoladeCmp.selectSvgSheetRequest.emit({ complexId: expectedComplexId, sheetId: expectedSheetId });

                expectSpyCall(getEditionSheetsDataSpy, 1, expectedEditionComplex);
            });

            it('... should navigate to current complex if only sheet is given', () => {
                // Initial navigation
                const qpInit = { queryParams: { id: '' }, queryParamsHandling: 'merge' };
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qpInit,
                ]);

                // Navigate to sheet without complex
                component.onSvgSheetSelect({ complexId: '', sheetId: expectedSheetId });
                fixture.detectChanges();

                const qp = { queryParams: { id: expectedSheetId }, queryParamsHandling: 'merge' };
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qp,
                ]);
            });

            it('... should navigate to complex and sheet if given', () => {
                // Initial navigation
                const qpInit = { queryParams: { id: '' }, queryParamsHandling: 'merge' };
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qpInit,
                ]);

                // Navigate to sheet with complex
                const otherComplexId = 'otherId';
                const otherComplexBaseRoute = `/edition/complex/${otherComplexId}/`;
                component.onSvgSheetSelect({ complexId: otherComplexId, sheetId: expectedSheetId });
                fixture.detectChanges();

                const qp = { queryParams: { id: expectedSheetId }, queryParamsHandling: 'merge' };
                expectSpyCall(navigationSpy, 2, [
                    [otherComplexBaseRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qp,
                ]);
            });
        });
    });
});
