/* eslint-disable @typescript-eslint/no-unused-vars */
import { DOCUMENT, JsonPipe } from '@angular/common';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import {
    EMPTY,
    EmptyError,
    lastValueFrom,
    Observable,
    of as observableOf,
    throwError as observableThrowError,
    ReplaySubject,
} from 'rxjs';
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
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionOutlineSection,
    EditionOutlineSeries,
    EditionSvgSheet,
    IntroList,
} from '@awg-views/edition-view/models';
import {
    EditionComplexesService,
    EditionDataService,
    EditionOutlineService,
    EditionService,
} from '@awg-views/edition-view/services';

import { EditionIntroComponent } from './edition-intro.component';

// Mock components
@Component({ selector: 'awg-error-alert', template: '' })
class ErrorAlertStubComponent {
    @Input()
    errorObject: any;
}

@Component({ selector: 'awg-modal', template: '' })
class ModalStubComponent {
    open(modalContentSnippetKey: string): void {}
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

fdescribe('IntroComponent (DONE)', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockRouter;

    let editionDataServiceGetEditionComplexIntroDataSpy: Spy;
    let editionServiceGetSelectedEditionComplexSpy: Spy;
    let editionServiceGetSelectedEditionSectionSpy: Spy;
    let editionServiceGetSelectedEditionSeriesSpy: Spy;

    let componentOpenModalSpy: Spy;
    let getEditionIntroDataSpy: Spy;
    let navigateWithComplexIdSpy: Spy;
    let navigateToIntroFragmentSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigationSpy: Spy;
    let modalOpenSpy: Spy;
    let selectSvgSheetSpy: Spy;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionService: Partial<EditionService>;
    let editionDataService: Partial<EditionDataService>;
    let editionService: Partial<EditionService>;
    let mockIsIntroViewSubject: ReplaySubject<boolean>;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionComplexBaseRoute: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedEditionIntroData: IntroList;
    let expectedEditionIntroEmptyData: IntroList;
    let expectedIntroFragment: string;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSelectedEditionSeries: EditionOutlineSeries;
    let expectedSelectedEditionSection: EditionOutlineSection;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    const jsonPipe = new JsonPipe();

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mock services
        mockIsIntroViewSubject = new ReplaySubject<boolean>(1);

        mockEditionService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => observableOf(expectedEditionComplex),
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> =>
                observableOf(expectedSelectedEditionSeries),
            getSelectedEditionSection: (): Observable<EditionOutlineSection> =>
                observableOf(expectedSelectedEditionSection),
            updateIsIntroView: (isView: boolean): void => mockIsIntroViewSubject.next(isView),
            clearIsIntroView: (): void => mockIsIntroViewSubject.next(null),
        };

        mockEditionDataService = {
            getEditionComplexIntroData: (editionComplex: EditionComplex): Observable<IntroList> =>
                observableOf(expectedEditionIntroData),
        };

