import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import Spy = jasmine.Spy;

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';
import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { Folio, EditionSvgSheet, FolioConvoluteList, FolioConvolute } from '@awg-views/edition-view/models';
import { EditionConvoluteComponent } from './edition-convolute.component';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';

interface IFolioLegend {
    color: string;
    label: string;
}

@Component({ selector: 'awg-edition-folio', template: '' })
class FolioStubComponent {
    @Input()
    selectedConvolute: FolioConvolute;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
}

describe('EditionConvoluteComponent (DONE)', () => {
    let component: EditionConvoluteComponent;
    let fixture: ComponentFixture<EditionConvoluteComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectConvoluteSpy: Spy;
    let selectConvoluteRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedFolioLegends: IFolioLegend[];
    let expectedFolioConvoluteData: FolioConvoluteList;
    let expectedSelectedConvolute: FolioConvolute;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;

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
                imports: [FontAwesomeModule, NgbAccordionWithConfigModule],
                declarations: [EditionConvoluteComponent, FolioStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedFolioLegends = [
            {
                color: 'olivedrab',
                label: 'aktuell ausgewählt',
            },
            {
                color: 'orange',
                label: 'auswählbar',
            },
            {
                color: 'grey',
                label: '(momentan noch) nicht auswählbar',
            },
        ];

        expectedFolioConvoluteData = {
            convolutes: [
                {
                    convoluteId: 'Test convolute A',
                    folios: [
                        {
                            folioId: '1',
                            systems: '12',
                            format: {
                                height: 180,
                                width: 267,
                            },
                            content: [
                                {
                                    sigle: 'Aa:SkI/1a',
                                    measure: '1–2, [3–6]',
                                    selectable: false,
                                    linkTo: 'OP12_SOURCE_NOT_A',
                                    sectionPartition: 1,
                                    sections: [
                                        {
                                            startSystem: 2,
                                            endSystem: 4,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    convoluteId: 'Test convolute B',
                    folios: [],
                    linkTo: 'OP12_SOURCE_NOT_A',
                },
            ],
        };

        expectedSelectedConvolute = expectedFolioConvoluteData.convolutes[0];

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

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectConvoluteSpy = spyOn(component, 'selectConvolute').and.callThrough();
        selectConvoluteRequestEmitSpy = spyOn(component.selectConvoluteRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have folioConvoluteData', () => {
            expect(component.folioConvoluteData).toBeUndefined('should be undefined');
        });

        it('should not have selectedConvolute', () => {
            expect(component.selectedConvolute).toBeUndefined('should be undefined');
        });

        it('should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined('should be undefined');
        });

        it('should have faSquare', () => {
            expect(component.faSquare).toBeDefined('should be defined');
            expect(component.faSquare).toBe(faSquare);
        });

        it('should have folioLegends', () => {
            expect(component.folioLegends).toBeDefined('should be defined');
            expect(component.folioLegends).toEqual(expectedFolioLegends);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });

            it('... should contain no FolioComponent (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, FolioStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.folioConvoluteData = expectedFolioConvoluteData;
            component.selectedConvolute = expectedSelectedConvolute;
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `folioConvoluteData` input', () => {
            expect(component.folioConvoluteData).toBeDefined('should be defined');
            expect(component.folioConvoluteData).toEqual(
                expectedFolioConvoluteData,
                `should equal ${expectedFolioConvoluteData}`
            );
        });

        it('should have `selectedConvolute` input', () => {
            expect(component.selectedConvolute).toBeDefined('should be defined');
            expect(component.selectedConvolute).toBe(expectedSelectedConvolute);
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeDefined('should be defined');
            expect(component.selectedSvgSheet).toBe(expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with one panel (div.card)', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 1, 1);
            });

            it('... should contain header title for the panel (div.card-header)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                // Panel
                const headerDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-convolute-view-header.card-header',
                    1,
                    1
                );
                const headerCmp = headerDes[0].nativeElement;

                const expectedTitle = 'Konvolutübersicht';

                expect(headerCmp.textContent).toBeDefined('should be defined');
                expect(headerCmp.textContent).toContain(expectedTitle, `should contain ${expectedTitle}`);
            });

            it('... should contain two divs and one FolioComponent (stubbed) in the panel body (div.card-body)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.card', 1, 1);

                const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.card-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-convolute-dropdown', 1, 1);
                getAndExpectDebugElementByDirective(bodyDes[0], FolioStubComponent, 1, 1);
                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-folio-legend', 1, 1);
            });

            it('... should pass down selectedConvolute to the FolioComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, FolioStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(FolioStubComponent) as FolioStubComponent;

                expect(folioCmp.selectedConvolute).toBeTruthy();
                expect(folioCmp.selectedConvolute).toEqual(
                    expectedSelectedConvolute,
                    `should equal ${expectedSelectedConvolute}`
                );
            });

            it('... should pass down selectedSvgSheet to the FolioComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, FolioStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(FolioStubComponent) as FolioStubComponent;

                expect(folioCmp.selectedSvgSheet).toBeTruthy();
                expect(folioCmp.selectedSvgSheet).toEqual(expectedSvgSheet, `should equal ${expectedSvgSheet}`);
            });

            it('... should contain one button link in the dropdown div', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'ngb-accordion > div.card div.awg-convolute-dropdown',
                    1,
                    1
                );

                const anchorDes = getAndExpectDebugElementByCss(dropdownDes[0], 'a#dropDownConvolutes.btn', 1, 1);
                const spanDes = getAndExpectDebugElementByCss(anchorDes[0], 'span', 1, 1);
                const spanCmp = spanDes[0].nativeElement;

                expect(spanCmp.textContent).toBeDefined();
                expect(spanCmp.textContent).toBe(
                    expectedSelectedConvolute.convoluteId,
                    `should be ${expectedSelectedConvolute.convoluteId}`
                );
            });

            it('... should contain another div with dropdown-item links in the dropdown div', () => {
                const dropdownDes = getAndExpectDebugElementByCss(
                    compDe,
                    'ngb-accordion > div.card div.awg-convolute-dropdown',
                    1,
                    1
                );

                const anchorDes = getAndExpectDebugElementByCss(
                    dropdownDes[0],
                    'div > a.awg-convolute-dropdown-item',
                    expectedFolioConvoluteData.convolutes.length,
                    expectedFolioConvoluteData.convolutes.length
                );
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0.textContent).toBeDefined();
                expect(anchorCmp0.textContent).toBe(
                    expectedFolioConvoluteData.convolutes[0].convoluteId,
                    `should be ${expectedFolioConvoluteData.convolutes[0].convoluteId}`
                );

                expect(anchorCmp1.textContent).toBeDefined();
                expect(anchorCmp1.textContent).toBe(
                    expectedFolioConvoluteData.convolutes[1].convoluteId,
                    `should be ${expectedFolioConvoluteData.convolutes[1].convoluteId}`
                );
            });

            it('... should contain three legend labels in the folio legend div', () => {
                const legendDes = getAndExpectDebugElementByCss(
                    compDe,
                    'ngb-accordion > div.card div.awg-folio-legend',
                    1,
                    1
                );

                const spanDes = getAndExpectDebugElementByCss(legendDes[0], 'span', 3, 3);
                const spanCmp0 = spanDes[0].nativeElement;
                const spanCmp1 = spanDes[1].nativeElement;
                const spanCmp2 = spanDes[2].nativeElement;

                expect(spanCmp0.className).toBeDefined();
                expect(spanCmp0.className).toBe(
                    expectedFolioLegends[0].color,
                    `should be ${expectedFolioLegends[0].color}`
                );
                expect(spanCmp0.textContent).toBeDefined();
                expect(spanCmp0.textContent).toContain(
                    expectedFolioLegends[0].label,
                    `should contain ${expectedFolioLegends[0].label}`
                );

                expect(spanCmp1.className).toBeDefined();
                expect(spanCmp1.className).toBe(
                    expectedFolioLegends[1].color,
                    `should be ${expectedFolioLegends[1].color}`
                );
                expect(spanCmp1.textContent).toBeDefined();
                expect(spanCmp1.textContent).toContain(
                    expectedFolioLegends[1].label,
                    `should contain ${expectedFolioLegends[1].label}`
                );

                expect(spanCmp2.className).toBeDefined();
                expect(spanCmp2.className).toBe(
                    expectedFolioLegends[2].color,
                    `should be ${expectedFolioLegends[2].color}`
                );
                expect(spanCmp2.textContent).toBeDefined();
                expect(spanCmp2.textContent).toContain(
                    expectedFolioLegends[2].label,
                    `should contain ${expectedFolioLegends[2].label}`
                );
            });
        });

        describe('#openModal', () => {
            it('... should trigger on openModalRequest event from FolioComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, FolioStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(FolioStubComponent) as FolioStubComponent;

                folioCmp.openModalRequest.emit(expectedFolioConvoluteData.convolutes[1].linkTo);

                expectSpyCall(openModalSpy, 1, expectedFolioConvoluteData.convolutes[0].linkTo);
            });

            it('... should not emit anything if no id is provided', () => {
                component.openModal(undefined);

                expectSpyCall(openModalRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedFolioConvoluteData.convolutes[1].linkTo);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedFolioConvoluteData.convolutes[1].linkTo);
            });
        });

        describe('#selectConvolute', () => {
            it('... should trigger on click', fakeAsync(() => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'a.awg-convolute-dropdown-item', 2, 2);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(selectConvoluteSpy, 1, expectedFolioConvoluteData.convolutes[0].convoluteId);

                // Click second dropdown anchor
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(selectConvoluteSpy, 2, expectedFolioConvoluteData.convolutes[1].convoluteId);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.selectConvolute(undefined);

                expectSpyCall(selectConvoluteRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected convolute', () => {
                component.selectConvolute(expectedFolioConvoluteData.convolutes[0].convoluteId);

                expectSpyCall(selectConvoluteRequestEmitSpy, 1, expectedFolioConvoluteData.convolutes[0].convoluteId);

                // Emit another id
                component.selectConvolute(expectedFolioConvoluteData.convolutes[1].convoluteId);

                expectSpyCall(selectConvoluteRequestEmitSpy, 2, expectedFolioConvoluteData.convolutes[1].convoluteId);
            });
        });

        describe('#selectSvgSheet', () => {
            it('... should trigger on selectSvgSheetRequest event from FolioComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, FolioStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(FolioStubComponent) as FolioStubComponent;

                folioCmp.selectSvgSheetRequest.emit(expectedFolioConvoluteData.convolutes[0].convoluteId);

                expectSpyCall(selectSvgSheetSpy, 1, expectedFolioConvoluteData.convolutes[0].convoluteId);
            });

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
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
