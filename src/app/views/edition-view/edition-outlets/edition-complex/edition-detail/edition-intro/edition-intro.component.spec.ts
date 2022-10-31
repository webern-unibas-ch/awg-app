/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { EmptyError, lastValueFrom, Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EditionSvgSheet, EditionComplex, IntroList } from '@awg-views/edition-view/models';
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
    let expectedEditionIntroData: IntroList;
    let expectedEditionIntroEmptyData: IntroList;
    let expectedModalSnippet: string;
    let expectedFragment: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

    let expectedEditionComplexRoute: string;
    let expectedReportRoute: string;
    let expectedSheetsRoute: string;

    let editionDataServiceGetEditionIntroDataSpy: Spy;
    let getEditionIntroDataSpy: Spy;
    let getEditionComplexSpy: Spy;
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
            imports: [NgbModalModule, RouterTestingModule],
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

        expectedEditionComplex = EDITION_COMPLEXES.OP12;
        expectedFragment = 'sourceA';
        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedEditionIntroData = mockEditionData.mockIntroData;
        expectedEditionIntroEmptyData = mockEditionData.mockIntroEmptyData;
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;

        expectedEditionComplexRoute = '/edition/complex/op12/';
        expectedReportRoute = 'report';
        expectedSheetsRoute = 'sheets';

        // Spies on service functions
        editionDataServiceGetEditionIntroDataSpy = spyOn(editionDataService, 'getEditionIntroData').and.returnValue(
            observableOf(expectedEditionIntroData)
        );
        getEditionComplexSpy = spyOn(editionService, 'getEditionComplex').and.returnValue(
            observableOf(expectedEditionComplex)
        );
        getEditionIntroDataSpy = spyOn(component, 'getEditionIntroData').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
        modalOpenSpy = spyOn(component.modal, 'open').and.callThrough();
        componentOpenModalSpy = spyOn(component, 'openModal').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have editionIntroData$', () => {
            expect(component.editionIntroData$).toBeUndefined();
        });

        it('... should not have editionComplex', () => {
            expect(component.editionComplex).toBeUndefined();
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
            expect(component.editionComplex).toBeDefined();
            expect(component.editionComplex)
                .withContext(`should equal ${expectedEditionComplex}`)
                .toEqual(expectedEditionComplex);
        });

        it('... should have editionIntroData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolved();
            expectAsync(lastValueFrom(component.editionIntroData$))
                .withContext(`should be resolved to ${expectedEditionIntroData}`)
                .toBeResolvedTo(expectedEditionIntroData);
        }));

        describe('VIEW', () => {
            it('... should contain one div.awg-intro-view', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);
            });

            it('... should contain as many p elements in main div as paragraphs in intro data', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-entry',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );
            });

            it('... should have one anchor in first paragraph, and two in the second one', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-intro-entry',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
                getAndExpectDebugElementByCss(pDes[1], 'a', 2, 2);
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
                const pCmp = pDes[0].nativeElement;

                // Create intro placeholder
                const htmlIntroPlaceholder = `[Die Einleitung zum Editionskomplex ${expectedEditionComplex.complexId.full} erscheint im Zusammenhang der vollständigen Edition von ${expectedEditionComplex.complexId.short} in ${expectedEditionComplex.editionRoute.short} ${expectedEditionComplex.series.short}/${expectedEditionComplex.section.short}.]`;
                const htmlIntroPlaceholderText = htmlIntroPlaceholder.replace(/<em>/g, '').replace(/<\/em>/g, '');

                expect(pCmp.textContent).withContext('should be defined').toBeDefined();
                expect(pCmp.textContent.trim())
                    .withContext(`should be ${htmlIntroPlaceholderText}`)
                    .toEqual(htmlIntroPlaceholderText);
            }));
        });

        describe('#getEditionReportData', () => {
            it('... should have been called', () => {
                expectSpyCall(getEditionIntroDataSpy, 1);
            });

            it('... should have got `editionComplex` from editionService', () => {
                expectSpyCall(getEditionComplexSpy, 1);

                expect(component.editionComplex).toBeTruthy();
                expect(component.editionComplex)
                    .withContext(`should equal ${expectedEditionComplex}`)
                    .toEqual(expectedEditionComplex);
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

        describe('#navigateToReportFragment', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchor in first paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);

                // CLick on anchor (with navigateToReportFragment call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
            }));

            it('... should navigate to fragment if given', () => {
                component.navigateToReportFragment(expectedFragment);
                fixture.detectChanges();

                const qp = { fragment: expectedFragment };
                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 1, [[expectedEditionComplexRoute, expectedReportRoute], qp]);

                const otherFragment = 'otherFragment';
                qp.fragment = otherFragment;
                component.navigateToReportFragment(otherFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, otherFragment);
                expectSpyCall(navigationSpy, 2, [[expectedEditionComplexRoute, expectedReportRoute], qp]);
            });

            it('... should navigate without fragment if none is given', () => {
                component.navigateToReportFragment(expectedFragment);
                fixture.detectChanges();

                const qp = { fragment: expectedFragment };
                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 1, [[expectedEditionComplexRoute, expectedReportRoute], qp]);

                const noFragment = '';
                qp.fragment = noFragment;
                component.navigateToReportFragment(noFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, '');
                expectSpyCall(navigationSpy, 2, [[expectedEditionComplexRoute, expectedReportRoute], qp]);
            });
        });

        describe('#openModal', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 2, 2);

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

        describe('#selectSvgSheet', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                // Find anchors in second paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[1], 'a', 2, 2);

                // CLick on anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
            }));

            it('... should navigate to id if given', () => {
                component.selectSvgSheet(expectedSvgSheet.id);
                fixture.detectChanges();

                const qp = {
                    queryParams: { sketch: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };
                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                expectSpyCall(navigationSpy, 1, [[expectedEditionComplexRoute, expectedSheetsRoute], qp]);

                component.selectSvgSheet(expectedNextSvgSheet.id);
                fixture.detectChanges();

                qp.queryParams.sketch = expectedNextSvgSheet.id;
                expectSpyCall(selectSvgSheetSpy, 2, expectedNextSvgSheet.id);
                expectSpyCall(navigationSpy, 2, [[expectedEditionComplexRoute, expectedSheetsRoute], qp]);
            });

            it('... should navigate without id if none is given', () => {
                component.selectSvgSheet(expectedSvgSheet.id);
                fixture.detectChanges();

                const qp = {
                    queryParams: { sketch: expectedSvgSheet.id },
                    queryParamsHandling: '',
                };
                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                expectSpyCall(navigationSpy, 1, [[expectedEditionComplexRoute, expectedSheetsRoute], qp]);

                const noId = '';
                qp.queryParams.sketch = noId;
                component.selectSvgSheet(noId);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, '');
                expectSpyCall(navigationSpy, 2, [[expectedEditionComplexRoute, expectedSheetsRoute], qp]);
            });
        });
    });
});
