/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import {
    EditionSvgSheet,
    SourceDescriptionList,
    SourceEvaluationList,
    SourceList,
} from '@awg-views/edition-view/models';

import { SourcesComponent } from './sources.component';

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

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;

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

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
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
            it('should not contain source list component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 0, 0);
            });

            it('should not contain source description component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 0, 0);
            });

            it('should not contain source evaluation component (stubbed)', () => {
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
            it('should contain source list component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceListStubComponent, 1, 1);
            });

            it('should contain source description component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceDescriptionStubComponent, 1, 1);
            });

            it('should contain source evaluation component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, SourceEvaluationStubComponent, 1, 1);
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
