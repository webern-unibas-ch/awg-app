import { DOCUMENT } from '@angular/common';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import {
    EMPTY,
    EmptyError,
    isEmpty,
    lastValueFrom,
    Observable,
    of as observableOf,
    throwError as observableThrowError,
    ReplaySubject,
} from 'rxjs';
import Spy = jasmine.Spy;

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionOutlineSection,
    EditionOutlineSeries,
    EditionSvgSheet,
    IntroBlock,
    IntroList,
} from '@awg-views/edition-view/models';
import {
    EditionComplexesService,
    EditionDataService,
    EditionOutlineService,
    EditionStateService,
} from '@awg-views/edition-view/services';

import { EditionIntroComponent } from './edition-intro.component';

// Mock components
@Component({
    selector: 'awg-edition-intro-content',
    template: '',
    standalone: false,
})
class EditionIntroContentStubComponent {
    @Input()
    introBlockContent: IntroBlock[];
    @Input()
    notesLabel: string;
    @Output()
    navigateToIntroFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({
    selector: 'awg-edition-intro-nav',
    template: '',
    standalone: false,
})
class EditionIntroNavStubComponent {
    @Input()
    introBlockContent: IntroBlock[];
    @Input()
    notesLabel: string;
    @Input()
    currentLanguage: number;
    @Output() languageChangeRequest = new EventEmitter<number>();
}

@Component({
    selector: 'awg-edition-intro-partial-disclaimer',
    template: '',
    standalone: false,
})
class EditionIntroPartialDisclaimerStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    editionLabel: string;
    @Input()
    editionRoute: string;
    @Input()
    seriesRoute: string;
    @Input()
    sectionRoute: string;
    @Input()
    introRoute: string;
}

@Component({
    selector: 'awg-edition-intro-placeholder',
    template: '',
    standalone: false,
})
class EditionIntroPlaceholderStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    editionLabel: string;
}

@Component({
    selector: 'awg-alert-error',
    template: '',
    standalone: false,
})
class AlertErrorStubComponent {
    @Input()
    errorObject: any;
}

@Component({
    selector: 'awg-modal',
    template: '',
    standalone: false,
})
class ModalStubComponent {
    open(): void {}
}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

