/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { EmptyError, lastValueFrom, Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    EditionComplex,
    EditionSvgSheet,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionReportComponent } from './edition-report.component';

// Mock components
@Component({ selector: 'awg-modal', template: '' })
class ModalStubComponent {
    open(modalContentSnippetKey: string): void {}
}

@Component({ selector: 'awg-source-list', template: '' })
class SourceListStubComponent {
    @Input()
    sourceListData: SourceList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-source-description', template: '' })
class SourceDescriptionStubComponent {
    @Input()
    sourceDescriptionListData: SourceDescriptionList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-source-evaluation', template: '' })
class SourceEvaluationStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    sourceEvaluationListData: SourceEvaluationList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-textcritics-list', template: '' })
export class TextcriticsListStubComponent {
    @Input()
    textcriticsData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;
    let compDe: DebugElement;

    let mockRouter;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockEditionService: Partial<EditionService>;
    let editionDataService: Partial<EditionDataService>;
    let editionService: Partial<EditionService>;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionReportData: (SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[];
    let expectedSourceListData: SourceList;
    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedTextcriticsData: TextcriticsList;
    let expectedFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedPanelId: string;

    let expectedEditionComplexRoute: string;
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;

    let editionDataServiceGetEditionReportDataSpy: Spy;
    let getEditionReportDataSpy: Spy;
    let getEditionComplexSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigationSpy: Spy;
    let modalOpenSpy: Spy;
    let onModalOpenSpy: Spy;
    let selectSvgSheetSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        // Mock router with spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        // Mock services
        mockEditionDataService = {
            getEditionReportData: (
                editionComplex: EditionComplex
            ): Observable<(SourceList | SourceDescriptionList | SourceEvaluationList | TextcriticsList)[]> =>
                observableOf(expectedEditionReportData),
        };
        mockEditionService = {
            getEditionComplex: (): Observable<EditionComplex> => observableOf(expectedEditionComplex),
        };

        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule, NgbModalModule],
            declarations: [
                CompileHtmlComponent,
                EditionReportComponent,
                ModalStubComponent,
                SourceListStubComponent,
                SourceDescriptionStubComponent,
                SourceEvaluationStubComponent,
                TextcriticsListStubComponent,
                RouterOutletStubComponent,
            ],
            providers: [
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: EditionService, useValue: mockEditionService },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Inject services from root
        editionDataService = TestBed.inject(EditionDataService);
        editionService = TestBed.inject(EditionService);

        // Test data
        expectedPanelId = 'awg-sources-panel';
        expectedFragment = 'sourceA';
        expectedEditionComplex = EDITION_COMPLEXES.OP12;

        expectedEditionComplexRoute = '/edition/complex/op12/';

        expectedModalSnippet = mockEditionData.mockModalSnippet;
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;

        expectedSourceListData = mockEditionData.mockSourceListData;
        expectedSourceDescriptionListData = mockEditionData.mockSourceDescriptionListData;
        expectedSourceEvaluationListData = mockEditionData.mockSourceEvaluationListData;
        expectedTextcriticsData = mockEditionData.mockTextcriticsData;

        expectedEditionReportData = [
            expectedSourceListData,
            expectedSourceDescriptionListData,
            expectedSourceEvaluationListData,
            expectedTextcriticsData,
        ];

