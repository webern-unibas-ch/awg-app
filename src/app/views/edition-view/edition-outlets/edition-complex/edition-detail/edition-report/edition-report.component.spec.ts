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
    expectToBe,
    expectToEqual,
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
    open(_modalContentSnippetKey: string): void {}
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
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
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
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

@Component({ selector: 'awg-textcritics-list', template: '' })
export class TextcriticsListStubComponent {
    @Input()
    textcriticsData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
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
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedEditionComplexBaseRoute: string;
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
        expectedFragment = 'source_A';
        expectedEditionComplex = EDITION_COMPLEXES.OP12;
        expectedEditionComplexBaseRoute = '/edition/complex/op12/';
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedModalSnippet = JSON.parse(JSON.stringify(mockEditionData.mockModalSnippet));
        expectedSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk1));
        expectedNextSvgSheet = JSON.parse(JSON.stringify(mockEditionData.mockSvgSheet_Sk2));

        expectedSourceListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceListData));
        expectedSourceDescriptionListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceDescriptionListData));
        expectedSourceEvaluationListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceEvaluationListData));
        expectedTextcriticsData = JSON.parse(JSON.stringify(mockEditionData.mockTextcriticsData));

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

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
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
            expectToEqual(component.editionComplex, expectedEditionComplex);
        });

        it('... should have editionReportData$', waitForAsync(() => {
            expectAsync(lastValueFrom(component.editionReportData$)).toBeResolved();
            expectAsync(lastValueFrom(component.editionReportData$))
                .withContext(`should be resolved to ${expectedEditionReportData}`)
                .toBeResolvedTo(expectedEditionReportData);
        }));

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                // NgbAccordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
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

                expectToEqual(sourceListCmp.sourceListData, expectedSourceListData);
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

                expectToEqual(descriptionCmp.sourceDescriptionListData, expectedSourceDescriptionListData);
            });

            it('... should pass down sourceEvaluationListData to SourceEvaluationComponent', () => {
                const evaluationDes = getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 1, 1);
                const evaluationCmp = evaluationDes[0].injector.get(
                    SourceEvaluationStubComponent
                ) as SourceEvaluationStubComponent;

                expectToEqual(evaluationCmp.sourceEvaluationListData, expectedSourceEvaluationListData);
            });

            it('... should pass down textcriticsListData to TextcriticsListComponent', () => {
                const textcriticsDes = getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 1, 1);
                const textcriticsCmp = textcriticsDes[0].injector.get(
                    TextcriticsListStubComponent
                ) as TextcriticsListStubComponent;

                expectToEqual(textcriticsCmp.textcriticsData, expectedTextcriticsData);
            });
        });

        describe('#getEditionReportData()', () => {
            it('... should have a method `getEditionReportData`', () => {
                expect(component.getEditionReportData).toBeDefined();
            });

            it('... should have been called', () => {
                expectSpyCall(getEditionReportDataSpy, 1);
            });

            it('... should have got `editionComplex` from editionService', () => {
                expectSpyCall(getEditionComplexSpy, 1);

                expectToEqual(component.editionComplex, expectedEditionComplex);
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

        describe('#onModalOpen()', () => {
            it('... should have a method `onModalOpen`', () => {
                expect(component.onModalOpen).toBeDefined();
            });

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

        describe('#onReportFragmentNavigate()', () => {
            it('... should have a method `onReportFragmentNavigate`', () => {
                expect(component.onReportFragmentNavigate).toBeDefined();
            });

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
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);

                const otherFragment = 'otherFragment';
                qp.fragment = otherFragment;
                component.onReportFragmentNavigate(otherFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, otherFragment);
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);
            });

            it('... should navigate without fragment if none is given', () => {
                component.onReportFragmentNavigate(expectedFragment);
                fixture.detectChanges();

                const qp = { fragment: expectedFragment };
                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                expectSpyCall(navigationSpy, 1, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);

                const noFragment = '';
                qp.fragment = noFragment;
                component.onReportFragmentNavigate(noFragment);
                fixture.detectChanges();

                expectSpyCall(navigateToReportFragmentSpy, 2, '');
                expectSpyCall(navigationSpy, 2, [
                    [expectedEditionComplexBaseRoute, expectedEditionRouteConstants.EDITION_REPORT.route],
                    qp,
                ]);
            });
        });

        describe('#onSvgSheetSelect()', () => {
            it('... should have a method `onSvgSheetSelect`', () => {
                expect(component.onSvgSheetSelect).toBeDefined();
            });

            describe('... should trigger on event from', () => {
                describe('... SourceDescriptionComponent if', () => {
                    it('... sheet ids are undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: undefined };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... complex id is undefined', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: expectedSvgSheet.id };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

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

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... both sheet ids are given', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                        descriptionCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });

                describe('... SourceEvaluationComponent if', () => {
                    it('... sheet ids are undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: undefined };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                    it('... complex id is undefined', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: expectedSvgSheet.id };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
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

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... both sheet ids are given', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationStubComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationStubComponent
                        ) as SourceEvaluationStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                        evaluationCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });

                describe('... TextcriticsListComponent if', () => {
                    it('... sheet ids are undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: undefined };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... complex id is undefined', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        const expectedSheetIds = { complexId: undefined, sheetId: expectedSvgSheet.id };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

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

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });

                    it('... both sheet ids are given', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListStubComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListStubComponent
                        ) as TextcriticsListStubComponent;

                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                        textcriticsCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                        expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                    });
                });
            });

            it('... should navigate within same complex to id if given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                let expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                };

                component.onSvgSheetSelect(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                qp.queryParams.id = expectedNextSvgSheet.id;

                component.onSvgSheetSelect(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, expectedSheetIds);
                expectSpyCall(navigationSpy, 2, [expectedSheetRoute, qp]);
            });

            it('... should navigate within same complex without id if none is given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                let expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                };

                component.onSvgSheetSelect(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                const noId = '';
                qp.queryParams.id = noId;
                expectedSheetIds = { complexId: expectedComplexId, sheetId: noId };

                component.onSvgSheetSelect(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, expectedSheetIds);
                expectSpyCall(navigationSpy, 2, [expectedSheetRoute, qp]);
            });
            it('... should navigate to id of antoher complex if given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                };

                component.onSvgSheetSelect(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                const expectedNextSheetRoute = [
                    `/edition/complex/${expectedNextComplexId}/`,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                qp.queryParams.id = expectedNextSvgSheet.id;

                component.onSvgSheetSelect(expectedNextSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, expectedNextSheetIds);
                expectSpyCall(navigationSpy, 2, [expectedNextSheetRoute, qp]);
            });

            it('... should navigate to another complex without id if none is given', () => {
                expectedComplexId = expectedEditionComplex.complexId.route.replace('/', '');
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                const expectedSheetRoute = [
                    expectedEditionComplexBaseRoute,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];
                const qp = {
                    queryParams: { id: expectedSvgSheet.id },
                };

                component.onSvgSheetSelect(expectedSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
                expectSpyCall(navigationSpy, 1, [expectedSheetRoute, qp]);

                const noId = '';
                qp.queryParams.id = noId;
                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: noId };
                const expectedNextSheetRoute = [
                    `/edition/complex/${expectedNextComplexId}/`,
                    expectedEditionRouteConstants.EDITION_SHEETS.route,
                ];

                component.onSvgSheetSelect(expectedNextSheetIds);
                fixture.detectChanges();

                expectSpyCall(selectSvgSheetSpy, 2, expectedNextSheetIds);
                expectSpyCall(navigationSpy, 2, [expectedNextSheetRoute, qp]);
            });
        });
    });
});
