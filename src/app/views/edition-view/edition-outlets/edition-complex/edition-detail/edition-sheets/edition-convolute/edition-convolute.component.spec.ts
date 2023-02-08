import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { EditionSvgSheet, FolioConvolute, FolioConvoluteList } from '@awg-views/edition-view/models';
import { EditionConvoluteComponent } from './edition-convolute.component';

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
    @NgModule({ imports: [NgbAccordionModule, NgbDropdownModule], exports: [NgbAccordionModule, NgbDropdownModule] })
    class NgbConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbConfigModule],
            declarations: [EditionConvoluteComponent, FolioStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;
        expectedFolioConvoluteData = mockEditionData.mockFolioConvoluteData;
        expectedSelectedConvolute = expectedFolioConvoluteData.convolutes[0];

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
        it('should not have folioConvoluteData', () => {
            expect(component.folioConvoluteData).toBeUndefined();
        });

        it('should not have selectedConvolute', () => {
            expect(component.selectedConvolute).toBeUndefined();
        });

        it('should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('should have faSquare', () => {
            expect(component.faSquare).toBeDefined();
            expect(component.faSquare).withContext(`should be faSquare`).toBe(faSquare);
        });

        it('should have folioLegends', () => {
            expect(component.folioLegends).toBeDefined();
            expect(component.folioLegends)
                .withContext(`should equal ${expectedFolioLegends}`)
                .toEqual(expectedFolioLegends);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.accordion-item) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 0, 0, 'yet');
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
            expect(component.folioConvoluteData).toBeDefined();
            expect(component.folioConvoluteData)
                .withContext(`should equal ${expectedFolioConvoluteData}`)
                .toEqual(expectedFolioConvoluteData);
        });

        it('should have `selectedConvolute` input', () => {
            expect(component.selectedConvolute).toBeDefined();
            expect(component.selectedConvolute)
                .withContext(`should be ${expectedSelectedConvolute}`)
                .toBe(expectedSelectedConvolute);
        });

        it('should have `selectedSvgSheet` input', () => {
            expect(component.selectedSvgSheet).toBeDefined();
            expect(component.selectedSvgSheet).withContext(`should be ${expectedSvgSheet}`).toBe(expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with one panel (div.accordion-item)', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
            });

            it('... should contain header title for the panel (div.accordion-header)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                // Panel
                const headerDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-convolute-view-header.accordion-header',
                    1,
                    1
                );
                const headerCmp = headerDes[0].nativeElement;

                const expectedTitle = 'Konvolutübersicht';

                expect(headerCmp.textContent).toBeDefined();
                expect(headerCmp.textContent.trim()).withContext(`should be ${expectedTitle}`).toBe(expectedTitle);
            });

            it('... should contain two divs and one FolioComponent (stubbed) in the panel body (div.accordion-body)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.accordion-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-convolute-dropdown', 1, 1);
                getAndExpectDebugElementByDirective(bodyDes[0], FolioStubComponent, 1, 1);
                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-folio-legend', 1, 1);
            });

            it('... should pass down selectedConvolute to the FolioComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, FolioStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(FolioStubComponent) as FolioStubComponent;

                expect(folioCmp.selectedConvolute).toBeTruthy();
                expect(folioCmp.selectedConvolute)
                    .withContext(`should equal ${expectedSelectedConvolute}`)
                    .toEqual(expectedSelectedConvolute);
            });

            it('... should pass down selectedSvgSheet to the FolioComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, FolioStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(FolioStubComponent) as FolioStubComponent;

                expect(folioCmp.selectedSvgSheet).toBeTruthy();
                expect(folioCmp.selectedSvgSheet)
                    .withContext(`should equal ${expectedSvgSheet}`)
                    .toEqual(expectedSvgSheet);
            });

            it('... should contain one dropdown-toggle link in the dropdown div', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                const dropdownDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div.accordion-body > div.awg-convolute-dropdown.dropdown',
                    1,
                    1
                );

                const anchorDes = getAndExpectDebugElementByCss(dropdownDes[0], 'a.dropdown-toggle', 1, 1);

                const spanDes = getAndExpectDebugElementByCss(anchorDes[0], 'span', 1, 1);
                const spanCmp = spanDes[0].nativeElement;

                expect(spanCmp.textContent).toBeDefined();
                expect(spanCmp.textContent)
                    .withContext(`should be ${expectedSelectedConvolute.convoluteLabel}`)
                    .toBe(expectedSelectedConvolute.convoluteLabel);
            });

            it('... should contain a dropdown-menu with dropdown-item links in the dropdown div', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                const dropdownDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div.accordion-body > div.awg-convolute-dropdown.dropdown',
                    1,
                    1
                );

                const divDes = getAndExpectDebugElementByCss(dropdownDes[0], 'div.dropdown-menu', 1, 1);

                const anchorDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'a.dropdown-item',
                    expectedFolioConvoluteData.convolutes.length,
                    expectedFolioConvoluteData.convolutes.length
                );
                const anchorCmp0 = anchorDes[0].nativeElement;
                const anchorCmp1 = anchorDes[1].nativeElement;

                expect(anchorCmp0.textContent).toBeDefined();
                expect(anchorCmp0.textContent)
                    .withContext(`should be ${expectedFolioConvoluteData.convolutes[0].convoluteLabel}`)
                    .toBe(expectedFolioConvoluteData.convolutes[0].convoluteLabel);

                expect(anchorCmp1.textContent).toBeDefined();
                expect(anchorCmp1.textContent)
                    .withContext(`should be ${expectedFolioConvoluteData.convolutes[1].convoluteLabel}`)
                    .toBe(expectedFolioConvoluteData.convolutes[1].convoluteLabel);
            });

            it('... should contain three legend labels in the folio legend div', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                const legendDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div.accordion-body > div.awg-folio-legend',
                    1,
                    1
                );

                const spanDes = getAndExpectDebugElementByCss(legendDes[0], 'span', 3, 3);
                const spanCmp0 = spanDes[0].nativeElement;
                const spanCmp1 = spanDes[1].nativeElement;
                const spanCmp2 = spanDes[2].nativeElement;

                expect(spanCmp0.className).toBeDefined();
                expect(spanCmp0.className)
                    .withContext(`should be ${expectedFolioLegends[0].color}`)
                    .toBe(expectedFolioLegends[0].color);
                expect(spanCmp0.textContent).toBeDefined();
                expect(spanCmp0.textContent.trim())
                    .withContext(`should be ${expectedFolioLegends[0].label}`)
                    .toBe(expectedFolioLegends[0].label);

                expect(spanCmp1.className).toBeDefined();
                expect(spanCmp1.className)
                    .withContext(`should be ${expectedFolioLegends[1].color}`)
                    .toBe(expectedFolioLegends[1].color);
                expect(spanCmp1.textContent).toBeDefined();
                expect(spanCmp1.textContent.trim())
                    .withContext(`should be ${expectedFolioLegends[1].label}`)
                    .toBe(expectedFolioLegends[1].label);

                expect(spanCmp2.className).toBeDefined();
                expect(spanCmp2.className)
                    .withContext(`should be ${expectedFolioLegends[2].color}`)
                    .toBe(expectedFolioLegends[2].color);
                expect(spanCmp2.textContent).toBeDefined();
                expect(spanCmp2.textContent.trim())
                    .withContext(`should be ${expectedFolioLegends[2].label}`)
                    .toBe(expectedFolioLegends[2].label);
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
