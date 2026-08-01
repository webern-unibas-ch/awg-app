import {
    Component,
    DebugElement,
    EventEmitter,
    inject as inject_1,
    input,
    Input,
    isSignal,
    NgModule,
    Output,
    signal,
    WritableSignal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbAccordionModule, NgbConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
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
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import {
    EditionComplex,
    EditionSvgSheet,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
    TextcriticsList,
} from '@awg-views/edition-view/models';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { EditionStateService } from '@awg-views/edition-view/services';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionReportComponent } from './edition-report.component';

// Mock components
@Component({
    selector: 'awg-modal',
    template: '',
    standalone: false,
})
class ModalStubComponent {
    open(): void {}
}

@Component({
    selector: 'awg-alert-error',
    template: '',
})
class AlertErrorStubComponent {
    errorObject = input.required<any>();
}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
class TwelveToneSpinnerStubComponent {}

@Component({
    selector: 'awg-source-list',
    template: '',
    standalone: false,
})
class SourceListStubComponent {
    @Input()
    sourceListData: SourceList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
}

@Component({
    selector: 'awg-source-description',
    template: '',
    standalone: false,
})
class SourceDescriptionStubComponent {
    @Input()
    sourceDescriptionListData: SourceDescriptionList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

@Component({
    selector: 'awg-source-evaluation',
    template: '',
    standalone: false,
})
class SourceEvaluationStubComponent {
    @Input()
    editionComplex: EditionComplex;
    @Input()
    sourceEvaluationListData: SourceEvaluationList;
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{
        complexId: string;
        fragmentId: string;
    }> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

@Component({
    selector: 'awg-textcritics-list',
    template: '',
    standalone: false,
})
export class TextcriticsListStubComponent {
    @Input()
    textcriticsListData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{
        complexId: string;
        sheetId: string;
    }> = new EventEmitter();
}

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;
    let compDe: DebugElement;

    let mockRouter;

    let editionStateService: EditionStateService;

    let mockViewDataSignal: WritableSignal<EditionViewData<'report'>>;
    let expectedViewDataContent: EditionViewDataContent<'report'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'report'>;
    let expectedComplex: EditionComplex;
    let expectedSourceListData: SourceList;
    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedTextcriticsListData: TextcriticsList;
    let expectedReportFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedComplexBaseRoute: string;

    let navigateToReportFragmentSpy: Spy;
    let navigateWithComplexIdSpy: Spy;
    let navigationSpy: Spy;
    let modalOpenSpy: Spy;
    let onModalOpenSpy: Spy;
    let selectSvgSheetSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor() {
            const config = inject_1(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        // Mock router with spy object
        mockRouter = {
            navigate: vi.fn().mockName('Router.navigate'),
        };

        // Mock services
        expectedDefaultViewDataContent = {
            sourceListData: new SourceList(),
            sourceDescriptionData: new SourceDescriptionList(),
            sourceEvaluationData: new SourceEvaluationList(),
            textcriticsData: new TextcriticsList(),
        };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [AlertErrorStubComponent, NgbAccordionWithConfigModule, NgbModalModule],
            declarations: [
                CompileHtmlComponent,
                EditionReportComponent,
                ModalStubComponent,
                SourceListStubComponent,
                SourceDescriptionStubComponent,
                SourceEvaluationStubComponent,
                TextcriticsListStubComponent,
                RouterOutletStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
            providers: [
                { provide: EditionViewService, useValue: { reportViewData: mockViewDataSignal.asReadonly() } },
                { provide: Router, useValue: mockRouter },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        navigationSpy = mockRouter.navigate as Mock;

        // Test data
        expectedSourceListData = structuredClone(mockEditionData.mockSourceListData);
        expectedSourceDescriptionListData = structuredClone(mockEditionData.mockSourceDescriptionListData);
        expectedSourceEvaluationListData = structuredClone(mockEditionData.mockSourceEvaluationListData);
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        expectedReportFragment = 'source_A';
        expectedComplexId = 'op12';
        expectedComplexBaseRoute = `/edition/complex/${expectedComplexId}`;
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);
        expectedNextComplexId = 'testComplex2';
        expectedModalSnippet = structuredClone(mockEditionData.mockModalSnippet);
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);

        // Create component fixture
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        navigateToReportFragmentSpy = vi.spyOn(component, 'onReportFragmentNavigate');
        navigateWithComplexIdSpy = vi.spyOn(component as any, '_navigateWithComplexId');
        modalOpenSpy = vi.spyOn(component.modal, 'open');
        onModalOpenSpy = vi.spyOn(component, 'onModalOpen');
        selectSvgSheetSpy = vi.spyOn(component, 'onSvgSheetSelect');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have signal `viewData` to hold the default fallback data', () => {
            expectToBe(isSignal(component.viewData), true);

            expectToEqual(component.viewData(), createMockViewData(expectedDefaultViewDataContent));
        });

