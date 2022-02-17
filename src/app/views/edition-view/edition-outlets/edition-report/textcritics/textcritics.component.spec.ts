import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { expectClosedPanelBody, expectOpenPanelBody } from '@testing/accordion-panel-helper';
import { click, clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EditionSvgSheet, TextcriticsList } from '@awg-views/edition-view/models';

import { TextcriticsComponent } from './textcritics.component';

// Mock critics list component
@Component({ selector: 'awg-critics-list', template: '' })
class CriticsListStubComponent {
    @Input()
    textcriticsData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('TextcriticsComponent', () => {
    let component: TextcriticsComponent;
    let fixture: ComponentFixture<TextcriticsComponent>;
    let compDe: DebugElement;

    let expectedTextcriticsData: TextcriticsList;
    let expectedModalSnippet: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedPanelId: string;

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
                declarations: [TextcriticsComponent, CriticsListStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(TextcriticsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedTextcriticsData = {
            textcritics: [
                {
                    id: 'test-1',
                    label: 'test1',
                    description: ['test description'],
                    comments: [],
                },
                {
                    id: 'test-2',
                    label: 'test2',
                    description: [],
                    comments: [
                        {
                            measure: '10',
                            system: '12',
                            position: '1. Note',
                            comment: 'Viertelnote überschreibt Halbe Note.',
                        },
                        {
                            measure: '10',
                            system: '12',
                            position: '2. Note',
                            comment:
                                "Modal click: <a (click)=\"ref.openModal('OP12_SHEET_COMING_SOON'); SVG Sheet select: <a (click)=\"ref.selectSvgSheet('Aa:SkI/3')\">Aa:SkI/3</a>",
                        },
                    ],
                },
            ],
        };
        expectedSvgSheet = {
            id: 'Aa:SkI/2',
            svg: 'assets/img/edition/series1/section5/op12/SkI_2n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_2_small.jpg',
            alt: 'Aa:SkI/2',
            convolute: 'A',
        };
        expectedNextSvgSheet = {
            id: 'Aa:SkI/3',
            svg: 'assets/img/edition/series1/section5/op12/SkI_3n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_3_small.jpg',
            alt: 'Aa:SkI/3',
            convolute: 'A',
        };
        expectedModalSnippet = 'OP12_SHEET_COMING_SOON';
        expectedPanelId = 'awg-tka-panel';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have textcriticsData', () => {
            expect(component.textcriticsData).withContext('should be undefined').toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });

            it('... should not contain critics list component (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, CriticsListStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.textcriticsData = expectedTextcriticsData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have textcriticsData', () => {
            expect(component.textcriticsData).toBeTruthy();
            expect(component.textcriticsData)
                .withContext(`should be ${expectedTextcriticsData}`)
                .toBe(expectedTextcriticsData);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with one panel (div.card)', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1);
            });

            it('... should contain one ngb-panel element (div.card) with header but no body (closed)', () => {
                // Panel debug elements
                const panelDes = getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);

                // Header debug elements
                getAndExpectDebugElementByCss(panelDes[0], 'div.card-header', 1, 1, 'in first panel');

                // Body debug elements
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div.card-header > div > div.card-body',
                    0,
                    0,
                    'in first panel'
                );
            });

            it('... should render title in panel header (div.card-header)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                // Header
                const headerDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-tka-panel-header.card-header',
                    1,
                    1
                );

                // Header Buttons
                const buttonDes = getAndExpectDebugElementByCss(headerDes[0], 'div > button', 1, 1);

                const buttonCmp = buttonDes[0].nativeElement;

                const expectedTitle = 'II. Textkritischer Kommentar';

