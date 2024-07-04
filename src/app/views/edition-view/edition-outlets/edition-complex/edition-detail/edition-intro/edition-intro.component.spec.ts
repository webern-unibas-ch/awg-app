/* eslint-disable @typescript-eslint/no-unused-vars */
import { DOCUMENT } from '@angular/common';
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

    let mockDocument: Document;
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
    let navigateWithComplexIdSpy: Spy;
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

        mockDocument = TestBed.inject(DOCUMENT);

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
        navigateWithComplexIdSpy = spyOn(component as any, '_navigateWithComplexId').and.callThrough();
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
                const fullComplexSpan = mockDocument.createElement('span');
                fullComplexSpan.innerHTML = expectedEditionComplex.complexId.full;

                const shortComplexSpan = mockDocument.createElement('span');
                shortComplexSpan.innerHTML = expectedEditionComplex.complexId.short;

                const introPlaceholder = `[Die Einleitung zum Editionskomplex ${fullComplexSpan.textContent} erscheint im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${expectedEditionRouteConstants.EDITION.short} ${expectedEditionComplex.series.short}/${expectedEditionComplex.section.short}.]`;

                expectToBe(pEl.textContent.trim(), introPlaceholder);
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

                expectToEqual(component.errorObject, expectedError);
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

                expectSpyCall(navigateToIntroFragmentSpy, 1, {
                    complexId: expectedComplexId,
                    fragmentId: expectedIntroFragment,
                });
            }));

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedIntroIds = { complexId: expectedComplexId, fragmentId: expectedIntroFragment };

                const expectedIntroRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                const expectedNavigationExtras = {
                    fragment: expectedIntroIds.fragmentId,
                };

                component.navigateToIntroFragment(expectedIntroIds);
                fixture.detectChanges();

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedIntroIds.complexId,
                    expectedIntroRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: undefined };

                    const expectedIntroRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToIntroFragment(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedIntroIds.complexId,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: null };

                    const expectedIntroRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToIntroFragment(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedIntroIds.complexId,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: '' };

                    const expectedIntroRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToIntroFragment(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedIntroIds.complexId,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                it('... introIds are undefined', () => {
                    const expectedIntroIds = undefined;

                    const expectedIntroRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToIntroFragment(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... introIds are null', () => {
                    const expectedIntroIds = null;

                    const expectedIntroRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToIntroFragment(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: '' };

                    const expectedIntroRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToIntroFragment(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedIntroIds.complexId,
                        expectedIntroRoute,
                        expectedNavigationExtras,
                    ]);
                });
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

                expectSpyCall(navigateToReportFragmentSpy, 1, {
                    complexId: expectedComplexId,
                    fragmentId: expectedReportFragment,
                });
            }));

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                const expectedNavigationExtras = {
                    fragment: expectedReportIds.fragmentId,
                };

                component.navigateToReportFragment(expectedReportIds);
                fixture.detectChanges();

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedReportIds.complexId,
                    expectedReportRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: undefined };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToReportFragment(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: null };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToReportFragment(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: '' };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToReportFragment(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                it('... introIds are undefined', () => {
                    const expectedReportIds = undefined;

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToReportFragment(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... introIds are null', () => {
                    const expectedReportIds = null;

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToReportFragment(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: '' };

                    const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.navigateToReportFragment(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });
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

                expectSpyCall(selectSvgSheetSpy, 1, { complexId: expectedComplexId, sheetId: expectedSvgSheet.id });
            }));

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedReportFragment };

                const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                const expectedNavigationExtras = {
                    queryParams: { id: expectedSheetIds.sheetId },
                };

                component.selectSvgSheet(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(navigateWithComplexIdSpy, 1, [
                    expectedSheetIds.complexId,
                    expectedSheetRoute,
                    expectedNavigationExtras,
                ]);
            });

            describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.selectSvgSheet(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is null', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: null };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.selectSvgSheet(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.selectSvgSheet(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                it('... introIds are undefined', () => {
                    const expectedSheetIds = undefined;

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.selectSvgSheet(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... introIds are null', () => {
                    const expectedSheetIds = null;

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.selectSvgSheet(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };

                    const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: '' },
                    };

                    component.selectSvgSheet(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });
        });

        describe('#_navigateWithComplexId()', () => {
            it('... should have a method `_navigateWithComplexId`', () => {
                expect((component as any)._navigateWithComplexId).toBeDefined();
            });

            describe('... should navigate within same complex if', () => {
                it('... complex id is undefined', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(undefined, expectedTargetRoute, expectedNavigationExtras);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        undefined,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is null', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(null, expectedTargetRoute, expectedNavigationExtras);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [null, expectedTargetRoute, expectedNavigationExtras]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is empty string', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId('', expectedTargetRoute, expectedNavigationExtras);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, ['', expectedTargetRoute, expectedNavigationExtras]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });

                it('... complex id is equal to the current complex id', () => {
                    const expectedComplexRoute = expectedEditionComplexBaseRoute;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(
                        expectedEditionComplex.complexId.route.replace('/', ''),
                        expectedTargetRoute,
                        expectedNavigationExtras
                    );
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedEditionComplex.complexId.route.replace('/', ''),
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... should navigate to another complex if', () => {
                it('... complex id is given and not equal to the current complex id', () => {
                    const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                    const expectedTargetRoute = 'targetRoute';
                    const expectedNavigationExtras = { fragment: '' };

                    (component as any)._navigateWithComplexId(
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras
                    );
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedNextComplexId,
                        expectedTargetRoute,
                        expectedNavigationExtras,
                    ]);
                    expectSpyCall(navigationSpy, 1, [
                        [expectedNextComplexRoute, expectedTargetRoute],
                        expectedNavigationExtras,
                    ]);
                });
            });

            describe('... with no edition complex id given', () => {
                describe('... should navigate within same complex to a given intro route', () => {
                    it('... with a given intro fragment', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                        const expectedNavigationExtras = { fragment: expectedIntroFragment };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given intro fragment', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given report route', () => {
                    it('... with a given report fragment', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given sheet route', () => {
                    it('... with a given sheet id', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });

            describe('... with the current edition complex id given', () => {
                describe('... should navigate within same complex to a given intro route', () => {
                    it('... with a given intro fragment', () => {
                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                        const expectedNavigationExtras = { fragment: expectedIntroFragment };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given intro fragment', () => {
                        expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                        const expectedComplexRoute = expectedEditionComplexBaseRoute;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given report route', () => {
                    it('... with a given report fragment', () => {
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

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
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

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate within same complex to a given sheet route', () => {
                    it('... with a given sheet id', () => {
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

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
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

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });

            describe('... with another edition complex id given', () => {
                describe('... should navigate to a given intro route of another complex', () => {
                    it('... with a given intro fragment', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                        const expectedNavigationExtras = { fragment: expectedIntroFragment };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given intro fragment', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_INTRO.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate to a given report route of another complex', () => {
                    it('... with a given report fragment', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: expectedReportFragment };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given report fragment', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should navigate to a given sheet route of another complex', () => {
                    it('... with a given sheet id', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... without a given sheet id', () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}/`;
                        const expectedTargetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                        const expectedNavigationExtras = { queryParams: { id: '' } };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        fixture.detectChanges();

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedNextComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });
                });
            });
        });
    });
});