        // Spies on service functions
        editionDataServiceGetEditionReportDataSpy = spyOn(editionDataService, 'getEditionReportData').and.returnValue(
            observableOf(expectedEditionReportData)
        );
        getEditionComplexSpy = spyOn(editionService, 'getEditionComplex').and.returnValue(
            observableOf(expectedEditionComplex)
        );
        getEditionReportDataSpy = spyOn(component, 'getEditionReportData').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'onReportFragmentNavigate').and.callThrough();
        navigationSpy = mockRouter.navigate as jasmine.Spy;
        modalOpenSpy = spyOn(component.modal, 'open').and.callThrough();
        onModalOpenSpy = spyOn(component, 'onModalOpen').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'onSvgSheetSelect').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionReportData$`', () => {
            expect(component.editionReportData$).toBeUndefined();
        });

        it('... should not have `editionComplex`', () => {
            expect(component.editionComplex).toBeUndefined();
        });

        it('should have `editionRouteConstants`', () => {
            expect(component.editionRouteConstants).toBeDefined();
            expect(component.editionRouteConstants)
                .withContext(`should be ${expectedEditionRouteConstants}`)
                .toBe(expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain no ngb-accordion yet', () => {
                // Ngb-accordion debug element
                getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 0, 0);
            });

            it('... should not contain source list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 0, 0);
            });

            it('... should not contain source description component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 0, 0);
            });

            it('... should not contain source evaluation component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 0, 0);
            });

            it('... should not contain textcritics list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.editionReportData$ = observableOf(expectedEditionReportData);
            component.editionComplex = expectedEditionComplex;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionComplex()`', () => {
            // `getEditionReportData()` called immediately after init
            expectSpyCall(getEditionComplexSpy, 1);
        });

        it('... should have called `getEditionReportData()`', () => {
            // `getEditionReportData()` called immediately after init
            expectSpyCall(getEditionReportDataSpy, 1);
        });

        it('... should have editionComplex', () => {
            expect(component.editionComplex).toBeDefined();
            expect(component.editionComplex)
                .withContext(`should equal ${expectedEditionComplex}`)
                .toEqual(expectedEditionComplex);
        });

        it('... should have editionReportData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.editionReportData$)).toBeResolved();
            expectAsync(lastValueFrom(component.editionReportData$))
                .withContext(`should be resolved to ${expectedEditionReportData}`)
                .toBeResolvedTo(expectedEditionReportData);
        }));

        describe('VIEW', () => {
            it('... should contain one ngb-accordion', () => {
                // Ngb-accordion debug element
                getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);
            });

            it('... should contain one source list component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
            });

            it('... should contain one source description component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 1, 1);
            });

            it('... should contain one source evaluation component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 1, 1);
            });

            it('... should contain one textcritics list component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 1, 1);
            });

            it('... should pass down sourceListData to SourceListComponent', () => {
                const sourceListDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                const sourceListCmp = sourceListDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                expect(sourceListCmp.sourceListData).toBeTruthy();
                expect(sourceListCmp.sourceListData)
                    .withContext(`should equal ${expectedSourceListData}`)
                    .toEqual(expectedSourceListData);
            });

            it('... should pass down sourceDescriptionListData to SourceDescriptionComponent', () => {
                const descriptionDes = getAndExpectDebugElementByDirective(
                    compDe,
                    SourceDescriptionStubComponent,
                    1,
                    1
                );
                const descriptionCmp = descriptionDes[0].injector.get(
                    SourceDescriptionStubComponent
                ) as SourceDescriptionStubComponent;

                expect(descriptionCmp.sourceDescriptionListData).toBeTruthy();
                expect(descriptionCmp.sourceDescriptionListData)
                    .withContext(`should equal ${expectedSourceDescriptionListData}`)
                    .toEqual(expectedSourceDescriptionListData);
            });

            it('... should pass down sourceEvaluationListData to SourceEvaluationComponent', () => {
                const evaluationDes = getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 1, 1);
                const evaluationCmp = evaluationDes[0].injector.get(
                    SourceEvaluationStubComponent
                ) as SourceEvaluationStubComponent;

                expect(evaluationCmp.sourceEvaluationListData).toBeTruthy();
                expect(evaluationCmp.sourceEvaluationListData)
                    .withContext(`should equal ${expectedSourceEvaluationListData}`)
                    .toEqual(expectedSourceEvaluationListData);
            });

            it('... should pass down textcriticsListData to TextcriticsListComponent', () => {
                const textcriticsDes = getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 1, 1);
                const textcriticsCmp = textcriticsDes[0].injector.get(
                    TextcriticsListStubComponent
                ) as TextcriticsListStubComponent;

                expect(textcriticsCmp.textcriticsData).toBeTruthy();
                expect(textcriticsCmp.textcriticsData)
                    .withContext(`should equal ${expectedTextcriticsData}`)
                    .toEqual(expectedTextcriticsData);
            });
        });

        describe('#getEditionReportData', () => {
            it('... should have been called', () => {
                expectSpyCall(getEditionReportDataSpy, 1);
            });

            it('... should have got `editionComplex` from editionService', () => {
                expectSpyCall(getEditionComplexSpy, 1);

                expect(component.editionComplex).toBeTruthy();
                expect(component.editionComplex)
                    .withContext(`should equal ${expectedEditionComplex}`)
                    .toEqual(expectedEditionComplex);
            });

            it('... should have got editionReportData from editionDataService', () => {
                expectSpyCall(editionDataServiceGetEditionReportDataSpy, 1);
            });

            it('... should return empty observable and set errorObject if switchMap fails', waitForAsync(() => {
                const expectedError = { status: 404, statusText: 'error' };
                // Spy on editionDataService to return an error
                editionDataServiceGetEditionReportDataSpy.and.returnValue(observableThrowError(() => expectedError));

                // Init new switchMap
                component.getEditionReportData();
                fixture.detectChanges();

                expectAsync(lastValueFrom(component.editionReportData$)).toBeRejected();
                expectAsync(lastValueFrom(component.editionReportData$)).toBeRejectedWithError(EmptyError);

                expect(component.errorObject).toEqual(expectedError);
            }));
        });

        describe('#onModalOpen', () => {
            describe('... should trigger on event from', () => {
                describe('... SourceListComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const sourceListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceListStubComponent,
                            1,
                            1
                        );
                        const sourceListCmp = sourceListDes[0].injector.get(
                            SourceListStubComponent
                        ) as SourceListStubComponent;

                        sourceListCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const sourceListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceListStubComponent,
                            1,
                            1
                        );
                        const sourceListCmp = sourceListDes[0].injector.get(
                            SourceListStubComponent
                        ) as SourceListStubComponent;

                        sourceListCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });

                describe('... SourceDescriptionComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });

                describe('... SourceEvaluationComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });

                describe('... TextcriticsListComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        textcriticsCmp.openModalRequest.emit(undefined);

                        expectSpyCall(onModalOpenSpy, 1, undefined);
                    });

                    it('... smodal snippet is given', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        textcriticsCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    });
                });
            });

            it('... should open modal with given id', () => {
                component.onModalOpen(expectedModalSnippet);
                fixture.detectChanges();

                expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                expectSpyCall(modalOpenSpy, 1, expectedModalSnippet);

                const otherSnippet = 'otherSnippet';
                component.onModalOpen(otherSnippet);
                fixture.detectChanges();

                expectSpyCall(onModalOpenSpy, 2, otherSnippet);
                expectSpyCall(modalOpenSpy, 2, otherSnippet);
            });

            describe('... should not do anything if ', () => {
                it('... id is undefined', () => {
                    component.onModalOpen(undefined);

                    expectSpyCall(onModalOpenSpy, 1, undefined);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is null', () => {
                    component.onModalOpen(null);

                    expectSpyCall(onModalOpenSpy, 1, null);
                    expectSpyCall(modalOpenSpy, 0);
                });

                it('... id is empty string', () => {
                    component.onModalOpen('');

                    expectSpyCall(onModalOpenSpy, 1, '');
                    expectSpyCall(modalOpenSpy, 0);
                });
            });
        });

        describe('#onReportFragmentNavigate', () => {
            describe('... should trigger on event from', () => {
                describe('... SourceEvaluationComponent if', () => {
                    it('... fragment id is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.navigateToReportFragmentRequest.emit(undefined);

                        expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                    });

                    it('... fragment id is given', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.navigateToReportFragmentRequest.emit(expectedSvgSheet.id);

                        expectSpyCall(navigateToReportFragmentSpy, 1, expectedSvgSheet.id);
                    });
                });
            });

            it('... should navigate to fragment if given', () => {
                component.onReportFragmentNavigate(expectedFragment);
                fixture.detectChanges();

                const qp = { fragment: expectedFragment };
                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);

                const otherFragment = 'otherFragment';
                qp.fragment = otherFragment;
                component.onReportFragmentNavigate(otherFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, otherFragment);
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);
            });

            it('... should navigate without fragment if none is given', () => {
                component.onReportFragmentNavigate(expectedFragment);
                fixture.detectChanges();

                const qp = { fragment: expectedFragment };
                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);

                const noFragment = '';
                qp.fragment = noFragment;
                component.onReportFragmentNavigate(noFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, '');
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);
            });
        });

        describe('#onSvgSheetSelect', () => {
            describe('... should trigger on event from', () => {
                describe('... SourceDescriptionComponent if', () => {
                    it('... svg sheet id is undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... svg sheet id is given', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.selectSvgSheetRequest.emit(expectedSvgSheet.id);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                    });
                });

                describe('... SourceEvaluationComponent if', () => {
                    it('... svg sheet id is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... svg sheet id is given', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        evaluationCmp.selectSvgSheetRequest.emit(expectedSvgSheet.id);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                    });
                });

                describe('... TextcriticsListComponent if', () => {
                    it('... svg sheet id is undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        textcriticsCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... svg sheet id is given', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSvgSheet.id);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                    });
                });
            });

            it('... should navigate to id if given', () => {
                component.onSvgSheetSelect(expectedSvgSheet.id);
                fixture.detectChanges();

                const qp = {
                    queryParams: { sketch: expectedSvgSheet.id },
                };
                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qp,
                ]);

                component.onSvgSheetSelect(expectedNextSvgSheet.id);
                fixture.detectChanges();

                qp.queryParams.sketch = expectedNextSvgSheet.id;
                expectSpyCall(selectSvgSheetSpy, 2, expectedNextSvgSheet.id);
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qp,
                ]);
            });

            it('... should navigate without id if none is given', () => {
                component.onSvgSheetSelect(expectedSvgSheet.id);
                fixture.detectChanges();

                const qp = {
                    queryParams: { sketch: expectedSvgSheet.id },
                };
                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qp,
                ]);

                const noId = '';
                qp.queryParams.sketch = noId;
                component.onSvgSheetSelect(noId);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, '');
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexRoute, expectedEditionRouteConstants.EDITION_SHEETS.route],
                    qp,
                ]);
            });
        });
    });
});