                expect(buttonCmp.textContent).withContext('should be defined').toBeDefined();
                expect(buttonCmp.textContent.trim())
                    .withContext(`should be ${expectedTitle.trim()}`)
                    .toBe(expectedTitle.trim());
            });

            it('... should open and close panel on click', fakeAsync(() => {
                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 1, 1);

                // Button debug elements
                const buttonDes = getAndExpectDebugElementByCss(
                    panelHeaderDes[0],
                    'button.btn-link',
                    1,
                    1,
                    'in first panel'
                );

                // Both panels closed first by default
                expectClosedPanelBody(compDe, expectedPanelId, 'panel closed');

                // Click panel to open it
                clickAndAwaitChanges(buttonDes[0], fixture);

                expectOpenPanelBody(compDe, expectedPanelId, 'panel open');

                // Click panel again to close it
                clickAndAwaitChanges(buttonDes[0], fixture);

                expectClosedPanelBody(compDe, expectedPanelId, 'panel closed');
            }));

            describe('... should render panel content (div.card-body)', () => {
                beforeEach(async () => {
                    // Click button to open panel and get inner content
                    // Button debug elements
                    const buttonDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card > div.card-header button.btn-link',
                        1,
                        1
                    );

                    // Button's native element to click on
                    const buttonEl = buttonDes[0].nativeElement;

                    // Open panel
                    click(buttonEl as HTMLElement);
                    await detectChangesOnPush(fixture);

                    expectOpenPanelBody(compDe, expectedPanelId, 'should have open panel');
                });

                describe('CriticsListComponent', () => {
                    it('... should contain one CriticsListComponent (stubbed) in the panel body (div.card-body)', () => {
                        // Ngb-accordion panel debug element
                        const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                        const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                        getAndExpectDebugElementByDirective(bodyDes[0], CriticsListStubComponent, 1, 1);
                    });

                    it('... should pass down textcriticsData to the CriticsListComponent', () => {
                        const criticsListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            CriticsListStubComponent,
                            1,
                            1
                        );
                        const criticsListCmp = criticsListDes[0].injector.get(
                            CriticsListStubComponent
                        ) as CriticsListStubComponent;

                        expect(criticsListCmp.textcriticsData).toBeTruthy();
                        expect(criticsListCmp.textcriticsData)
                            .withContext(`should equal ${expectedTextcriticsData}`)
                            .toEqual(expectedTextcriticsData);
                    });
                });
            });
        });

        describe('#openModal', () => {
            describe('... should trigger on event from', () => {
                describe('... CriticsListComponent if', () => {
                    beforeEach(async () => {
                        // Click button to open panel and get inner content
                        // Button debug elements
                        const buttonDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.card > div.card-header button.btn-link',
                            1,
                            1
                        );

                        // Button's native element to click on
                        const buttonEl = buttonDes[0].nativeElement;

                        // Open panel
                        click(buttonEl as HTMLElement);
                        await detectChangesOnPush(fixture);

                        expectOpenPanelBody(compDe, expectedPanelId, 'should have open panel');
                    });

                    it('... modal snippet is undefined', () => {
                        const criticsListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            CriticsListStubComponent,
                            1,
                            1
                        );
                        const criticsListCmp = criticsListDes[0].injector.get(
                            CriticsListStubComponent
                        ) as CriticsListStubComponent;

                        criticsListCmp.openModalRequest.emit(undefined);

                        expectSpyCall(openModalSpy, 1, undefined);
                    });

                    it('... modal snippet is given', () => {
                        const criticsListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            CriticsListStubComponent,
                            1,
                            1
                        );
                        const criticsListCmp = criticsListDes[0].injector.get(
                            CriticsListStubComponent
                        ) as CriticsListStubComponent;

                        criticsListCmp.openModalRequest.emit(expectedModalSnippet);

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
                describe('... CriticsListComponent if', () => {
                    beforeEach(async () => {
                        // Click button to open panel and get inner content
                        // Button debug elements
                        const buttonDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.card > div.card-header button.btn-link',
                            1,
                            1
                        );

                        // Button's native element to click on
                        const buttonEl = buttonDes[0].nativeElement;

                        // Open panel
                        click(buttonEl as HTMLElement);
                        await detectChangesOnPush(fixture);

                        expectOpenPanelBody(compDe, expectedPanelId, 'should have open panel');
                    });

                    it('... svg sheet id is undefined', () => {
                        const criticsListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            CriticsListStubComponent,
                            1,
                            1
                        );
                        const criticsListCmp = criticsListDes[0].injector.get(
                            CriticsListStubComponent
                        ) as CriticsListStubComponent;

                        criticsListCmp.selectSvgSheetRequest.emit(undefined);

                        expectSpyCall(selectSvgSheetSpy, 1, undefined);
                    });

                    it('... svg sheet id is given', () => {
                        const criticsListDes = getAndExpectDebugElementByDirective(
                            compDe,
                            CriticsListStubComponent,
                            1,
                            1
                        );
                        const criticsListCmp = criticsListDes[0].injector.get(
                            CriticsListStubComponent
                        ) as CriticsListStubComponent;

                        criticsListCmp.selectSvgSheetRequest.emit(expectedSvgSheet.id);

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