        TestBed.configureTestingModule({
            imports: [NgbModalModule, RouterModule],
            declarations: [
                CompileHtmlComponent,
                EditionIntroComponent,
                ErrorAlertStubComponent,
                ModalStubComponent,
                RouterLinkStubDirective,
                TwelveToneSpinnerStubComponent,
            ],
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
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedEditionComplexBaseRoute = '/edition/complex/op12/';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedIntroFragment = 'note-80';
        expectedReportFragment = 'source_A';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedEditionIntroData = JSON.parse(JSON.stringify(mockEditionData.mockIntroData));
        expectedEditionIntroEmptyData = JSON.parse(JSON.stringify(mockEditionData.mockIntroEmptyData));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

        expectedSelectedEditionSeries = EditionOutlineService.getEditionSeriesById(
            expectedEditionComplex.pubStatement.series.route
        );
        expectedSelectedEditionSection = EditionOutlineService.getEditionSectionById(
            expectedEditionComplex.pubStatement.series.route,
            expectedEditionComplex.pubStatement.section.route
        );

        // Spies on functions
        getEditionIntroDataSpy = spyOn(component, 'getEditionIntroData').and.callThrough();
        navigateToIntroFragmentSpy = spyOn(component, 'navigateToIntroFragment').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateWithComplexIdSpy = spyOn(component as any, '_navigateWithComplexId').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
        modalOpenSpy = spyOn(component.modal, 'open').and.callThrough();
        componentOpenModalSpy = spyOn(component, 'openModal').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();

        editionDataServiceGetEditionComplexIntroDataSpy = spyOn(
            editionDataService,
            'getEditionComplexIntroData'
        ).and.returnValue(observableOf(expectedEditionIntroData));
        editionServiceGetSelectedEditionComplexSpy = spyOn(editionService, 'getSelectedEditionComplex').and.returnValue(
            observableOf(expectedEditionComplex)
        );
        editionServiceGetSelectedEditionSeriesSpy = spyOn(editionService, 'getSelectedEditionSeries').and.returnValue(
            observableOf(expectedSelectedEditionSeries)
        );
        editionServiceGetSelectedEditionSectionSpy = spyOn(editionService, 'getSelectedEditionSection').and.returnValue(
            observableOf(expectedSelectedEditionSection)
        );
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
            it('... should contain a `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ModalStubComponent, 1, 1);
            });

            it('... should contain no div.awg-edition-intro-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
            });