describe('IntroComponent (DONE)', () => {
    let component: EditionIntroComponent;
    let fixture: ComponentFixture<EditionIntroComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;
    let mockRouter;

    let editionDataServiceGetEditionSectionIntroDataSpy: Spy;
    let editionDataServiceGetEditionComplexIntroDataSpy: Spy;
    let editionOutlineServiceGetEditionSeriesByIdSpy: Spy;
    let editionOutlineServiceGetEditionSectionByIdSpy: Spy;
    let editionStateServiceGetSelectedEditionComplexSpy: Spy;
    let editionStateServiceGetSelectedEditionSectionSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSectionSpy: Spy;
    let editionStateServiceGetSelectedEditionSeriesSpy: Spy;
    let editionStateServiceUpdateSelectedEditionSeriesSpy: Spy;
    let editionStateServiceUpdateIsIntroViewSpy: Spy;
    let editionStateServiceClearIsIntroViewSpy: Spy;

    let getEditionIntroDataSpy: Spy;
    let navigateWithComplexIdSpy: Spy;
    let navigationSpy: Spy;
    let openModalSpy: Spy;
    let onIntroFragmentNavigateSpy: Spy;
    let onLanguageSetSpy: Spy;
    let onModalOpenSpy: Spy;
    let onReportFragmentNavigateSpy: Spy;
    let onSvgSheetSelectSpy: Spy;
    let consoleSpy: Spy;

    let extractUrlSegmentsSpy: Spy;
    let fetchAndFilterIntroDataSpy: Spy;
    let isNavigationEndToIntroSpy: Spy;
    let loadEditionIntroDataSpy: Spy;
    let updateEditionStateSpy: Spy;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionStateService: Partial<EditionStateService>;
    let editionDataService: Partial<EditionDataService>;
    let editionStateService: Partial<EditionStateService>;
    let mockIsIntroViewSubject: ReplaySubject<boolean>;

    let expectedCurrentLaguage: number;
    let expectedNotesLabels: Map<number, string>;
    let expectedEditionComplex: EditionComplex;
    let expectedEditionIntroData: IntroList;
    let expectedErrorObject: any;

    let expectedEditionComplexBaseRoute: string;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedEditionIntroComplexData: IntroList;
    let expectedEditionIntroFilteredData: IntroList;
    let expectedIntroFragment: string;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSelectedEditionSeries: EditionOutlineSeries;
    let expectedSelectedEditionSection: EditionOutlineSection;
    let expectedSvgSheet: EditionSvgSheet;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = {
            url: '/test-url',
            events: observableOf(
                new NavigationEnd(0, 'http://localhost:4200/test-url', 'http://localhost:4200/test-url')
            ),
            navigate: jasmine.createSpy('navigate'),
        };

        // Mock services
        mockIsIntroViewSubject = new ReplaySubject<boolean>(1);

        mockEditionStateService = {
            getSelectedEditionComplex: (): Observable<EditionComplex> => observableOf(null),
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> => observableOf(null),
            updateSelectedEditionSeries: (): void => {},
            getSelectedEditionSection: (): Observable<EditionOutlineSection> => observableOf(null),
            updateSelectedEditionSection: (): void => {},
            updateIsIntroView: (isView: boolean): void => mockIsIntroViewSubject.next(isView),
            clearIsIntroView: (): void => mockIsIntroViewSubject.next(null),
        };

        mockEditionDataService = {
            getEditionComplexIntroData: (): Observable<IntroList> => observableOf(null),
            getEditionSectionIntroData: (): Observable<IntroList> => observableOf(null),
        };

        TestBed.configureTestingModule({
            imports: [NgbModalModule, RouterModule],
            declarations: [
                EditionIntroComponent,
                EditionIntroContentStubComponent,
                EditionIntroPartialDisclaimerStubComponent,
                EditionIntroPlaceholderStubComponent,
                EditionIntroNavStubComponent,
                AlertErrorStubComponent,
                ModalStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionStateService, useValue: mockEditionStateService },
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
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedCurrentLaguage = 0;
        expectedNotesLabels = new Map([
            [0, 'Anmerkungen'],
            [1, 'Notes'],
        ]);
        expectedEditionIntroData = JSON.parse(JSON.stringify(mockEditionData.mockIntroData));
        expectedEditionIntroComplexData = JSON.parse(JSON.stringify(mockEditionData.mockIntroComplexData));
        expectedEditionIntroFilteredData = JSON.parse(JSON.stringify(mockEditionData.mockIntroFilteredData));
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedErrorObject = null;

        expectedEditionComplexBaseRoute = '/edition/complex/op12/';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedIntroFragment = 'note-80';
        expectedReportFragment = 'source_A';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));

        expectedSelectedEditionSeries = EditionOutlineService.getEditionSeriesById(
            expectedEditionComplex.pubStatement.series.route
        );
        expectedSelectedEditionSection = EditionOutlineService.getEditionSectionById(
            expectedEditionComplex.pubStatement.series.route,
            expectedEditionComplex.pubStatement.section.route
        );

        // Spies on functions
        extractUrlSegmentsSpy = spyOn(component as any, '_extractUrlSegments').and.callThrough();
        fetchAndFilterIntroDataSpy = spyOn(component as any, '_fetchAndFilterIntroData').and.callThrough();
        isNavigationEndToIntroSpy = spyOn(component as any, '_isNavigationEndToIntro').and.callThrough();
        loadEditionIntroDataSpy = spyOn(component as any, '_loadEditionIntroData').and.callThrough();
        updateEditionStateSpy = spyOn(component as any, '_updateEditionState').and.callThrough();
        getEditionIntroDataSpy = spyOn(component, 'getEditionIntroData').and.callThrough();
        navigateWithComplexIdSpy = spyOn(component as any, '_navigateWithComplexId').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
        openModalSpy = spyOn(component.modal, 'open').and.callThrough();
        onIntroFragmentNavigateSpy = spyOn(component, 'onIntroFragmentNavigate').and.callThrough();
        onLanguageSetSpy = spyOn(component, 'onLanguageSet').and.callThrough();
        onModalOpenSpy = spyOn(component, 'onModalOpen').and.callThrough();
        onReportFragmentNavigateSpy = spyOn(component, 'onReportFragmentNavigate').and.callThrough();
        onSvgSheetSelectSpy = spyOn(component, 'onSvgSheetSelect').and.callThrough();
        consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);

        editionDataServiceGetEditionComplexIntroDataSpy = spyOn(
            editionDataService,
            'getEditionComplexIntroData'
        ).and.callThrough();
        editionDataServiceGetEditionSectionIntroDataSpy = spyOn(
            editionDataService,
            'getEditionSectionIntroData'
        ).and.callThrough();
        editionOutlineServiceGetEditionSeriesByIdSpy = spyOn(
            EditionOutlineService,
            'getEditionSeriesById'
        ).and.callThrough();
        editionOutlineServiceGetEditionSectionByIdSpy = spyOn(
            EditionOutlineService,
            'getEditionSectionById'
        ).and.callThrough();
        editionStateServiceGetSelectedEditionComplexSpy = spyOn(
            editionStateService,
            'getSelectedEditionComplex'
        ).and.callThrough();
        editionStateServiceGetSelectedEditionSeriesSpy = spyOn(
            editionStateService,
            'getSelectedEditionSeries'
        ).and.callThrough();
        editionStateServiceUpdateSelectedEditionSeriesSpy = spyOn(
            editionStateService,
            'updateSelectedEditionSeries'
        ).and.callThrough();
        editionStateServiceGetSelectedEditionSectionSpy = spyOn(
            editionStateService,
            'getSelectedEditionSection'
        ).and.callThrough();
        editionStateServiceUpdateSelectedEditionSectionSpy = spyOn(
            editionStateService,
            'updateSelectedEditionSection'
        ).and.callThrough();
        editionStateServiceUpdateIsIntroViewSpy = spyOn(editionStateService, 'updateIsIntroView').and.callThrough();
        editionStateServiceClearIsIntroViewSpy = spyOn(editionStateService, 'clearIsIntroView').and.callThrough();
    });

    afterEach(() => {
        // Clear mock stores after each test
        mockConsole.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `currentLanguage`', () => {
            expectToBe(component.currentLanguage, expectedCurrentLaguage);
        });

        it('... should have `notesLabels`', () => {
            expectToEqual(component.notesLabels, expectedNotesLabels);
        });

        it('... should not have `editionIntroData$`', () => {
            expect(component.editionIntroData$).toBeUndefined();
        });

        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('... should have `errorObject = null`', () => {
            expectToBe(component.errorObject, expectedErrorObject);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToEqual(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain an outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, ModalStubComponent, 1, 1);
            });

            it('... should not contain a div.awg-edition-intro-view yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
            });

            it('... should not contain an edition intro partial disclaimer component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroPartialDisclaimerStubComponent, 0, 0);
            });

            it('... should not contain an edition intro content component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentStubComponent, 0, 0);
            });

            it('... should not contain an edition intro nav component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavStubComponent, 0, 0);
            });

            it('... should not contain an edition intro empty component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], EditionIntroPlaceholderStubComponent, 0, 0);
            });

            it('... should not contain an AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should not contain a loading spinner component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the services returning the observable properties
            editionStateServiceGetSelectedEditionSeriesSpy.and.returnValue(observableOf(expectedSelectedEditionSeries));
            editionStateServiceGetSelectedEditionSectionSpy.and.returnValue(
                observableOf(expectedSelectedEditionSection)
            );
            editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(observableOf(expectedEditionComplex));
            editionDataServiceGetEditionSectionIntroDataSpy.and.returnValue(observableOf(expectedEditionIntroData));
            editionDataServiceGetEditionComplexIntroDataSpy.and.returnValue(
                observableOf(expectedEditionIntroComplexData)
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionIntroData()`', () => {
            expectSpyCall(getEditionIntroDataSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-edition-intro-view', () => {
                // Div debug element
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
            });

            it('... should contain one div.row in div.awg-edition-intro-view', () => {
                // Div debug element
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.row', 1, 1);
            });

            describe('... if intro data is given', () => {
                describe('... with complex', () => {
                    it('... should contain one EditionIntroPartialDisclaimerComponent (stubbed)', waitForAsync(() => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(
                            divDes[0],
                            EditionIntroPartialDisclaimerStubComponent,
                            1,
                            1
                        );
                    }));

                    it('... should pass down `editionComplex`, `editionLabel`, and routes to EditionIntroPartialDisclaimerComponent', waitForAsync(() => {
                        const editionIntroPartialDisclaimerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionIntroPartialDisclaimerStubComponent,
                            1,
                            1
                        );
                        const editionIntroPartialDisclaimerCmp = editionIntroPartialDisclaimerDes[0].injector.get(
                            EditionIntroPartialDisclaimerStubComponent
                        ) as EditionIntroPartialDisclaimerStubComponent;

                        expectToEqual(editionIntroPartialDisclaimerCmp.editionComplex, expectedEditionComplex);
                        expectToEqual(
                            editionIntroPartialDisclaimerCmp.editionLabel,
                            expectedEditionRouteConstants.EDITION.short
                        );
                        expectToEqual(
                            editionIntroPartialDisclaimerCmp.editionRoute,
                            expectedEditionRouteConstants.EDITION.route
                        );
                        expectToEqual(
                            editionIntroPartialDisclaimerCmp.seriesRoute,
                            expectedEditionRouteConstants.SERIES.route
                        );
                        expectToEqual(
                            editionIntroPartialDisclaimerCmp.sectionRoute,
                            expectedEditionRouteConstants.SECTION.route
                        );
                        expectToEqual(
                            editionIntroPartialDisclaimerCmp.introRoute,
                            expectedEditionRouteConstants.EDITION_INTRO.route
                        );
                    }));

                    it('... should contain one EditionIntroContentComponent (stubbed)', waitForAsync(() => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentStubComponent, 1, 1);
                    }));

                    it('... should pass down `introBlockContent` and `notesLabel` to EditionIntroContentComponent', waitForAsync(() => {
                        const editionIntroContentDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionIntroContentStubComponent,
                            1,
                            1
                        );
                        const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                            EditionIntroContentStubComponent
                        ) as EditionIntroContentStubComponent;

                        expectToEqual(
                            editionIntroContentCmp.introBlockContent,
                            expectedEditionIntroFilteredData.intro[expectedCurrentLaguage].content
                        );
                        expectToEqual(
                            editionIntroContentCmp.notesLabel,
                            expectedNotesLabels.get(expectedCurrentLaguage)
                        );
                    }));

                    it('... should contain one EditionIntroNavComponent (stubbed)', waitForAsync(() => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavStubComponent, 1, 1);
                    }));

                    it('... should pass down `introBlockContent`, `notesLabel` and `currentLanguage` to EditionIntroNavComponent', waitForAsync(() => {
                        const editionIntroNavDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionIntroNavStubComponent,
                            1,
                            1
                        );
                        const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                            EditionIntroNavStubComponent
                        ) as EditionIntroNavStubComponent;

                        expectToEqual(
                            editionIntroNavCmp.introBlockContent,
                            expectedEditionIntroFilteredData.intro[expectedCurrentLaguage].content
                        );
                        expectToEqual(editionIntroNavCmp.notesLabel, expectedNotesLabels.get(expectedCurrentLaguage));
                        expectToEqual(editionIntroNavCmp.currentLanguage, expectedCurrentLaguage);
                    }));
                });

                describe('... without complex', () => {
                    beforeEach(() => {
                        component.editionComplex = undefined;
                        fixture.detectChanges();
                    });

                    it('... should not contain an edition intro partial disclaimer component (stubbed)', () => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(
                            divDes[0],
                            EditionIntroPartialDisclaimerStubComponent,
                            0,
                            0
                        );
                    });

                    it('... should contain one EditionIntroContentComponent (stubbed)', waitForAsync(() => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionIntroContentStubComponent, 1, 1);
                    }));

                    it('... should pass down `introBlockContent` and `notesLabel` to EditionIntroContentComponent', waitForAsync(() => {
                        const editionIntroContentDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionIntroContentStubComponent,
                            1,
                            1
                        );
                        const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                            EditionIntroContentStubComponent
                        ) as EditionIntroContentStubComponent;

                        expectToEqual(
                            editionIntroContentCmp.introBlockContent,
                            expectedEditionIntroFilteredData.intro[expectedCurrentLaguage].content
                        );
                        expectToEqual(
                            editionIntroContentCmp.notesLabel,
                            expectedNotesLabels.get(expectedCurrentLaguage)
                        );
                    }));

                    it('... should contain one EditionIntroNavComponent (stubbed)', waitForAsync(() => {
                        const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                        getAndExpectDebugElementByDirective(divDes[0], EditionIntroNavStubComponent, 1, 1);
                    }));

                    it('... should pass down `introBlockContent`, `notesLabel` and `currentLanguage` to EditionIntroNavComponent', waitForAsync(() => {
                        const editionIntroNavDes = getAndExpectDebugElementByDirective(
                            compDe,
                            EditionIntroNavStubComponent,
                            1,
                            1
                        );
                        const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                            EditionIntroNavStubComponent
                        ) as EditionIntroNavStubComponent;

                        expectToEqual(
                            editionIntroNavCmp.introBlockContent,
                            expectedEditionIntroFilteredData.intro[expectedCurrentLaguage].content
                        );
                        expectToEqual(editionIntroNavCmp.notesLabel, expectedNotesLabels.get(expectedCurrentLaguage));
                        expectToEqual(editionIntroNavCmp.currentLanguage, expectedCurrentLaguage);
                    }));
                });
            });

            describe('... if intro data is empty', () => {
                it('... should contain one EditionIntroPlaceholderComponent (stubbed)', waitForAsync(() => {
                    // Simulate the parent setting an empty content array
                    component.editionIntroData$ = observableOf(expectedEditionIntroComplexData);
                    fixture.detectChanges();

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], EditionIntroPlaceholderStubComponent, 1, 1);
                }));

                it('... should pass down `editionComplex` and `editionLabel` to EditionIntroPlaceholderComponent', waitForAsync(() => {
                    // Simulate the parent setting an empty content array
                    component.editionIntroData$ = observableOf(expectedEditionIntroComplexData);
                    fixture.detectChanges();

                    const editionIntroPlaceholderDes = getAndExpectDebugElementByDirective(
                        compDe,
                        EditionIntroPlaceholderStubComponent,
                        1,
                        1
                    );
                    const editionIntroPlaceholderCmp = editionIntroPlaceholderDes[0].injector.get(
                        EditionIntroPlaceholderStubComponent
                    ) as EditionIntroPlaceholderStubComponent;

                    expectToEqual(editionIntroPlaceholderCmp.editionComplex, expectedEditionComplex);
                    expectToEqual(editionIntroPlaceholderCmp.editionLabel, expectedEditionRouteConstants.EDITION.short);
                }));
            });

            describe('on error', () => {
                beforeEach(waitForAsync(() => {
                    expectedErrorObject = { status: 404, statusText: 'got Error' };
                    // Spy on editionDataService to return an error
                    fetchAndFilterIntroDataSpy.and.returnValue(observableThrowError(() => expectedErrorObject));

                    component.getEditionIntroData();
                    fixture.detectChanges();
                }));

                it('... should not contain intro view, but one AlertErrorComponent (stubbed)', waitForAsync(() => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);

                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                }));

                it('... should pass down error object to AlertErrorComponent', waitForAsync(() => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject, expectedErrorObject);
                }));
            });

            describe('on loading', () => {
                describe('... should contain only TwelveToneSpinnerComponent (stubbed) if ... ', () => {
                    it('... editionIntroData$ is EMPTY', () => {
                        // Mock empty observable
                        component.editionIntroData$ = EMPTY;
                        fixture.detectChanges();

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionIntroData$ is undefined', () => {
                        // Mock undefined response
                        component.editionIntroData$ = observableOf(undefined);
                        fixture.detectChanges();

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... editionIntroData$ is null', () => {
                        // Mock null response
                        component.editionIntroData$ = observableOf(null);
                        fixture.detectChanges();

                        getAndExpectDebugElementByCss(compDe, 'div.awg-edition-intro-view', 0, 0);
                        getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);
                        getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });
            });
        });

        describe('#getEditionIntroData()', () => {
            it('... should have a method `getEditionIntroData`', () => {
                expect(component.getEditionIntroData).toBeDefined();
            });

            it('... should trigger `_isNavigationEndToIntro` method', () => {
                expectSpyCall(isNavigationEndToIntroSpy, 1);

                component.getEditionIntroData();

                expectSpyCall(isNavigationEndToIntroSpy, 2);
            });

            describe('... on NavigationEnd event', () => {
                it('... should return true from `_isNavigationEndToIntro` method for intro URL', () => {
                    const anyUrl = '/some/path';
                    const introUrl = '/some/path/series/1/section/5/intro';
                    const navigationEndEvent = new NavigationEnd(1, anyUrl, introUrl);

                    const result = component['_isNavigationEndToIntro'](navigationEndEvent);

                    expectToBe(result, true);
                });

                it('... should return false from `_isNavigationEndToIntro` method for non-intro URL', () => {
                    const anyUrl = '/some/path';
                    const otherUrl = '/some/path/series/1/section/5/other';
                    const navigationEndEvent = new NavigationEnd(1, anyUrl, otherUrl);

                    const result = component['_isNavigationEndToIntro'](navigationEndEvent);

                    expectToBe(result, false);
                });

                it('... should trigger `_extractUrlSegments` with intro URL', () => {
                    const anyUrl = '/some/path';
                    const introUrl = '/some/path/series/1/section/5/intro';
                    const navigationEndEvent = new NavigationEnd(1, anyUrl, introUrl);

                    mockRouter.events = observableOf(navigationEndEvent);
                    fixture.detectChanges();

                    component.getEditionIntroData();

                    expectSpyCall(extractUrlSegmentsSpy, 1, navigationEndEvent.urlAfterRedirects);
                });

                it('... should update edition state with seriesNumber and sectionNumber for valid URL segments', () => {
                    const seriesNumber = '1';
                    const sectionNumber = '5';
                    const anyUrl = '/some/path';
                    const introUrl = `/some/path/series/${seriesNumber}/section/${sectionNumber}/intro`;
                    const navigationEndEvent = new NavigationEnd(1, anyUrl, introUrl);

                    mockRouter.events = observableOf(navigationEndEvent);
                    fixture.detectChanges();

                    component.getEditionIntroData();

                    expectSpyCall(updateEditionStateSpy, 1, [seriesNumber, sectionNumber]);
                });

                it('... should not update edition state, but log an error for invalid URL segments', () => {
                    const anyUrl = '/some/path';
                    const invalidIntroUrl = `/some/path/series/invalid/section/invalid/intro`;
                    const navigationEndEvent = new NavigationEnd(1, anyUrl, invalidIntroUrl);

                    mockRouter.events = observableOf(navigationEndEvent);
                    fixture.detectChanges();

                    component.getEditionIntroData();

                    expectSpyCall(updateEditionStateSpy, 0);
                    expectSpyCall(consoleSpy, 1, ['Invalid URL segments:', navigationEndEvent.urlAfterRedirects]);
                });

                it('... should trigger `_loadEditionIntroData` method', () => {
                    expectSpyCall(loadEditionIntroDataSpy, 1);

                    component.getEditionIntroData();

                    expectSpyCall(loadEditionIntroDataSpy, 2);
                });
            });
        });

        describe('#onIntroFragmentNavigate()', () => {
            it('... should have a method `onIntroFragmentNavigate`', () => {
                expect(component.onIntroFragmentNavigate).toBeDefined();
            });

            it('... should trigger on event from EditionIntroContentComponent', () => {
                const editionIntroContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionIntroContentStubComponent,
                    1,
                    1
                );
                const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                    EditionIntroContentStubComponent
                ) as EditionIntroContentStubComponent;

                const expectedIntroIds = { complexId: expectedComplexId, fragmentId: expectedIntroFragment };

                editionIntroContentCmp.navigateToIntroFragmentRequest.emit(expectedIntroIds);

                expectSpyCall(onIntroFragmentNavigateSpy, 1, expectedIntroIds);
            });

            it('... should navigate (to same page) with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedIntroIds = { complexId: expectedComplexId, fragmentId: expectedIntroFragment };
                const expectedNavigationExtras = {
                    fragment: expectedIntroIds.fragmentId,
                };

                component.onIntroFragmentNavigate(expectedIntroIds);
                fixture.detectChanges();

                expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
            });

            describe('... should navigate (to same page) with empty fragment id if', () => {
                it('... fragment id is undefined', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: undefined };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onIntroFragmentNavigate(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                });

                it('... fragment id is null', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: null };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onIntroFragmentNavigate(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: '' };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onIntroFragmentNavigate(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                });
            });

            describe('... should navigate (to same page) with undefined complex id if', () => {
                it('... introIds are undefined', () => {
                    const expectedIntroIds = undefined;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onIntroFragmentNavigate(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                });

                it('... introIds are null', () => {
                    const expectedIntroIds = null;
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onIntroFragmentNavigate(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                });

                it('... fragment id is empty string', () => {
                    expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                    const expectedIntroIds = { complexId: expectedComplexId, fragmentId: '' };
                    const expectedNavigationExtras = {
                        fragment: '',
                    };

                    component.onIntroFragmentNavigate(expectedIntroIds);
                    fixture.detectChanges();

                    expectSpyCall(navigationSpy, 1, [[], expectedNavigationExtras]);
                });
            });
        });

        describe('#onLanguageSet()', () => {
            it('... should have a method `onLanguageSet`', () => {
                expect(component.onLanguageSet).toBeDefined();
            });

            it('... should trigger on event from EditionIntroNavComponent', () => {
                const editionIntroNavDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionIntroNavStubComponent,
                    1,
                    1
                );
                const editionIntroNavCmp = editionIntroNavDes[0].injector.get(
                    EditionIntroNavStubComponent
                ) as EditionIntroNavStubComponent;

                editionIntroNavCmp.languageChangeRequest.emit(expectedCurrentLaguage);

                expectSpyCall(onLanguageSetSpy, 1, expectedCurrentLaguage);
            });

            it('... should set `currentLanguage` to the given language', () => {
                component.onLanguageSet(expectedCurrentLaguage);
                fixture.detectChanges();

                expectToBe(component.currentLanguage, expectedCurrentLaguage);

                const newLanguage = 1;

                component.onLanguageSet(newLanguage);

                expect(component.currentLanguage).toBe(newLanguage);
            });

            it('... should not change `currentLanguage` if the same language is passed', () => {
                const initialLanguage = component.currentLanguage;

                component.onLanguageSet(initialLanguage);

                expect(component.currentLanguage).toBe(initialLanguage);
            });

            it('... should change `currentLanguage` if a different language is passed', () => {
                const initialLanguage = component.currentLanguage;
                const newLanguage = initialLanguage === 0 ? 1 : 0;

                component.onLanguageSet(newLanguage);

                expect(component.currentLanguage).not.toBe(initialLanguage);

                expect(component.currentLanguage).toBe(newLanguage);
            });
        });

        describe('#onModalOpen()', () => {
            it('... should have a method `onModalOpen`', () => {
                expect(component.onModalOpen).toBeDefined();
            });

            it('... should trigger on event from EditionIntroContentComponent', () => {
                const editionIntroContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionIntroContentStubComponent,
                    1,
                    1
                );
                const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                    EditionIntroContentStubComponent
                ) as EditionIntroContentStubComponent;

                editionIntroContentCmp.openModalRequest.emit(expectedModalSnippet);

                expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
            });

            it('... should open modal with given id', () => {
                component.onModalOpen(expectedModalSnippet);
                fixture.detectChanges();

                expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                expectSpyCall(openModalSpy, 1, expectedModalSnippet);

                const otherSnippet = 'otherSnippet';
                component.onModalOpen(otherSnippet);
                fixture.detectChanges();

                expectSpyCall(onModalOpenSpy, 2, otherSnippet);
                expectSpyCall(openModalSpy, 2, otherSnippet);
            });

            describe('... should not do anything if ', () => {
                it('... id is undefined', () => {
                    component.onModalOpen(undefined);

                    expectSpyCall(onModalOpenSpy, 1);
                    expectSpyCall(openModalSpy, 0);
                });

                it('... id is null', () => {
                    component.onModalOpen(null);

                    expectSpyCall(onModalOpenSpy, 1);
                    expectSpyCall(openModalSpy, 0);
                });

                it('... id is empty string', () => {
                    component.onModalOpen('');

                    expectSpyCall(onModalOpenSpy, 1);
                    expectSpyCall(openModalSpy, 0);
                });
            });
        });

        describe('#onReportFragmentNavigate()', () => {
            it('... should have a method `onReportFragmentNavigate`', () => {
                expect(component.onReportFragmentNavigate).toBeDefined();
            });

            it('... should trigger on event from EditionIntroContentComponent', () => {
                const editionIntroContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionIntroContentStubComponent,
                    1,
                    1
                );
                const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                    EditionIntroContentStubComponent
                ) as EditionIntroContentStubComponent;

                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                editionIntroContentCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                expectSpyCall(onReportFragmentNavigateSpy, 1, expectedReportIds);
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };

                const expectedReportRoute = expectedEditionRouteConstants.EDITION_REPORT.route;
                const expectedNavigationExtras = {
                    fragment: expectedReportIds.fragmentId,
                };

                component.onReportFragmentNavigate(expectedReportIds);
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

                    component.onReportFragmentNavigate(expectedReportIds);
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

                    component.onReportFragmentNavigate(expectedReportIds);
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

                    component.onReportFragmentNavigate(expectedReportIds);
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

                    component.onReportFragmentNavigate(expectedReportIds);
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

                    component.onReportFragmentNavigate(expectedReportIds);
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

                    component.onReportFragmentNavigate(expectedReportIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
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

            it('... should trigger on event from EditionIntroContentComponent', () => {
                const editionIntroContentDes = getAndExpectDebugElementByDirective(
                    compDe,
                    EditionIntroContentStubComponent,
                    1,
                    1
                );
                const editionIntroContentCmp = editionIntroContentDes[0].injector.get(
                    EditionIntroContentStubComponent
                ) as EditionIntroContentStubComponent;

                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };

                editionIntroContentCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                expectSpyCall(onSvgSheetSelectSpy, 1, expectedSheetIds);
            });

            it('... should call `_navigateWithComplexId()` method with correct parameters', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedReportFragment };

                const expectedSheetRoute = expectedEditionRouteConstants.EDITION_SHEETS.route;
                const expectedNavigationExtras = {
                    queryParams: { id: expectedSheetIds.sheetId },
                };

                component.onSvgSheetSelect(expectedSheetIds);
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

                    component.onSvgSheetSelect(expectedSheetIds);
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

                    component.onSvgSheetSelect(expectedSheetIds);
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

                    component.onSvgSheetSelect(expectedSheetIds);
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

                    component.onSvgSheetSelect(expectedSheetIds);
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

                    component.onSvgSheetSelect(expectedSheetIds);
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

                    component.onSvgSheetSelect(expectedSheetIds);
                    fixture.detectChanges();

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetRoute,
                        expectedNavigationExtras,
                    ]);
                });
            });
        });

        describe('#_extractUrlSegments', () => {
            it('... should have a method `_extractUrlSegments`', () => {
                expect((component as any)._extractUrlSegments).toBeDefined();
            });

            it('... should extract series and section numbers from a valid URL', () => {
                const url = '/edition/series/1/section/2/intro';

                const result = (component as any)._extractUrlSegments(url);

                expectToEqual(result, { seriesNumber: '1', sectionNumber: '2' });
            });

            it('... should extract series and section numbers with optional letters from a valid URL', () => {
                const url = '/edition/series/1/section/2a/intro';

                const result = (component as any)._extractUrlSegments(url);

                expectToEqual(result, { seriesNumber: '1', sectionNumber: '2a' });

                const url2 = '/edition/series/1/section/2b/intro';

                const result2 = (component as any)._extractUrlSegments(url2);

                expectToEqual(result2, { seriesNumber: '1', sectionNumber: '2b' });
            });

            it('... should handle URLs with missing series or section correctly', () => {
                const url = '/edition/series/3/intro';

                const result = (component as any)._extractUrlSegments(url);

                expectToEqual(result, { seriesNumber: '3', sectionNumber: undefined });

                const url2 = '/edition/section/4/intro';

                const result2 = (component as any)._extractUrlSegments(url2);

                expectToEqual(result2, { seriesNumber: undefined, sectionNumber: '4' });
            });

            it('... should handle URLs with additional segments correctly', () => {
                const url = '/edition/series/3/section/4/extra/intro';

                const result = (component as any)._extractUrlSegments(url);

                expectToEqual(result, { seriesNumber: '3', sectionNumber: '4' });
            });

            describe('... should return undefined if', () => {
                it('... URL does contain series numbers other than 1-3', () => {
                    const url = '/edition/series/0/section/5/intro';

                    const result = (component as any)._extractUrlSegments(url);

                    expectToEqual(result, { seriesNumber: undefined, sectionNumber: '5' });

                    const url2 = '/edition/series/4/section/5/intro';

                    const result2 = (component as any)._extractUrlSegments(url2);

                    expectToEqual(result2, { seriesNumber: undefined, sectionNumber: '5' });
                });

                it('... URL does contain section numbers other than 1-5', () => {
                    const url = '/edition/series/1/section/0/intro';

                    const result = (component as any)._extractUrlSegments(url);

                    expectToEqual(result, { seriesNumber: '1', sectionNumber: undefined });

                    const url2 = '/edition/series/1/section/6/intro';

                    const result2 = (component as any)._extractUrlSegments(url2);

                    expectToEqual(result2, { seriesNumber: '1', sectionNumber: undefined });
                });

                it('... URL does contain series and section numbers with optional letters other than a or b', () => {
                    const url = '/edition/series/1c/section/2d/intro';

                    const result = (component as any)._extractUrlSegments(url);

                    expectToEqual(result, { seriesNumber: undefined, sectionNumber: undefined });
                });

                it('... URL does not contain series and section numbers', () => {
                    const url = '/edition/series/section/intro';

                    const result = (component as any)._extractUrlSegments(url);

                    expectToEqual(result, { seriesNumber: undefined, sectionNumber: undefined });
                });

                it('... URL does not contain series and section segments', () => {
                    const url = '/edition/2/1/intro';

                    const result = (component as any)._extractUrlSegments(url);

                    expectToEqual(result, { seriesNumber: undefined, sectionNumber: undefined });
                });

                it('... URL is empty', () => {
                    const url = '';

                    const result = (component as any)._extractUrlSegments(url);

                    expectToEqual(result, { seriesNumber: undefined, sectionNumber: undefined });
                });

                it('... URL is undefined', () => {
                    const url = undefined;

                    const result = (component as any)._extractUrlSegments(url);

                    expectToEqual(result, { seriesNumber: undefined, sectionNumber: undefined });
                });
            });
        });

        describe('#_fetchAndFilterIntroData()', () => {
            it('... should have a method `_fetchAndFilterIntroData`', () => {
                expect((component as any)._fetchAndFilterIntroData).toBeDefined();
            });

            describe('... without given complex', () => {
                it('... should trigger `getEditionSectionIntroData()` method from EditionDataService with correct parameters', () => {
                    const seriesRoute = expectedSelectedEditionSeries.series.route;
                    const sectionRoute = expectedSelectedEditionSection.section.route;

                    expectSpyCall(editionDataServiceGetEditionSectionIntroDataSpy, 2);

                    (component as any)._fetchAndFilterIntroData(seriesRoute, sectionRoute, null);

                    expectSpyCall(editionDataServiceGetEditionSectionIntroDataSpy, 3, [seriesRoute, sectionRoute]);
                });

                it('... should return the correct edition intro data for a given series and section', done => {
                    const seriesRoute = expectedSelectedEditionSeries.series.route;
                    const sectionRoute = expectedSelectedEditionSection.section.route;

                    const result$ = (component as any)._fetchAndFilterIntroData(seriesRoute, sectionRoute, null);

                    result$.subscribe({
                        next: (data: Observable<IntroList>) => {
                            expectToEqual(data, expectedEditionIntroData);
                            done();
                        },
                        error: (err: any) => {
                            fail(`Observable emitted an error: ${err}`);
                            done();
                        },
                    });
                });
            });

            describe('... with given complex', () => {
                beforeEach(() => {
                    editionDataServiceGetEditionSectionIntroDataSpy.and.returnValue(
                        observableOf(expectedEditionIntroData)
                    );
                    editionDataServiceGetEditionComplexIntroDataSpy.and.returnValue(
                        observableOf(expectedEditionIntroComplexData)
                    );
                });

                it('... should trigger `getEditionSectionIntroData()` method from EditionDataService with correct parameters', () => {
                    const seriesRoute = expectedSelectedEditionSeries.series.route;
                    const sectionRoute = expectedSelectedEditionSection.section.route;
                    const complex = expectedEditionComplex;

                    expectSpyCall(editionDataServiceGetEditionSectionIntroDataSpy, 2);

                    (component as any)._fetchAndFilterIntroData(seriesRoute, sectionRoute, complex);

                    expectSpyCall(editionDataServiceGetEditionSectionIntroDataSpy, 3, [seriesRoute, sectionRoute]);
                });

                it('... should set `editionComplex`', done => {
                    const seriesRoute = expectedSelectedEditionSeries.series.route;
                    const sectionRoute = expectedSelectedEditionSection.section.route;
                    const complex = expectedEditionComplex;

                    const result$ = (component as any)._fetchAndFilterIntroData(seriesRoute, sectionRoute, complex);

                    result$.subscribe({
                        next: () => {
                            expectToEqual(component.editionComplex, complex);
                            done();
                        },
                        error: (err: any) => {
                            fail(`Observable emitted an error: ${err}`);
                            done();
                        },
                    });
                });

                it('... should trigger `getEditionComplexIntroData()` method from EditionDataService with complex', done => {
                    const seriesRoute = expectedSelectedEditionSeries.series.route;
                    const sectionRoute = expectedSelectedEditionSection.section.route;
                    const complex = expectedEditionComplex;

                    expectSpyCall(editionDataServiceGetEditionComplexIntroDataSpy, 1, complex);

                    const result$ = (component as any)._fetchAndFilterIntroData(seriesRoute, sectionRoute, complex);

                    result$.subscribe({
                        next: () => {
                            expectSpyCall(editionDataServiceGetEditionComplexIntroDataSpy, 2, complex);
                            done();
                        },
                        error: (err: any) => {
                            fail(`Observable emitted an error: ${err}`);
                            done();
                        },
                    });
                });

                it('... should trigger `_filterSectionIntroDataById()` method with correct parameters', done => {
                    const seriesRoute = expectedSelectedEditionSeries.series.route;
                    const sectionRoute = expectedSelectedEditionSection.section.route;
                    const complex = expectedEditionComplex;
                    const expectedBlockId = expectedEditionIntroComplexData.intro[0].id;

                    const filterSectionIntroDataByIdSpy = spyOn(
                        component as any,
                        '_filterSectionIntroDataById'
                    ).and.callThrough();

                    const result$ = (component as any)._fetchAndFilterIntroData(seriesRoute, sectionRoute, complex);

                    result$.subscribe({
                        next: () => {
                            expectSpyCall(filterSectionIntroDataByIdSpy, 1, [
                                expectedEditionIntroData,
                                expectedBlockId,
                            ]);
                            done();
                        },
                        error: (err: any) => {
                            fail(`Observable emitted an error: ${err}`);
                            done();
                        },
                    });
                });

                it('... should return the correct fltered edition intro data for a given series, section and complex', done => {
                    const seriesRoute = expectedSelectedEditionSeries.series.route;
                    const sectionRoute = expectedSelectedEditionSection.section.route;
                    const complex = expectedEditionComplex;

                    const result$ = (component as any)._fetchAndFilterIntroData(seriesRoute, sectionRoute, complex);

                    result$.subscribe({
                        next: (data: Observable<IntroList>) => {
                            expectToEqual(data, expectedEditionIntroFilteredData);
                            done();
                        },
                        error: (err: any) => {
                            fail(`Observable emitted an error: ${err}`);
                            done();
                        },
                    });
                });
            });
        });

        describe('#_filterSectionIntroDataById()', () => {
            it('... should have a method `_filterSectionIntroDataById`', () => {
                expect((component as any)._filterSectionIntroDataById).toBeDefined();
            });

            it('... should return the correct section intro data for a given block id', () => {
                const blockId = 'test_block_id_2';
                const expectedBlock = expectedEditionIntroData.intro[0].content.find(
                    block => block.blockId === blockId
                );

                const result = (component as any)._filterSectionIntroDataById(expectedEditionIntroData, blockId);

                expect(result).toBeDefined();
                expect(result.intro[0]).toBeDefined();
                expectToBe(result.intro[0].id, expectedEditionIntroData.intro[0].id);
                expectToEqual(result.intro[0].content, [expectedBlock]);
            });

            describe('... should return an empty content array if', () => {
                it('... no block id is given', () => {
                    const result = (component as any)._filterSectionIntroDataById(expectedEditionIntroData, undefined);

                    expect(result).toBeDefined();
                    expect(result.intro[0]).toBeDefined();
                    expectToBe(result.intro[0].id, expectedEditionIntroData.intro[0].id);
                    expectToEqual(result.intro[0].content, []);
                });

                it('... no intro data section is found for given block id', () => {
                    const blockId = 'notExistingId';
                    const result = (component as any)._filterSectionIntroDataById(expectedEditionIntroData, blockId);

                    expect(result).toBeDefined();
                    expect(result.intro[0]).toBeDefined();
                    expectToBe(result.intro[0].id, expectedEditionIntroData.intro[0].id);
                    expectToEqual(result.intro[0].content, []);
                });
            });
        });

        describe('#_initScrollListener()', () => {
            it('... should have a method `_initScrollListener`', () => {
                expect((component as any)._initScrollListener).toBeDefined();
            });

            it('.... should trigger `_onIntroScroll` method when window is scrolled', () => {
                const onIntroScrollSpy = spyOn(component as any, '_onIntroScroll');

                (component as any)._initScrollListener();

                window.dispatchEvent(new Event('scroll'));

                expect(onIntroScrollSpy).toHaveBeenCalled();
            });
        });

        describe('#_isNavigationEndToIntro()', () => {
            it('... should have a method `_isNavigationEndToIntro`', () => {
                expect(component['_isNavigationEndToIntro']).toBeDefined();
            });

            it('... should return true for NavigationEnd event with `intro` in URL', () => {
                const event = new NavigationEnd(1, '/some/path', '/some/path/intro');
                expect(component['_isNavigationEndToIntro'](event)).toBeTrue();
            });

            it('... should return false for NavigationEnd event without `intro` in URL', () => {
                const event = new NavigationEnd(1, '/some/path', '/some/path/other');
                expect(component['_isNavigationEndToIntro'](event)).toBeFalse();
            });

            it('... should return false for non-NavigationEnd event', () => {
                const event = { urlAfterRedirects: '/some/path/intro' };
                expect(component['_isNavigationEndToIntro'](event)).toBeFalse();
            });
        });

        describe('#_loadEditionIntroData()', () => {
            it('... should have a method `_loadEditionIntroData`', () => {
                expect((component as any)._loadEditionIntroData).toBeDefined();
            });

            it('... should trigger `getSelectedEditionSeries()` method from EditionStateService', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 1);

                (component as any)._loadEditionIntroData();

                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 2);
            });

            it('... should trigger `getSelectedEditionSection()` method from EditionStateService', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 1);

                (component as any)._loadEditionIntroData();

                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 2);
            });

            it('... should trigger `getSelectedEditionComplex()` method from EditionStateService', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 1);

                (component as any)._loadEditionIntroData();

                expectSpyCall(editionStateServiceGetSelectedEditionComplexSpy, 2);
            });

            describe('... without given complex', () => {
                beforeEach(fakeAsync(() => {
                    // Simulate the services returning the observable properties
                    editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(observableOf(null));

                    tick();

                    (component as any)._loadEditionIntroData();
                    fixture.detectChanges();
                }));

                it('... should have full editionIntroData$', waitForAsync(() => {
                    expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolved();
                    expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolvedTo(expectedEditionIntroData);
                }));

                it('... should not have editionComplex', () => {
                    expect(component.editionComplex).toBeUndefined();
                });

                it('... should have triggered `_fetchAndFilterIntroData()` method with series, section and complex=null', () => {
                    expectSpyCall(fetchAndFilterIntroDataSpy, 4, [
                        expectedSelectedEditionSeries.series.route,
                        expectedSelectedEditionSection.section.route,
                        null,
                    ]);
                });
            });

            describe('... with given complex', () => {
                it('... should have filtered editionIntroData$', waitForAsync(() => {
                    expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolved();
                    expectAsync(lastValueFrom(component.editionIntroData$)).toBeResolvedTo(
                        expectedEditionIntroFilteredData
                    );
                }));

                it('... should have set editionComplex', () => {
                    expectToEqual(component.editionComplex, expectedEditionComplex);
                });

                it('... should have triggered `_fetchAndFilterIntroData()` method with series, section, and complex', () => {
                    expectSpyCall(fetchAndFilterIntroDataSpy, 2, [
                        expectedSelectedEditionSeries.series.route,
                        expectedSelectedEditionSection.section.route,
                        expectedEditionComplex,
                    ]);
                });
            });

            describe('... without series or section (EMPTY)', () => {
                describe('... should have editionIntroData$ = EMPTY if', () => {
                    it('... no series is given', fakeAsync(() => {
                        // Simulate the services returning the observable properties
                        editionStateServiceGetSelectedEditionSeriesSpy.and.returnValue(observableOf(null));
                        editionStateServiceGetSelectedEditionSectionSpy.and.returnValue(
                            observableOf(expectedSelectedEditionSection)
                        );
                        editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(observableOf(null));

                        (component as any)._loadEditionIntroData();
                        tick();

                        component.editionIntroData$.pipe(isEmpty()).subscribe({
                            next: isEmptyData => {
                                expectToBe(isEmptyData, true);
                            },
                            error: err => {
                                fail(`Observable emitted an error: ${err}`);
                            },
                        });
                    }));

                    it('... no section is given', fakeAsync(() => {
                        // Simulate the services returning the observable properties
                        editionStateServiceGetSelectedEditionSeriesSpy.and.returnValue(
                            observableOf(expectedSelectedEditionSeries)
                        );
                        editionStateServiceGetSelectedEditionSectionSpy.and.returnValue(observableOf(null));
                        editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(observableOf(null));

                        (component as any)._loadEditionIntroData();
                        tick();

                        component.editionIntroData$.pipe(isEmpty()).subscribe({
                            next: isEmptyData => {
                                expectToBe(isEmptyData, true);
                            },
                            error: err => {
                                fail(`Observable emitted an error: ${err}`);
                            },
                        });
                    }));

                    it('... no series and no section are given', fakeAsync(() => {
                        // Simulate the services returning the observable properties
                        editionStateServiceGetSelectedEditionSeriesSpy.and.returnValue(observableOf(null));
                        editionStateServiceGetSelectedEditionSectionSpy.and.returnValue(observableOf(null));
                        editionStateServiceGetSelectedEditionComplexSpy.and.returnValue(
                            observableOf(expectedEditionComplex)
                        );

                        (component as any)._loadEditionIntroData();
                        tick();

                        component.editionIntroData$.pipe(isEmpty()).subscribe({
                            next: isEmptyData => {
                                expectToBe(isEmptyData, true);
                            },
                            error: err => {
                                fail(`Observable emitted an error: ${err}`);
                            },
                        });
                    }));
                });
            });

            describe('... on error', () => {
                it('... should return empty observable and set errorObject if switchMap fails', fakeAsync(() => {
                    const expectedError = { status: 404, statusText: 'error' };
                    // Spy on switchMap method to return an error
                    fetchAndFilterIntroDataSpy.and.returnValue(observableThrowError(() => expectedError));

                    (component as any)._loadEditionIntroData();
                    tick();

                    expectAsync(lastValueFrom(component.editionIntroData$)).toBeRejected();
                    expectAsync(lastValueFrom(component.editionIntroData$)).toBeRejectedWithError(EmptyError);

                    expectToEqual(component.errorObject, expectedError);
                }));
            });
        });

        describe('#_onIntroScroll()', () => {
            let intro: HTMLDivElement;
            let navLink1: HTMLAnchorElement;
            let navLink2: HTMLAnchorElement;

            beforeEach(() => {
                // Set up the DOM
                intro = mockDocument.createElement('div');
                intro.classList.add('awg-edition-intro');
                mockDocument.body.appendChild(intro);

                const introSection1 = mockDocument.createElement('div');
                introSection1.classList.add('awg-edition-intro-section');
                introSection1.id = 'section1';
                introSection1.style.position = 'absolute'; // Needed to get a fixed scroll target
                introSection1.style.top = '100px';
                introSection1.style.height = '100px';
                intro.appendChild(introSection1);

                const introSection2 = mockDocument.createElement('div');
                introSection2.classList.add('awg-edition-intro-section');
                introSection2.id = 'section2';
                introSection2.style.position = 'absolute'; // Needed to get a fixed scroll target
                introSection2.style.top = '300px';
                introSection2.style.height = '100px';
                intro.appendChild(introSection2);

                navLink1 = mockDocument.createElement('a');
                navLink1.classList.add('awg-edition-intro-nav-link');
                navLink1.href = '#section1';
                intro.appendChild(navLink1);

                navLink2 = mockDocument.createElement('a');
                navLink2.classList.add('awg-edition-intro-nav-link');
                navLink2.href = '#section2';
                intro.appendChild(navLink2);

                const screenSizeBy2 = mockDocument.documentElement.clientHeight * 2;
                mockDocument.body.style.minHeight = screenSizeBy2 + 'px';
            });

            it('... should have a method `_onIntroScroll`', () => {
                expect((component as any)._onIntroScroll).toBeDefined();
            });

            describe('... should do nothing if', () => {
                it('... event is undefined', () => {
                    (component as any)._onIntroScroll(undefined);

                    expectToBe(navLink1.classList.contains('active'), false);
                    expectToBe(navLink2.classList.contains('active'), false);
                });

                it('... event is null', () => {
                    (component as any)._onIntroScroll(null);

                    expectToBe(navLink1.classList.contains('active'), false);
                    expectToBe(navLink2.classList.contains('active'), false);
                });

                it('... event is not of type `scroll`', () => {
                    (component as any)._onIntroScroll(new Event('click'));

                    expectToBe(navLink1.classList.contains('active'), false);
                    expectToBe(navLink2.classList.contains('active'), false);
                });
            });

            it('... should update nav link classes based on scroll position (document.documentElement.scrollTop)', () => {
                // Spy on window.scrollTo
                spyOn(window, 'scrollTo').and.callFake((...args: any[]) => {
                    const y: number = args.length === 1 && typeof args[0] === 'object' ? args[0].top : args[1];
                    // Mock the scroll position
                    Object.defineProperty(mockDocument.documentElement, 'scrollTop', { value: y, writable: true });
                });

                // Scroll to a specific position
                window.scrollTo(0, 150);
                window.dispatchEvent(new Event('scroll'));
                fixture.detectChanges();

                (component as any)._onIntroScroll(new Event('scroll'));

                expectToBe(navLink1.classList.contains('active'), true);
                expectToBe(navLink2.classList.contains('active'), false);
            });

            it('... should update nav link classes based on scroll position (window.scrollY)', () => {
                // Spy on window.scrollTo
                spyOn(window, 'scrollTo').and.callFake((...args: any[]) => {
                    const y: number = args.length === 1 && typeof args[0] === 'object' ? args[0].top : args[1];
                    // Mock the scroll position
                    Object.defineProperty(window, 'scrollY', { value: y, writable: true });
                });

                // Scroll to a specific position
                window.scrollTo(0, 150);
                window.dispatchEvent(new Event('scroll'));
                fixture.detectChanges();

                (component as any)._onIntroScroll(new Event('scroll'));

                expectToBe(navLink1.classList.contains('active'), true);
                expectToBe(navLink2.classList.contains('active'), false);
            });

            afterEach(() => {
                // Clean up the DOM
                while (intro.firstChild) {
                    intro.removeChild(intro.firstChild);
                }
                mockDocument.body.removeChild(intro);
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

        describe('#_updateEditionState()', () => {
            it('... should have a method `_updateEditionState`', () => {
                expect((component as any)._updateEditionState).toBeDefined();
            });

            it('... should call EditionOutlineService.getEditionSeriesById', () => {
                expectSpyCall(editionOutlineServiceGetEditionSeriesByIdSpy, 0);

                const seriesNumber = '1';
                const sectionNumber = '5';

                (component as any)._updateEditionState(seriesNumber, sectionNumber);

                expectSpyCall(editionOutlineServiceGetEditionSeriesByIdSpy, 2, seriesNumber);
            });

            it('... should call EditionOutlineService.getEditionSectionById', () => {
                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 0);

                const seriesNumber = '1';
                const sectionNumber = '5';

                (component as any)._updateEditionState(seriesNumber, sectionNumber);

                expectSpyCall(editionOutlineServiceGetEditionSectionByIdSpy, 1, [seriesNumber, sectionNumber]);
            });

            it('... should trigger and update `selectedEditionSeries` in EditionStateService', () => {
                const seriesNumber = '1';
                const sectionNumber = '5';

                (component as any)._updateEditionState(seriesNumber, sectionNumber);

                expectSpyCall(editionStateServiceUpdateSelectedEditionSeriesSpy, 1, expectedSelectedEditionSeries);
            });

            it('... should trigger and update `selectedEditionSection` in EditionStateService', () => {
                const seriesNumber = '1';
                const sectionNumber = '5';

                (component as any)._updateEditionState(seriesNumber, sectionNumber);

                expectSpyCall(editionStateServiceUpdateSelectedEditionSectionSpy, 1, expectedSelectedEditionSection);
            });

            it('... should trigger and update `isIntroView = true` in EditionStateService', () => {
                const seriesNumber = '1';
                const sectionNumber = '5';

                (component as any)._updateEditionState(seriesNumber, sectionNumber);

                expectSpyCall(editionStateServiceUpdateIsIntroViewSpy, 1, true);
            });
        });

        describe('#ngOnDestroy()', () => {
            it('... should have cleared isIntroView on destroy (via EditionStateService)', () => {
                component.ngOnDestroy();

                expectSpyCall(editionStateServiceClearIsIntroViewSpy, 1);
            });

            it('... should have set `editionIntroData$` to undefined on destroy', () => {
                component.ngOnDestroy();

                expect(component.editionIntroData$).toBeUndefined();
            });
        });
    });
});
