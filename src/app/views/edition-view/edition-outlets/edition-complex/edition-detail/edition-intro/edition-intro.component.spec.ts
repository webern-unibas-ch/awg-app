/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { EmptyError, lastValueFrom, Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionSvgSheet, IntroList } from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionIntroComponent } from './edition-intro.component';

// Mock components
@Component({ selector: 'awg-modal', template: '' })
class ModalStubComponent {
    open(modalContentSnippetKey: string): void {}
}

describe('IntroComponent (DONE)', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;
    let compDe: DebugElement;

    let mockRouter;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionService: Partial<EditionService>;
    let editionDataService: Partial<EditionDataService>;
    let editionService: Partial<EditionService>;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionComplexBaseRoute: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedEditionIntroData: IntroList;
    let expectedEditionIntroEmptyData: IntroList;
    let expectedIntroFragment: string;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    let editionDataServiceGetEditionIntroDataSpy: Spy;
    let getEditionIntroDataSpy: Spy;
    let getEditionComplexSpy: Spy;
    let navigateToFragmentSpy: Spy;
    let navigateToIntroFragmentSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigationSpy: Spy;
    let modalOpenSpy: Spy;
    let componentOpenModalSpy: Spy;
    let selectSvgSheetSpy: Spy;

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mock services
        mockEditionDataService = {
            getEditionIntroData: (editionComplex: EditionComplex): Observable<IntroList> =>
                observableOf(expectedEditionIntroData),
        };
        mockEditionService = {
            getEditionComplex: (): Observable<EditionComplex> => observableOf(expectedEditionComplex),
        };

        TestBed.configureTestingModule({
            imports: [NgbModalModule, RouterModule],
            declarations: [CompileHtmlComponent, EditionIntroComponent, ModalStubComponent, RouterLinkStubDirective],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionIntroComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services from root
        editionDataService = TestBed.inject(EditionDataService);
        editionService = TestBed.inject(EditionService);

        // Test data
        expectedEditionComplex = EDITION_COMPLEXES.OP12;
        expectedEditionComplexBaseRoute = '/edition/complex/op12/';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedIntroFragment = 'footnote-80';
        expectedReportFragment = 'source_A';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedEditionIntroData = JSON.parse(JSON.stringify(mockEditionData.mockIntroData));
        expectedEditionIntroEmptyData = JSON.parse(JSON.stringify(mockEditionData.mockIntroEmptyData));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

        // Spies on functions
        editionDataServiceGetEditionIntroDataSpy = spyOn(editionDataService, 'getEditionIntroData').and.returnValue(
            observableOf(expectedEditionIntroData)
        );
        getEditionComplexSpy = spyOn(editionService, 'getEditionComplex').and.returnValue(
            observableOf(expectedEditionComplex)
        );
        getEditionIntroDataSpy = spyOn(component, 'getEditionIntroData').and.callThrough();
        navigateToIntroFragmentSpy = spyOn(component, 'navigateToIntroFragment').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToFragmentSpy = spyOn(component as any, '_navigateToFragment').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
        modalOpenSpy = spyOn(component.modal, 'open').and.callThrough();
        componentOpenModalSpy = spyOn(component, 'openModal').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionIntroData$`', () => {
            expect(component.editionIntroData$).toBeUndefined();
        });

        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain one modal component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ModalStubComponent, 1, 1);
            });

            it('... should contain no div.awg-intro-view yet', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 0, 0);
            });

            it('... should contain no div.errorMessage yet', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.errorMessage', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionIntroData$ = observableOf(expectedEditionIntroData);
            component.editionComplex = expectedEditionComplex;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionComplex()`', () => {
            // `getEditionReportData()` called immediately after init
            expectSpyCall(getEditionComplexSpy, 1);
        });

        it('... should have called `getEditionIntroData()`', () => {
            // `getEditionIntroData()` called immediately after init
            expectSpyCall(getEditionIntroDataSpy, 1);
        });

        it('... should have editionComplex', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
        });

        it('... should have editionIntroData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolved();
            expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolvedTo(expectedEditionIntroData);
        }));

        describe('VIEW', () => {
            it('... should contain one div.awg-intro-view', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);
            });

            it('... should contain as many intro paragraph elements in div.awg-intro-view as content items in intro data', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-paragraph',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );
            });

            it('... should have one anchor in first paragraph, and 3 in the second one', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-paragraph',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
                getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);
            });

            it('... should contain as many footnote paragraphs in div.awg-intro-view as footnote items in intro data', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-footnote',
                    expectedEditionIntroData.intro[0].footnotes.length,
                    expectedEditionIntroData.intro[0].footnotes.length
                );
            });

            it('... should have each footnote paragraph embedded in small element', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'small p.awg-intro-footnote',
                    expectedEditionIntroData.intro[0].footnotes.length,
                    expectedEditionIntroData.intro[0].footnotes.length
                );
            });

            it('... should have one anchor in footnote paragraph', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-footnote',
                    expectedEditionIntroData.intro[0].footnotes.length,
                    expectedEditionIntroData.intro[0].footnotes.length
                );

                getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
            });

            it('... should contain one horizontal line and header for footnotes ', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'hr', 1, 1);
                const headerDe = getAndExpectDebugElementByCss(divDes[0], 'h5', 1, 1);
                const headerEl = headerDe[0].nativeElement;

                expectToBe(headerEl.textContent.trim(), 'Anmerkungen');
            });

            it('... should contain a placeholder if content of intro data is empty', waitForAsync(() => {
                // Simulate the parent setting an empty content array
                component.editionIntroData$ = observableOf(expectedEditionIntroEmptyData);
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-intro-empty', 1, 1);

                getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
            }));

            it('... should display placeholder in paragraph', waitForAsync(() => {
                // Simulate the parent setting an empty content array
                component.editionIntroData$ = observableOf(expectedEditionIntroEmptyData);
                detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view > p.awg-intro-empty', 1, 1);
                const pEl = pDes[0].nativeElement;

                // Create intro placeholder
                const introPlaceholder = `[Die Einleitung zum Editionskomplex ${expectedEditionComplex.complexId.full} erscheint im Zusammenhang der vollständigen Edition von ${expectedEditionComplex.complexId.short} in ${expectedEditionRouteConstants.EDITION.short} ${expectedEditionComplex.series.short}/${expectedEditionComplex.section.short}.]`;
                const strippedIntroPlaceholder = introPlaceholder.replace(/<em>/g, '').replace(/<\/em>/g, '');

                expectToBe(pEl.textContent.trim(), strippedIntroPlaceholder);
            }));
        });

        describe('#getEditionIntroData()', () => {
            it('... should have a method `getEditionIntroData`', () => {
                expect(component.getEditionIntroData).toBeDefined();
            });

            it('... should have been called', () => {
                expectSpyCall(getEditionIntroDataSpy, 1);
            });

            it('... should have got `editionComplex` from editionService', () => {
                expectSpyCall(getEditionComplexSpy, 1);

                expectToEqual(component.editionComplex, expectedEditionComplex);
            });

            it('... should have got editionIntroData from editionDataService', () => {
                expectSpyCall(editionDataServiceGetEditionIntroDataSpy, 1);
            });

            it('... should return empty observable and set errorObject if switchMap fails', waitForAsync(() => {
                const expectedError = { status: 404, statusText: 'error' };
                // Spy on editionDataService to return an error
                editionDataServiceGetEditionIntroDataSpy.and.returnValue(observableThrowError(() => expectedError));

                // Init new switchMap
                component.getEditionIntroData();
                fixture.detectChanges();

                expectAsync(lastValueFrom(component.editionIntroData$)).toBeRejected();
                expectAsync(lastValueFrom(component.editionIntroData$)).toBeRejectedWithError(EmptyError);

                expect(component.errorObject).toEqual(expectedError);
            }));
        });

        describe('#navigateToIntroFragment()', () => {
            it('... should have a method `navigateToIntroFragment`', () => {
                expect(component.navigateToIntroFragment).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-paragraph',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchor in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // CLick on anchor (with navigateToIntroFragment call)
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(navigateToIntroFragmentSpy, 1, expectedIntroFragment);
            }));

            it('... should trigger `_navigateToFragment()` method with correct parameters', () => {
                component.navigateToIntroFragment(expectedIntroFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToFragmentSpy, 1, [
                    expectedEditionRouteConstants.EDITION_INTRO.route,
                    expectedIntroFragment,
                ]);
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-paragraph',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchor in first paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);

                // CLick on anchor (with navigateToReportFragment call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportFragment);
            }));

            it('... should trigger `_navigateToFragment()` method with correct parameters', () => {
                component.navigateToReportFragment(expectedReportFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToFragmentSpy, 1, [
                    expectedEditionRouteConstants.EDITION_REPORT.route,
                    expectedReportFragment,
                ]);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-paragraph',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // CLick on anchor (with openModal call)
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(componentOpenModalSpy, 1, expectedModalSnippet);
            }));

            it('... should open modal with given id', () => {
                component.openModal(expectedModalSnippet);
                fixture.detectChanges();

                expectSpyCall(componentOpenModalSpy, 1, expectedModalSnippet);
                expectSpyCall(modalOpenSpy, 1, expectedModalSnippet);

                const otherSnippet = 'otherSnippet';
                component.openModal(otherSnippet);
                fixture.detectChanges();

                expectSpyCall(componentOpenModalSpy, 2, otherSnippet);
                expectSpyCall(modalOpenSpy, 2, otherSnippet);
            });

            describe('... should not do anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(componentOpenModalSpy, 1);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(null);

                    expectSpyCall(componentOpenModalSpy, 1);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(componentOpenModalSpy, 1);
                    expectSpyCall(modalOpenSpy, 0);
                });
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-paragraph',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);

                // CLick on anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, [expectedComplexId, expectedSvgSheet.id]);
            }));

            it('... should navigate within same complex to sheet id if given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };

                component.selectSvgSheet(expectedComplexId, expectedSvgSheet.id);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, [expectedComplexId, expectedSvgSheet.id]);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                qp.queryParams.id = expectedNextSvgSheet.id;

                component.selectSvgSheet(expectedComplexId, expectedNextSvgSheet.id);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, [expectedComplexId, expectedNextSvgSheet.id]);
                expectSpyCall(navigationSpy, 2, [expectedSheetRoute, qp]);
            });

            it('... should navigate within same complex without sheet id if none is given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };

                component.selectSvgSheet(expectedComplexId, expectedSvgSheet.id);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, [expectedComplexId, expectedSvgSheet.id]);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                const noSheetId = undefined;
                qp.queryParams.id = '';

                component.selectSvgSheet(expectedComplexId, noSheetId);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, [expectedComplexId, noSheetId]);
                expectSpyCall(navigationSpy, 2, [expectedSheetRoute, qp]);
            });

            it('... should navigate within same complex by default if no complex id is given', () => {
                const noComplexId = '';
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };

                component.selectSvgSheet(noComplexId, expectedSvgSheet.id);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, [noComplexId, expectedSvgSheet.id]);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);
            });

            it('... should navigate to another complex with sheet id if given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };

                component.selectSvgSheet(expectedComplexId, expectedSvgSheet.id);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, [expectedComplexId, expectedSvgSheet.id]);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                const expectedNextSheetRoute = [
                    `/edition/complex/${expectedNextComplexId}/`,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                qp.queryParams.id = expectedNextSvgSheet.id;

                component.selectSvgSheet(expectedNextComplexId, expectedNextSvgSheet.id);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, [expectedNextComplexId, expectedNextSvgSheet.id]);
                expectSpyCall(navigationSpy, 2, [expectedNextSheetRoute, qp]);
            });

            it('... should navigate to another complex without sheet id if none is given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };

                component.selectSvgSheet(expectedComplexId, expectedSvgSheet.id);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, [expectedComplexId, expectedSvgSheet.id]);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                const noSheetId = undefined;
                qp.queryParams.id = '';
                const expectedNextSheetRoute = [
                    `/edition/complex/${expectedNextComplexId}/`,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];

                component.selectSvgSheet(expectedNextComplexId, noSheetId);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, [expectedNextComplexId, noSheetId]);
                expectSpyCall(navigationSpy, 2, [expectedNextSheetRoute, qp]);
            });
        });

        describe('#_navigateToFragment()', () => {
            it('... should have a method `_navigateToFragment`', () => {
                expect((component as any)._navigateToFragment).toBeDefined();
            });

            it('... should navigate to a given intro route with the given intro fragment', () => {
                (component as any)._navigateToFragment(
                    expectedEditionRouteConstants.EDITION_INTRO.route,
                    expectedIntroFragment
                );
                fixture.detectChanges();

                const qp = { fragment: expectedIntroFragment };
                expectSpyCall(navigateToFragmentSpy, 1, [
                    expectedEditionRouteConstants.EDITION_INTRO.route,
                    expectedIntroFragment,
                ]);
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_INTRO.route],
                    qp,
                ]);
            });

            it('... should navigate to a given report route with the given report fragment', () => {
                (component as any)._navigateToFragment(
                    expectedEditionRouteConstants.EDITION_REPORT.route,
                    expectedReportFragment
                );
                fixture.detectChanges();

                const qp = { fragment: expectedReportFragment };
                expectSpyCall(navigateToFragmentSpy, 1, [
                    expectedEditionRouteConstants.EDITION_REPORT.route,
                    expectedReportFragment,
                ]);
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);
            });

            it('... should navigate to a given route without fragmentId if none is given', () => {
                const otherRoute = 'otherRoute';
                const noFragment = '';
                (component as any)._navigateToFragment(otherRoute, noFragment);
                fixture.detectChanges();

                const qp = { fragment: noFragment };
                expectSpyCall(navigateToFragmentSpy, 1, [otherRoute, noFragment]);
                expectSpyCall(navigationSpy, 1, [[expectedEditionComplexBaseRoute, otherRoute], qp]);
            });
        });
    });
});