            it('... should not contain an error alert component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ErrorAlertStubComponent, 0, 0);
            });

            it('... should not contain a loading spinner component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });

    fdescribe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionIntroData$ = observableOf(expectedEditionIntroData);
            component.editionComplex = expectedEditionComplex;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionIntroData()`', () => {
            expectSpyCall(getEditionIntroDataSpy, 1);
        });

        it('... should have triggered `getSelectedEditionComplex()` method from EditionService', () => {
            expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 1);
        });

        it('... should have editionComplex', () => {
            expectToEqual(component.editionComplex, expectedEditionComplex);
        });

        it('... should have editionIntroData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolved();
            expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolvedTo(expectedEditionIntroData);
        }));

        describe('VIEW', () => {
            it('... should contain one div.awg-edition-intro-view', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
            });

            it('... should contain as many intro paragraph elements in div.awg-edition-intro-view as content items in intro data', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-para',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );
            });

            it('... should have one anchor in first paragraph, and 3 in the second one', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-para',
                    expectedEditionIntroData.intro[0].content.length,
                    expectedEditionIntroData.intro[0].content.length
                );

                getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
                getAndExpectDebugElementByCss(pDes[1], 'a', 3, 3);
            });

            it('... should contain as many note paragraphs in div.awg-edition-intro-view as note items in intro data', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-note',
                    0, // TODO: expectedEditionIntroData.intro[0].notes.length,
                    0 // TODO: expectedEditionIntroData.intro[0].notes.length,
                );
            });

            it('... should have each note paragraph embedded in small element', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                getAndExpectDebugElementByCss(
                    divDes[0],
                    'small p.awg-edition-intro-note',
                    0, // TODO: expectedEditionIntroData.intro[0].notes.length,
                    0 // TODO: expectedEditionIntroData.intro[0].notes.length,
                );
            });

            it('... should have one anchor in note paragraph', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-note',
                    0, // TODO: expectedEditionIntroData.intro[0].notes.length,
                    0 // TODO: expectedEditionIntroData.intro[0].notes.length,
                );

                getAndExpectDebugElementByCss(pDes[0], 'a', 1, 1);
            });

            it('... should contain one horizontal line and header for notes ', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'hr', 1, 1);
                const headerDe = getAndExpectDebugElementByCss(divDes[0], 'h5', 1, 1);
                const headerEl = headerDe[0].nativeElement;

                expectToBe(headerEl.textContent.trim(), 'Anmerkungen');
            });

            it('... should contain a placeholder if content of intro data is empty', waitForAsync(() => {
                // Simulate the parent setting an empty content array
                component.editionIntroData$ = observableOf(expectedEditionIntroEmptyData);
                detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p.awg-edition-intro-empty', 1, 1);

                getAndExpectDebugElementByCss(pDes[0], 'small.text-muted', 1, 1);
            }));

            it('... should display placeholder in paragraph', waitForAsync(() => {
                // Simulate the parent setting an empty content array
                component.editionIntroData$ = observableOf(expectedEditionIntroEmptyData);
                detectChangesOnPush(fixture);

                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-intro-view > p.awg-edition-intro-empty',
                    1,
                    1
                );
                const pEl = pDes[0].nativeElement;

                // Create intro placeholder
                const fullComplexSpan = mockDocument.createElement('span');
                fullComplexSpan.innerHTML = expectedEditionComplex.complexId.full;

                const shortComplexSpan = mockDocument.createElement('span');
                shortComplexSpan.innerHTML = expectedEditionComplex.complexId.short;

                const awg = EDITION_ROUTE_CONSTANTS.EDITION.short;
                const series = expectedEditionComplex.pubStatement.series.short;
                const section = expectedEditionComplex.pubStatement.section.short;

                const introPlaceholder = `[Die Einleitung zum Editionskomplex ${fullComplexSpan.textContent} erscheint im Zusammenhang der vollständigen Edition von ${shortComplexSpan.textContent} in ${awg} ${series}/${section}.]`;

                expectToBe(pEl.textContent.trim(), introPlaceholder);
            }));

            describe('on error', () => {
                const expectedError = { status: 404, statusText: 'got Error' };

                beforeEach(waitForAsync(() => {
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionComplexIntroDataSpy.and.returnValue(
                        observableThrowError(() => expectedError)
                    );

                    component.getEditionIntroData();
                    detectChangesOnPush(fixture);
                }));

                it('... should not contain intro view, but one ErrorAlertComponent (stubbed)', waitForAsync(() => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);

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
                    it('... editionIntroData$ is EMPTY', () => {
                        // Mock empty observable
                        component.editionIntroData$ = EMPTY;
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, ErrorAlertStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionIntroData$ is undefined', () => {
                        // Mock undefined response
                        component.editionIntroData$ = observableOf(undefined);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, ErrorAlertStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionIntroData$ is null', () => {
                        // Mock null response
                        component.editionIntroData$ = observableOf(null);
                        detectChangesOnPush(fixture);

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, ErrorAlertStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });
            });
        });

        describe('#getEditionIntroData()', () => {
            it('... should have a method `getEditionIntroData`', () => {
                expect(component.getEditionIntroData).toBeDefined();
            });

            it('... should have been called', () => {
                expectSpyCall(getEditionIntroDataSpy, 1);
            });

            it('... should have got `editionComplex` from editionService', () => {
                expectSpyCall(editionServiceGetSelectedEditionComplexSpy, 1);

                expectToEqual(component.editionComplex, expectedEditionComplex);
            });

            it('... should have got editionIntroData from editionDataService', () => {
                expectSpyCall(editionDataServiceGetEditionComplexIntroDataSpy, 1);
            });

            it('... should return empty observable and set errorObject if switchMap fails', waitForAsync(() => {
                const expectedError = { status: 404, statusText: 'error' };
                // Spy on editionDataService to return an error
                editionDataServiceGetEditionComplexIntroDataSpy.and.returnValue(
                    observableThrowError(() => expectedError)
                );

                // Init new switchMap
                component.getEditionIntroData();
                detectChangesOnPush(fixture);

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
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-para',
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
                detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-para',
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
                detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-para',
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
                detectChangesOnPush(fixture);

                expectSpyCall(componentOpenModalSpy, 1, expectedModalSnippet);
                expectSpyCall(modalOpenSpy, 1, expectedModalSnippet);

                const otherSnippet = 'otherSnippet';
                component.openModal(otherSnippet);
                detectChangesOnPush(fixture);

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
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                // Find paragraphs
                const pDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'p.awg-edition-intro-para',
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
                detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                    detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
                        detectChangesOnPush(fixture);

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