        describe('VIEW', () => {
            it('... should contain one outer `div`', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
            });

            it('... should contain one modal component (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], ModalStubComponent, 1, 1);
            });

            it('... should contain no AlertErrorComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent (stubbed)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);
            });

            it('... should contain no div.accordion yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });

            it('... should contain no source list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 0, 0);
            });

            it('... should contain no source description component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 0, 0);
            });

            it('... should contain no source evaluation component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 0, 0);
            });

            it('... should contain no textcritics list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, TextcriticsListStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the service setting the complex
            editionStateService.updateSelectedEditionComplex(expectedComplex);
            expectedViewDataContent = {
                sourceListData: expectedSourceListData,
                sourceDescriptionData: expectedSourceDescriptionListData,
                sourceEvaluationData: expectedSourceEvaluationListData,
                textcriticsData: expectedTextcriticsListData,
            };
            mockViewDataSignal.set(
                createMockViewData(expectedViewDataContent, {
                    isLoading: false,
                    error: null,
                })
            );

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
            expectToEqual(component.selectedEditionComplex(), expectedComplex);
        });

        it('... should have signal `viewData` to hold the expected data', () => {
            expectToEqual(component.viewData(), createMockViewData(expectedViewDataContent));
        });

        describe('VIEW', () => {
            describe('on error', () => {
                const expectedErrorObject: EditionDataAssetsError = {
                    key: 'textcritics',
                    error: { status: 404, statusText: 'Data not found' },
                };

                beforeEach(async () => {
                    // Mock error state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: expectedErrorObject,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain report view or spinner, but one AlertErrorComponent (stubbed)', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                    getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(divDes[0], AlertErrorStubComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(
                        AlertErrorStubComponent
                    ) as AlertErrorStubComponent;

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                it('... should not contain sheets view or alert, but one TwelveToneSpinnerComponent (stubbed)', async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: true,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorStubComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
                });
            });

            describe('on view data available', () => {
                beforeEach(async () => {
                    // Mock data state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: false,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion', () => {
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
                    const sourceListCmp = sourceListDes[0].injector.get(
                        SourceListStubComponent
                    ) as SourceListStubComponent;

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
                    const evaluationDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceEvaluationStubComponent,
                        1,
                        1
                    );
                    const evaluationCmp = evaluationDes[0].injector.get(
                        SourceEvaluationStubComponent
                    ) as SourceEvaluationStubComponent;

                    expectToEqual(evaluationCmp.sourceEvaluationListData, expectedSourceEvaluationListData);
                });

                it('... should pass down textcriticsListData to TextcriticsListComponent', () => {
                    const textcriticsDes = getAndExpectDebugElementByDirective(
                        compDe,
                        TextcriticsListStubComponent,
                        1,
                        1
                    );
                    const textcriticsCmp = textcriticsDes[0].injector.get(
                        TextcriticsListStubComponent
                    ) as TextcriticsListStubComponent;

                    expectToEqual(textcriticsCmp.textcriticsListData, expectedTextcriticsListData);
                });
            });
        });

        describe('METHODS', () => {
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

                it('... should open modal with given id', async () => {
                    component.onModalOpen(expectedModalSnippet);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(onModalOpenSpy, 1, expectedModalSnippet);
                    expectSpyCall(modalOpenSpy, 1, expectedModalSnippet);

                    const otherSnippet = 'otherSnippet';
                    component.onModalOpen(otherSnippet);
                    await detectChangesOnPush(fixture);

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
                    describe('... SourceListComponent if', () => {
                        it('... fragment id is undefined', () => {
                            const listDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                            const listCmp = listDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                            listCmp.navigateToReportFragmentRequest.emit(undefined);

                            expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                        });

                        it('... fragment id is given', () => {
                            const listDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                            const listCmp = listDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                            const expectedReportIds = {
                                complexId: expectedComplexId,
                                fragmentId: expectedReportFragment,
                            };

                            listCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                            expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                        });
                    });

                    describe('... SourceDescriptionComponent if', () => {
                        it('... fragment id is undefined', () => {
                            const descriptionDes = getAndExpectDebugElementByDirective(
                                compDe,
                                SourceDescriptionStubComponent,
                                1,
                                1
                            );
                            const descriptionCmp = descriptionDes[0].injector.get(
                                SourceDescriptionStubComponent
                            ) as SourceDescriptionStubComponent;

                            descriptionCmp.navigateToReportFragmentRequest.emit(undefined);

                            expectSpyCall(navigateToReportFragmentSpy, 1, undefined);
                        });

                        it('... fragment id is given', () => {
                            const descriptionDes = getAndExpectDebugElementByDirective(
                                compDe,
                                SourceDescriptionStubComponent,
                                1,
                                1
                            );
                            const descriptionCmp = descriptionDes[0].injector.get(
                                SourceDescriptionStubComponent
                            ) as SourceDescriptionStubComponent;

                            const expectedReportIds = {
                                complexId: expectedComplexId,
                                fragmentId: expectedReportFragment,
                            };

                            descriptionCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                            expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                        });
                    });

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

                            const expectedReportIds = {
                                complexId: expectedComplexId,
                                fragmentId: expectedReportFragment,
                            };

                            evaluationCmp.navigateToReportFragmentRequest.emit(expectedReportIds);

                            expectSpyCall(navigateToReportFragmentSpy, 1, expectedReportIds);
                        });
                    });
                });

                it('... should call `_navigateWithComplexId()` method with correct parameters', async () => {
                    const expectedReportIds = { complexId: expectedComplexId, fragmentId: expectedReportFragment };
                    const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                    const expectedNavigationExtras = {
                        fragment: expectedReportIds.fragmentId,
                    };

                    component.onReportFragmentNavigate(expectedReportIds);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedReportIds.complexId,
                        expectedReportRoute,
                        expectedNavigationExtras,
                    ]);
                });

                describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                    it('... fragment id is undefined', async () => {
                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: undefined };
                        const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedReportIds.complexId,
                            expectedReportRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is null', async () => {
                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: null };
                        const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedReportIds.complexId,
                            expectedReportRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedReportIds = { complexId: expectedComplexId, fragmentId: '' };
                        const expectedReportRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                        const expectedNavigationExtras = {
                            fragment: '',
                        };

                        component.onReportFragmentNavigate(expectedReportIds);
                        await detectChangesOnPush(fixture);

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

                it('... should call `_navigateWithComplexId()` method with correct parameters', async () => {
                    const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedReportFragment };
                    const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                    const expectedNavigationExtras = {
                        queryParams: { id: expectedSheetIds.sheetId },
                    };

                    component.onSvgSheetSelect(expectedSheetIds);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(navigateWithComplexIdSpy, 1, [
                        expectedSheetIds.complexId,
                        expectedSheetsRoute,
                        expectedNavigationExtras,
                    ]);
                });

                describe('... should call `_navigateWithComplexId()` method with empty fragment id if', () => {
                    it('... fragment id is undefined', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: undefined };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is null', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: null };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });
                });

                describe('... should call `_navigateWithComplexId()` method with undefined complex id if', () => {
                    it('... introIds are undefined', async () => {
                        const expectedSheetIds = undefined;

                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... introIds are null', async () => {
                        const expectedSheetIds = null;

                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            undefined,
                            expectedSheetsRoute,
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... fragment id is empty string', async () => {
                        const expectedSheetIds = { complexId: expectedComplexId, sheetId: '' };
                        const expectedSheetsRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                        const expectedNavigationExtras = {
                            queryParams: { id: '' },
                        };

                        component.onSvgSheetSelect(expectedSheetIds);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedSheetIds.complexId,
                            expectedSheetsRoute,
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
                    it('... complex id is undefined', async () => {
                        const expectedComplexRoute = expectedComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            undefined,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        await detectChangesOnPush(fixture);

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

                    it('... complex id is null', async () => {
                        const expectedComplexRoute = expectedComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(null, expectedTargetRoute, expectedNavigationExtras);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            null,
                            expectedTargetRoute,
                            expectedNavigationExtras,
                        ]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... complex id is empty string', async () => {
                        const expectedComplexRoute = expectedComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId('', expectedTargetRoute, expectedNavigationExtras);
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, ['', expectedTargetRoute, expectedNavigationExtras]);
                        expectSpyCall(navigationSpy, 1, [
                            [expectedComplexRoute, expectedTargetRoute],
                            expectedNavigationExtras,
                        ]);
                    });

                    it('... complex id is equal to the current complex id', async () => {
                        const expectedComplexRoute = expectedComplexBaseRoute;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedComplex.complexId.route.replace('/', ''),
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        await detectChangesOnPush(fixture);

                        expectSpyCall(navigateWithComplexIdSpy, 1, [
                            expectedComplex.complexId.route.replace('/', ''),
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
                    it('... complex id is given and not equal to the current complex id', async () => {
                        const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                        const expectedTargetRoute = 'targetRoute';
                        const expectedNavigationExtras = { fragment: '' };

                        (component as any)._navigateWithComplexId(
                            expectedNextComplexId,
                            expectedTargetRoute,
                            expectedNavigationExtras
                        );
                        await detectChangesOnPush(fixture);

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
                    describe('... should navigate within same complex to a given report route', () => {
                        it('... with a given report fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given report fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: '' };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                        it('... with a given sheet id', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given sheet id', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                    describe('... should navigate to series overview if selectedComplex is null', () => {
                        let expectedRSeriesRoute: string;
                        beforeEach(() => {
                            expectedRSeriesRoute = '/edition/series';
                            editionStateService.updateSelectedEditionComplex(null);
                        });

                        it('... with a given sheet id', async () => {
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

                            expectSpyCall(navigateWithComplexIdSpy, 1, [
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras,
                            ]);
                            expectSpyCall(navigationSpy, 1, [
                                [expectedRSeriesRoute, expectedTargetRoute],
                                expectedNavigationExtras,
                            ]);
                        });

                        it('... with a given report fragment', async () => {
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

                            expectSpyCall(navigateWithComplexIdSpy, 1, [
                                undefined,
                                expectedTargetRoute,
                                expectedNavigationExtras,
                            ]);
                            expectSpyCall(navigationSpy, 1, [
                                [expectedRSeriesRoute, expectedTargetRoute],
                                expectedNavigationExtras,
                            ]);
                        });
                    });
                });

                describe('... with the current edition complex id given', () => {
                    describe('... should navigate within same complex to a given report route', () => {
                        it('... with a given report fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given report fragment', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: '' };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                        it('... with a given sheet id', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given sheet id', async () => {
                            const expectedComplexRoute = expectedComplexBaseRoute;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                expectedComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                    describe('... should navigate to a given report route of another complex', () => {
                        it('... with a given report fragment', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: expectedReportFragment };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given report fragment', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_REPORT.route;
                            const expectedNavigationExtras = { fragment: '' };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
                        it('... with a given sheet id', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: expectedSvgSheet.id } };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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

                        it('... without a given sheet id', async () => {
                            const expectedNextComplexRoute = `/edition/complex/${expectedNextComplexId}`;
                            const expectedTargetRoute = EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route;
                            const expectedNavigationExtras = { queryParams: { id: '' } };

                            (component as any)._navigateWithComplexId(
                                expectedNextComplexId,
                                expectedTargetRoute,
                                expectedNavigationExtras
                            );
                            await detectChangesOnPush(fixture);

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
});
