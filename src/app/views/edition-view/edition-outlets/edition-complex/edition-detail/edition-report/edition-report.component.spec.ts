import { DebugElement, inject as inject_1, isSignal, NgModule, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { createMockViewData } from '@testing/edition-data-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { ModalService } from '@awg-shared/modal/modal.service';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import {
    EditionDataAssetsError,
    EditionViewData,
    EditionViewDataContent,
} from '@awg-views/edition-view/models/edition-data.model';
import { SourceDescList } from '@awg-views/edition-view/models/source-desc.model';
import { SourceEvaluationList } from '@awg-views/edition-view/models/source-evaluation.model';
import { SourceList } from '@awg-views/edition-view/models/source-list.model';
import { TextcriticsList } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionReportComponent } from './edition-report.component';
import { SourceDescComponent } from './source-desc/source-desc.component';
import { SourceEvaluationComponent } from './source-evaluation/source-evaluation.component';
import { SourceListComponent } from './source-list/source-list.component';
import { TextcriticsListComponent } from './textcritics-list/textcritics-list.component';

describe('EditionReportComponent', () => {
    let component: EditionReportComponent;
    let fixture: ComponentFixture<EditionReportComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let mockViewDataSignal: WritableSignal<EditionViewData<'report'>>;
    let expectedViewDataContent: EditionViewDataContent<'report'>;
    let expectedDefaultViewDataContent: EditionViewDataContent<'report'>;
    let expectedSourceListData: SourceList;
    let expectedSourceDescListData: SourceDescList;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedTextcriticsListData: TextcriticsList;
    let expectedComplex: EditionComplex;
    let expectedComplexId: string;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbConfigModule {
        constructor() {
            const config = inject_1(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewDataContent = {
            sourceListData: new SourceList(),
            sourceDescData: new SourceDescList(),
            sourceEvaluationData: new SourceEvaluationList(),
            textcriticsData: new TextcriticsList(),
        };
        mockViewDataSignal = signal(createMockViewData(expectedDefaultViewDataContent));

        await TestBed.configureTestingModule({
            imports: [EditionReportComponent, NgbConfigModule],
            providers: [
                { provide: EditionViewService, useValue: { reportViewData: mockViewDataSignal.asReadonly() } },
                {
                    provide: EditionNavigationService,
                    useValue: { navigateToSvgSheet: vi.fn(), navigateToReportFragment: vi.fn() },
                },
                { provide: ModalService, useValue: { open: vi.fn() } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Test data
        expectedSourceListData = structuredClone(mockEditionData.mockSourceListData);
        expectedSourceDescListData = structuredClone(mockEditionData.mockSourceDescListData);
        expectedSourceEvaluationListData = structuredClone(mockEditionData.mockSourceEvaluationListData);
        expectedTextcriticsListData = structuredClone(mockEditionData.mockTextcriticsListData);

        expectedComplexId = 'op12';
        expectedComplex = EditionStateHelper.getComplex(expectedComplexId);

        // Create component fixture
        fixture = TestBed.createComponent(EditionReportComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
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

            it('... should contain no AlertErrorComponent', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
            });

            it('... should contain no TwelveToneSpinnerComponent', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);

                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
            });

            it('... should contain no div.accordion yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });

            it('... should contain no source list component yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListComponent, 0, 0);
            });

            it('... should contain no source description component yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescComponent, 0, 0);
            });

            it('... should contain no source evaluation component yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationComponent, 0, 0);
            });

            it('... should contain no textcritics list component yet', () => {
                getAndExpectDebugElementByDirective(compDe, TextcriticsListComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the service setting the complex
            editionStateService.updateSelectedEditionComplex(expectedComplex);
            expectedViewDataContent = {
                sourceListData: expectedSourceListData,
                sourceDescData: expectedSourceDescListData,
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
            it('... should render nothing if viewData is not available', async () => {
                mockViewDataSignal.set(null as any);

                await detectChangesOnPush(fixture);

                const divDes = getAndExpectDebugElementByCss(compDe, 'div', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], AlertErrorComponent, 0, 0);
                getAndExpectDebugElementByDirective(divDes[0], TwelveToneSpinnerComponent, 0, 0);
                getAndExpectDebugElementByCss(divDes[0], 'div.awg-edition-report-view', 0, 0);
            });

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

                it('... should not contain report view or spinner, but one AlertErrorComponent', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                });

                it('... should pass down error object to AlertErrorComponent', () => {
                    const alertErrorDes = getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 1, 1);
                    const alertErrorCmp = alertErrorDes[0].injector.get(AlertErrorComponent) as AlertErrorComponent;

                    expectToEqual(alertErrorCmp.errorObject(), expectedErrorObject);
                });
            });

            describe('on loading', () => {
                beforeEach(async () => {
                    // Mock loading state
                    mockViewDataSignal.set(
                        createMockViewData(expectedViewDataContent, {
                            isLoading: true,
                            error: null,
                        })
                    );

                    await detectChangesOnPush(fixture);
                });

                it('... should not contain sheets view or alert, but one TwelveToneSpinnerComponent', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 0, 0);
                    getAndExpectDebugElementByDirective(compDe, AlertErrorComponent, 0, 0);

                    getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                });

                it('... should have default spinnerText on TwelveToneSpinnerComponent', () => {
                    const spinnerDes = getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerComponent, 1, 1);
                    const spinnerCmp = spinnerDes[0].injector.get(
                        TwelveToneSpinnerComponent
                    ) as TwelveToneSpinnerComponent;

                    expectToBe(spinnerCmp.spinnerText(), 'loading');
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

                it('... should contain one div.awg-edition-report-view', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);
                });

                describe('... should render the accordion item, but no child component if data is missing:', () => {
                    it.each([
                        {
                            desc: 'sourceListData',
                            dataKey: 'sourceListData',
                            itemSelector: 'div#awg-source-list',
                            component: SourceListComponent,
                        },
                        {
                            desc: 'sourceDescData',
                            dataKey: 'sourceDescData',
                            itemSelector: 'div#awg-source-desc',
                            component: SourceDescComponent,
                        },
                        {
                            desc: 'sourceEvaluationData',
                            dataKey: 'sourceEvaluationData',
                            itemSelector: 'div#awg-source-evaluation',
                            component: SourceEvaluationComponent,
                        },
                        {
                            desc: 'textcriticsData',
                            dataKey: 'textcriticsData',
                            itemSelector: 'div#awg-tka-panel',
                            component: TextcriticsListComponent,
                        },
                    ] as const)('... $desc', async ({ dataKey, itemSelector, component: childComponent }) => {
                        mockViewDataSignal.set(
                            createMockViewData(
                                { ...expectedViewDataContent, [dataKey]: null },
                                { isLoading: false, error: null }
                            )
                        );
                        await detectChangesOnPush(fixture);

                        const itemDes = getAndExpectDebugElementByCss(compDe, itemSelector, 1, 1);

                        getAndExpectDebugElementByDirective(itemDes[0], childComponent, 0, 0);
                    });
                });

                describe('... source list', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-source-list', 1, 1);
                    });

                    it('... should contain one accordion button in div.awg-source-list', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.REPORT_TITLES.sourceList);
                    });

                    it('... should contain one source list component', () => {
                        getAndExpectDebugElementByDirective(divDes[0], SourceListComponent, 1, 1);
                    });

                    it('... should pass down sourceListData to SourceListComponent', () => {
                        const sourceListDes = getAndExpectDebugElementByDirective(divDes[0], SourceListComponent, 1, 1);
                        const sourceListCmp = sourceListDes[0].injector.get(SourceListComponent) as SourceListComponent;

                        expectToEqual(sourceListCmp.sourceListData(), expectedSourceListData);
                    });
                });

                describe('... source description', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-source-desc', 1, 1);
                    });

                    it('... should contain one accordion button in div.awg-source-desc', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.REPORT_TITLES.sourceDesc);
                    });

                    it('... should contain one source description component', () => {
                        getAndExpectDebugElementByDirective(compDe, SourceDescComponent, 1, 1);
                    });

                    it('... should pass down sourceDescListData to SourceDescComponent', () => {
                        const descriptionDes = getAndExpectDebugElementByDirective(compDe, SourceDescComponent, 1, 1);
                        const descriptionCmp = descriptionDes[0].injector.get(
                            SourceDescComponent
                        ) as SourceDescComponent;

                        expectToEqual(descriptionCmp.sourceDescListData(), expectedSourceDescListData);
                    });
                });

                describe('... source evaluation', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-source-evaluation', 1, 1);
                    });

                    it('... should contain one accordion button in div.awg-source-evaluation', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.REPORT_TITLES.sourceEvaluation);
                    });

                    it('... should contain one source evaluation component', () => {
                        getAndExpectDebugElementByDirective(compDe, SourceEvaluationComponent, 1, 1);
                    });

                    it('... should pass down sourceEvaluationListData and complex to SourceEvaluationComponent', () => {
                        const evaluationDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceEvaluationComponent,
                            1,
                            1
                        );
                        const evaluationCmp = evaluationDes[0].injector.get(
                            SourceEvaluationComponent
                        ) as SourceEvaluationComponent;

                        expectToEqual(evaluationCmp.sourceEvaluationListData(), expectedSourceEvaluationListData);
                        expectToEqual(evaluationCmp.editionComplex(), expectedComplex);
                    });
                });

                describe('... textcritics list', () => {
                    let divDes: DebugElement[];

                    beforeEach(() => {
                        const viewDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-report-view', 1, 1);

                        divDes = getAndExpectDebugElementByCss(viewDes[0], 'div#awg-tka-panel', 1, 1);
                    });

                    it('... should contain one accordion button in div.awg-tka-panel', () => {
                        getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                    });

                    it('... should display button label', () => {
                        const buttonDes = getAndExpectDebugElementByCss(divDes[0], 'button.accordion-button', 1, 1);
                        const buttonEl = buttonDes[0].nativeElement as HTMLButtonElement;

                        expectToBe(buttonEl.textContent?.trim(), component.REPORT_TITLES.tka);
                    });

                    it('... should contain one textcritics list component', () => {
                        getAndExpectDebugElementByDirective(compDe, TextcriticsListComponent, 1, 1);
                    });

                    it('... should pass down textcriticsListData to TextcriticsListComponent', () => {
                        const textcriticsDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TextcriticsListComponent,
                            1,
                            1
                        );
                        const textcriticsCmp = textcriticsDes[0].injector.get(
                            TextcriticsListComponent
                        ) as TextcriticsListComponent;

                        expectToEqual(textcriticsCmp.textcriticsListData(), expectedTextcriticsListData);
                    });
                });
            });
        });
    });
});
