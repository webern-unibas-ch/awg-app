/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordionModule, NgbConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterOutletStubComponent } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import {
    EditionSvgSheet,
    EditionWork,
    EditionWorks,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import { EditionDataService, EditionService } from '@awg-views/edition-view/services';

import { EditionReportComponent } from './edition-report.component';

// Mock components
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

    let expectedEditionWork: EditionWork;
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

    let editionDataServiceGetEditionReportDataSpy: Spy;
    let getEditionReportDataSpy: Spy;
    let getEditionWorkSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigationSpy: Spy;
    let openModalSpy: Spy;
    let selectSvgSheetSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(
        waitForAsync(() => {
            // Mock router with spy object
            mockRouter = jasmine.createSpyObj('Router', ['navigate']);

            // Mock services
            mockEditionDataService = {
                getEditionReportData: (
                    editionWork: EditionWork
                ): Observable<[SourceList, SourceDescriptionList, SourceEvaluationList, TextcriticsList]> =>
                    observableOf(),
            };
            mockEditionService = {
                getEditionWork: (): Observable<EditionWork> => observableOf(),
            };

            TestBed.configureTestingModule({
                imports: [NgbAccordionWithConfigModule, NgbModalModule],
                declarations: [
                    CompileHtmlComponent,
                    EditionReportComponent,
                    RouterOutletStubComponent,
                    SourceListStubComponent,
                    SourceDescriptionStubComponent,
                    SourceEvaluationStubComponent,
                    TextcriticsListStubComponent,
                    ModalComponent,
                ],
                providers: [
                    { provide: EditionDataService, useValue: mockEditionDataService },
                    { provide: EditionService, useValue: mockEditionService },
                    { provide: Router, useValue: mockRouter },
                ],
            }).compileComponents();
        })
    );

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
        expectedEditionWork = EditionWorks.OP12;

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
        getEditionWorkSpy = spyOn(editionService, 'getEditionWork').and.returnValue(observableOf(expectedEditionWork));
        getEditionReportDataSpy = spyOn(component, 'getEditionReportData').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'onReportFragmentNavigate').and.callThrough();
        // .openModalSpy = spyOn(modal, 'open').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'onSvgSheetSelect').and.callThrough();

        navigationSpy = mockRouter.navigate as jasmine.Spy;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have editionReportData$', () => {
            expect(component.editionReportData$).withContext('should be undefined').toBeUndefined();
        });

        it('... should not have editionWork', () => {
            expect(component.editionWork).withContext('should be undefined').toBeUndefined();
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
            component.editionWork = expectedEditionWork;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have called `getEditionWork()`', () => {
            // `getEditionReportData()` called immediately after init
            expectSpyCall(getEditionWorkSpy, 1);
        });

        it('... should have called `getEditionReportData()`', () => {
            // `getEditionReportData()` called immediately after init
            expectSpyCall(getEditionReportDataSpy, 1);
        });

        it('... should have editionWork', () => {
            expect(component.editionWork).withContext('should be defined').toBeDefined();
            expect(component.editionWork)
                .withContext(`should equal ${expectedEditionWork}`)
                .toEqual(expectedEditionWork);
        });

        it('... should have editionReportData$', done => {
            expect(component.editionReportData$).withContext('should be defined').toBeDefined();
            component.editionReportData$.subscribe(
                response => {
                    expect(response)
                        .withContext(`should equal ${expectedEditionReportData}`)
                        .toEqual(expectedEditionReportData);
                    done();
                },
                err => {
                    fail('error should not have been called');
                    done();
                },
                () => {
                    done();
                }
            );
        });

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

            it('... should have got `editionWork` from editionService', () => {
                expectSpyCall(getEditionWorkSpy, 1);

                expect(component.editionWork).toBeTruthy();
                expect(component.editionWork)
                    .withContext(`should equal ${expectedEditionWork}`)
                    .toEqual(expectedEditionWork);
            });

            it('... should have got editionReportData from editionDataService', () => {
                expectSpyCall(editionDataServiceGetEditionReportDataSpy, 1);
            });

            it(
                '... should return empty observable and set errorObject if switchMap fails',
                waitForAsync(() => {
                    const expectedError = { status: 404, statusText: 'error' };
                    // Spy on editionDataService to return an error
                    editionDataServiceGetEditionReportDataSpy.and.returnValue(
                        observableThrowError(() => expectedError)
                    );

                    // Init new switchMap
                    component.getEditionReportData();
                    // Apply changes
                    detectChangesOnPush(fixture);

                    component.editionReportData$.subscribe(
                        data => {
                            fail('should not have next');
                        },
                        error => {
                            fail('should not error');
                        },
                        () => {
                            expect(component.errorObject).toEqual(expectedError);
                        }
                    );
                })
            );
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
        });
    });
});
