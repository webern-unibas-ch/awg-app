/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import {
    EditionSvgSheet,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
} from '@awg-views/edition-view/models';

import { SourcesComponent } from './sources.component';
import { expectClosedPanelBody, expectOpenPanelBody } from '@testing/accordion-panel-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';

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

describe('SourcesComponent (DONE)', () => {
    let component: SourcesComponent;
    let fixture: ComponentFixture<SourcesComponent>;
    let compDe: DebugElement;

    let expectedSourceListData: SourceList;
    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedSourceEvaluationListData: SourceEvaluationList;
    let expectedFragment: string;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedPanelId: string;

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

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
            TestBed.configureTestingModule({
                imports: [NgbAccordionWithConfigModule],
                declarations: [
                    SourcesComponent,
                    SourceListStubComponent,
                    SourceDescriptionStubComponent,
                    SourceEvaluationStubComponent,
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SourcesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSourceListData = {
            sources: [
                {
                    siglum: 'A',
                    type: 'Skizzen',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    linkTo: 'sourceA',
                },
                {
                    siglum: 'B',
                    type: 'Autograph von Nr. I.',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    linkTo: 'OP12_SOURCE_NOT_A',
                },
                {
                    siglum: 'C',
                    type: 'Autograph von Nr. I–IV.',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    linkTo: 'OP12_SOURCE_NOT_A',
                },
            ],
        };
        expectedSourceDescriptionListData = {
            sources: [
                {
                    id: 'sourceA',
                    siglum: 'A',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    description: [],
                },
            ],
        };
        expectedSourceEvaluationListData = {
            sources: [
                {
                    id: 'op12',
                    content: ['Die Skizzen in A sind zum Testen da.'],
                },
            ],
        };
        expectedFragment = 'sourceA';
        expectedSvgSheet = {
            id: 'Aa:SkI/2',
            svg: 'assets/img/edition/series1/section5/op12/SkI_2n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_2_small.jpg',
            alt: 'Aa:SkI/2',
        };
        expectedNextSvgSheet = {
            id: 'Aa:SkI/3',
            svg: 'assets/img/edition/series1/section5/op12/SkI_3n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_3_small.jpg',
            alt: 'Aa:SkI/3',
        };
        expectedModalSnippet = 'OP12_SHEET_COMING_SOON';
        expectedPanelId = 'awg-sources-panel';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have sourceListData', () => {
            expect(component.sourceListData).withContext('should be undefined').toBeUndefined();
        });

        it('should not have sourceDescriptionListData', () => {
            expect(component.sourceDescriptionListData).withContext('should be undefined').toBeUndefined();
        });

        it('should not have sourceEvaluationListData', () => {
            expect(component.sourceEvaluationListData).withContext('should be undefined').toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });

            it('should not contain source list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 0, 0);
            });

            it('should not contain source description component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 0, 0);
            });

            it('should not contain source evaluation component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.sourceListData = expectedSourceListData;
            component.sourceDescriptionListData = expectedSourceDescriptionListData;
            component.sourceEvaluationListData = expectedSourceEvaluationListData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have sourceListData', () => {
            expect(component.sourceListData).toBeTruthy();
            expect(component.sourceListData)
                .withContext(`should be ${expectedSourceListData}`)
                .toBe(expectedSourceListData);
        });

        it('should have sourceDescriptionListData', () => {
            expect(component.sourceDescriptionListData).toBeTruthy();
            expect(component.sourceDescriptionListData)
                .withContext(`should be ${expectedSourceDescriptionListData}`)
                .toBe(expectedSourceDescriptionListData);
        });

        it('should have sourceEvaluationListData', () => {
            expect(component.sourceEvaluationListData).toBeTruthy();
            expect(component.sourceEvaluationListData)
                .withContext(`should be ${expectedSourceEvaluationListData}`)
                .toBe(expectedSourceEvaluationListData);
        });

        describe('VIEW', () => {
            it('... should contain one main ngb-accordion with one panel (div.card)', () => {
                getAndExpectDebugElementByCss(compDe, 'ngb-accordion#sourcesAcc', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(compDe, 'ngb-accordion#sourcesAcc > div.card', 1, 1);
            });

            describe('... main ngb-accordion (sourcesAcc)', () => {
                it('... should render title in outer panel header (div.card-header)', () => {
                    // Ngb-accordion panel debug element
                    const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion#sourcesAcc > div.card', 1, 1);

                    // Header
                    const headerDes = getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-sources-panel-header.card-header',
                        1,
                        1
                    );

                    // Header Buttons
                    const buttonDes = getAndExpectDebugElementByCss(headerDes[0], 'div > button', 1, 1);

                    const buttonCmp = buttonDes[0].nativeElement;

                    const expectedTitle = 'I. Quellen';

                    expect(buttonCmp.textContent).withContext('should be defined').toBeDefined();
                    expect(buttonCmp.textContent.trim())
                        .withContext(`should be ${expectedTitle.trim()}`)
                        .toBe(expectedTitle.trim());
                });

                it('... should open and close outer panel on click', fakeAsync(() => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ngb-accordion#sourcesAcc > div.card > div.card-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const buttonDes = getAndExpectDebugElementByCss(
                        panelHeaderDes[0],
                        'button.btn-link',
                        1,
                        1,
                        'in first panel'
                    );

                    // Panel opened first by default
                    expectOpenPanelBody(compDe, expectedPanelId, 'panel open');

                    // Click panel to close it
                    clickAndAwaitChanges(buttonDes[0], fixture);

                    expectClosedPanelBody(compDe, expectedPanelId, 'panel closed');

                    // Click panel again to open it
                    clickAndAwaitChanges(buttonDes[0], fixture);

                    expectOpenPanelBody(compDe, expectedPanelId, 'panel open');
                }));

                it('... should contain one sub ngb-accordion with three inner panels (div.card)', () => {
                    const outerAccDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion#sourcesAcc', 1, 1);

                    const innerAccDes = getAndExpectDebugElementByCss(
                        outerAccDes[0],
                        'ngb-accordion#sourcesPanelAcc',
                        1,
                        1
                    );

                    // Panel
                    getAndExpectDebugElementByCss(innerAccDes[0], 'ngb-accordion#sourcesPanelAcc > div.card', 3, 3);
                });

                describe('... sub ngb-accordion (sourcesPanelAcc)', () => {
                    let innerAccDes;

                    beforeEach(() => {
                        innerAccDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion#sourcesPanelAcc', 1, 1);
                    });

                    describe('... first inner panel', () => {
                        it('... should render title in panel header (div.card-header)', () => {
                            // Ngb-accordion panel debug element
                            const panelDes = getAndExpectDebugElementByCss(innerAccDes[0], 'div.card', 3, 3);

                            // First panel header
                            const headerDes = getAndExpectDebugElementByCss(
                                panelDes[0],
                                'div#awg-source-list-header.card-header',
                                1,
                                1
                            );

                            // Header Buttons
                            const buttonDes = getAndExpectDebugElementByCss(headerDes[0], 'div > button', 1, 1);

                            const buttonCmp = buttonDes[0].nativeElement;

                            const expectedTitle = '1. Quellenübersicht';

                            expect(buttonCmp.textContent).withContext('should be defined').toBeDefined();
                            expect(buttonCmp.textContent.trim())
                                .withContext(`should be ${expectedTitle.trim()}`)
                                .toBe(expectedTitle.trim());
                        });

                        it('... should open and close outer panel on click', fakeAsync(() => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                innerAccDes[0],
                                'div.card > div.card-header',
                                3,
                                3
                            );

                            // Button debug elements of first panel
                            const buttonDes = getAndExpectDebugElementByCss(
                                panelHeaderDes[0],
                                'button.btn-link',
                                1,
                                1,
                                'in first panel'
                            );

                            expectedPanelId = 'awg-source-list';

                            // Panel opened first by default
                            expectOpenPanelBody(innerAccDes[0], expectedPanelId, 'panel open');

                            // Click panel to close it
                            clickAndAwaitChanges(buttonDes[0], fixture);

                            expectClosedPanelBody(innerAccDes[0], expectedPanelId, 'panel closed');

                            // Click panel again to open it
                            clickAndAwaitChanges(buttonDes[0], fixture);

                            expectOpenPanelBody(innerAccDes[0], expectedPanelId, 'panel open');
                        }));

                        it('should contain source list component (stubbed)', () => {
                            getAndExpectDebugElementByDirective(innerAccDes[0], SourceListStubComponent, 1, 1);
                        });
                    });
                    describe('... second inner panel', () => {
                        it('... should render title in panel header (div.card-header)', () => {
                            // Ngb-accordion panel debug element
                            const panelDes = getAndExpectDebugElementByCss(innerAccDes[0], 'div.card', 3, 3);

                            // Second panel header
                            const headerDes = getAndExpectDebugElementByCss(
                                panelDes[1],
                                'div#awg-source-desc-header.card-header',
                                1,
                                1
                            );

                            // Header Buttons
                            const buttonDes = getAndExpectDebugElementByCss(headerDes[0], 'div > button', 1, 1);

                            const buttonCmp = buttonDes[0].nativeElement;

                            const expectedTitle = '2. Quellenbeschreibung';

                            expect(buttonCmp.textContent).withContext('should be defined').toBeDefined();
                            expect(buttonCmp.textContent.trim())
                                .withContext(`should be ${expectedTitle.trim()}`)
                                .toBe(expectedTitle.trim());
                        });

                        it('... should open and close outer panel on click', fakeAsync(() => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                innerAccDes[0],
                                'div.card > div.card-header',
                                3,
                                3
                            );

                            // Button debug elements of second panel
                            const buttonDes = getAndExpectDebugElementByCss(
                                panelHeaderDes[1],
                                'button.btn-link',
                                1,
                                1,
                                'in first panel'
                            );

                            expectedPanelId = 'awg-source-desc';

                            // Panel opened first by default
                            expectOpenPanelBody(innerAccDes[0], expectedPanelId, 'panel open');

                            // Click panel to close it
                            clickAndAwaitChanges(buttonDes[0], fixture);

                            expectClosedPanelBody(innerAccDes[0], expectedPanelId, 'panel closed');

                            // Click panel again to open it
                            clickAndAwaitChanges(buttonDes[0], fixture);

                            expectOpenPanelBody(innerAccDes[0], expectedPanelId, 'panel open');
                        }));

                        it('should contain source description component (stubbed)', () => {
                            getAndExpectDebugElementByDirective(innerAccDes[0], SourceDescriptionStubComponent, 1, 1);
                        });
                    });

                    describe('... third inner panel', () => {
                        it('... should render title in panel header (div.card-header)', () => {
                            // Ngb-accordion panel debug element
                            const panelDes = getAndExpectDebugElementByCss(innerAccDes[0], 'div.card', 3, 3);

                            // Third panel header
                            const headerDes = getAndExpectDebugElementByCss(
                                panelDes[2],
                                'div#awg-source-evaluation-header.card-header',
                                1,
                                1
                            );

                            // Header Buttons
                            const buttonDes = getAndExpectDebugElementByCss(headerDes[0], 'div > button', 1, 1);

                            const buttonCmp = buttonDes[0].nativeElement;

                            const expectedTitle = '3. Quellenbewertung';

                            expect(buttonCmp.textContent).withContext('should be defined').toBeDefined();
                            expect(buttonCmp.textContent.trim())
                                .withContext(`should be ${expectedTitle.trim()}`)
                                .toBe(expectedTitle.trim());
                        });

                        it('... should open and close outer panel on click', fakeAsync(() => {
                            // Header debug elements
                            const panelHeaderDes = getAndExpectDebugElementByCss(
                                innerAccDes[0],
                                'div.card > div.card-header',
                                3,
                                3
                            );

                            // Button debug elements of third panel
                            const buttonDes = getAndExpectDebugElementByCss(
                                panelHeaderDes[2],
                                'button.btn-link',
                                1,
                                1,
                                'in first panel'
                            );

                            expectedPanelId = 'awg-source-evaluation';

                            // Panel opened first by default
                            expectOpenPanelBody(innerAccDes[0], expectedPanelId, 'panel open');

                            // Click panel to close it
                            clickAndAwaitChanges(buttonDes[0], fixture);

                            expectClosedPanelBody(innerAccDes[0], expectedPanelId, 'panel closed');

                            // Click panel again to open it
                            clickAndAwaitChanges(buttonDes[0], fixture);

                            expectOpenPanelBody(innerAccDes[0], expectedPanelId, 'panel open');
                        }));

                        it('should contain source evaluation component (stubbed)', () => {
                            getAndExpectDebugElementByDirective(innerAccDes[0], SourceEvaluationStubComponent, 1, 1);
                        });
                    });
                });
            });
        });

        describe('#navigateToReportFragment', () => {
            describe('... should trigger on event from SourceEvaluationComponent if', () => {
                it('... fragment is undefined', () => {
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

                it('... fragment is given', () => {
                    const evaluationDes = getAndExpectDebugElementByDirective(
                        compDe,
                        SourceEvaluationStubComponent,
                        1,
                        1
                    );
                    const evaluationCmp = evaluationDes[0].injector.get(
                        SourceEvaluationStubComponent
                    ) as SourceEvaluationStubComponent;

                    evaluationCmp.navigateToReportFragmentRequest.emit(expectedFragment);

                    expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
                });
            });

            describe('... should not emit anything if', () => {
                it('... id is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is empty string', () => {
                    component.navigateToReportFragment('');

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment', () => {
                component.navigateToReportFragment(expectedFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedFragment);

                const otherFragment = 'sourceB';
                component.navigateToReportFragment(otherFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, otherFragment);
            });
        });

        describe('#openModal', () => {
            describe('... should trigger on event from', () => {
                describe('... SourceListComponent if', () => {
                    it('... modal snippet is undefined', () => {
                        const listDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                        const listCmp = listDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                        listCmp.openModalRequest.emit(undefined);

                        expectSpyCall(openModalSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const listDes = getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
                        const listCmp = listDes[0].injector.get(SourceListStubComponent) as SourceListStubComponent;

                        listCmp.openModalRequest.emit(expectedModalSnippet);

                        expectSpyCall(openModalSpy, 1, expectedModalSnippet);
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

                        expectSpyCall(openModalSpy, 1, undefined);
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

                        expectSpyCall(openModalSpy, 1, expectedModalSnippet);
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

                        expectSpyCall(openModalSpy, 1, undefined);
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

                        expectSpyCall(openModalSpy, 1, expectedModalSnippet);
                    });
                });
            });

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, null);
                });
                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet', () => {
            describe('... should trigger on event from', () => {
                describe('... SourceDescriptionComponent if', () => {
                    it('... svg sheet id is undefined', () => {
                        const descriptinDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptinDes[0].injector.get(
                            SourceDescriptionStubComponent
                        ) as SourceDescriptionStubComponent;

                        descriptionCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... svg sheet id is given', () => {
                        const descriptinDes = getAndExpectDebugElementByDirective(
                            compDe,
                            SourceDescriptionStubComponent,
                            1,
                            1
                        );
                        const descriptionCmp = descriptinDes[0].injector.get(
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
            });

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.selectSvgSheet(undefined);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
                it('... id is null', () => {
                    component.selectSvgSheet(null);

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
                it('... id is empty string', () => {
                    component.selectSvgSheet('');

                    expectSpyCall(selectSvgSheetRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSvgSheet.id);

                component.selectSvgSheet(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSvgSheet.id);
            });
        });
    });
});
