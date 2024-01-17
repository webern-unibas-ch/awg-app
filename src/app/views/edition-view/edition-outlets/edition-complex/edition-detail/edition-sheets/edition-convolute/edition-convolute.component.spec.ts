import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionSvgSheet, FolioConvolute } from '@awg-views/edition-view/models';

import { EditionConvoluteComponent } from './edition-convolute.component';

interface IFolioLegend {
    color: string;
    label: string;
}

@Component({ selector: 'awg-edition-folio-viewer', template: '' })
class EditionFolioViewerStubComponent {
    @Input()
    selectedConvolute: FolioConvolute;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();
}

describe('EditionConvoluteComponent (DONE)', () => {
    let component: EditionConvoluteComponent;
    let fixture: ComponentFixture<EditionConvoluteComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    let expectedSelectedConvolute: FolioConvolute;
    let expectedComplexId: string;
    let expectedNextComplexId: string;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedFolioLegends: IFolioLegend[];
    let expectedFragment: string;

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
            declarations: [EditionConvoluteComponent, EditionFolioViewerStubComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSelectedConvolute = mockEditionData.mockFolioConvoluteData.convolutes[0];
        expectedComplexId = 'testComplex1';
        expectedNextComplexId = 'testComplex2';
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk1;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedFragment = `source${expectedSelectedConvolute.convoluteId}`;

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
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have selectedConvolute', () => {
            expect(component.selectedConvolute).toBeUndefined();
        });

        it('... should not have selectedSvgSheet', () => {
            expect(component.selectedSvgSheet).toBeUndefined();
        });

        it('... should have faSquare', () => {
            expectToBe(component.faSquare, faSquare);
        });

        it('... should have folioLegends', () => {
            expectToEqual(component.folioLegends, expectedFolioLegends);
        });

        describe('VIEW', () => {
            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });

            it('... should contain no EditionFolioViewerComponent (stubbed) yet', () => {
                getAndExpectDebugElementByDirective(compDe, EditionFolioViewerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.selectedConvolute = expectedSelectedConvolute;
            component.selectedSvgSheet = expectedSvgSheet;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedConvolute` input', () => {
            expectToEqual(component.selectedConvolute, expectedSelectedConvolute);
        });

        it('... should have `selectedSvgSheet` input', () => {
            expectToEqual(component.selectedSvgSheet, expectedSvgSheet);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                // NgbAccordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one item in div.accordion', () => {
                // NgbAccordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                // Div.accordion-item
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
            });

            it('... should contain header title for the item (div.accordion-header)', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);

                // Header
                const headerDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div#awg-convolute-view > div.accordion-header',
                    1,
                    1
                );
                const headerEl = headerDes[0].nativeElement;

                const expectedTitle = 'Konvolutübersicht';

                expectToBe(headerEl.textContent.trim(), expectedTitle);
            });

            it('... should contain two divs and one EditionFolioViewerComponent (stubbed) in the item body (div.accordion-body)', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-convolute-label', 1, 1);
                getAndExpectDebugElementByDirective(bodyDes[0], EditionFolioViewerStubComponent, 1, 1);
                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-convolute-legend', 1, 1);
            });

            it('... should pass down `selectedConvolute` to the EditionFolioViewerComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, EditionFolioViewerStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(
                    EditionFolioViewerStubComponent
                ) as EditionFolioViewerStubComponent;

                expectToEqual(folioCmp.selectedConvolute, expectedSelectedConvolute);
            });

            it('... should pass down `selectedSvgSheet` to the EditionFolioViewerComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, EditionFolioViewerStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(
                    EditionFolioViewerStubComponent
                ) as EditionFolioViewerStubComponent;

                expectToEqual(folioCmp.selectedSvgSheet, expectedSvgSheet);
            });

            it('... should contain one link with convolute label in the convolute label div', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);

                const divDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div.accordion-body > div.awg-convolute-label',
                    1,
                    1
                );

                const anchorDes = getAndExpectDebugElementByCss(divDes[0], 'a', 1, 1);
                const anchorEl = anchorDes[0].nativeElement;

                expectToBe(anchorEl.textContent, expectedSelectedConvolute.convoluteLabel);
            });

            it('... should contain three legend labels in the folio legend div', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);

                const legendDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div.accordion-body > div.awg-convolute-legend',
                    1,
                    1
                );

                const spanDes = getAndExpectDebugElementByCss(legendDes[0], 'span', 3, 3);
                const spanEl0 = spanDes[0].nativeElement;
                const spanEl1 = spanDes[1].nativeElement;
                const spanEl2 = spanDes[2].nativeElement;

                expectToBe(spanEl0.className, expectedFolioLegends[0].color);
                expectToBe(spanEl0.textContent.trim(), expectedFolioLegends[0].label);

                expectToBe(spanEl1.className, expectedFolioLegends[1].color);
                expectToBe(spanEl1.textContent.trim(), expectedFolioLegends[1].label);

                expectToBe(spanEl2.className, expectedFolioLegends[2].color);
                expectToBe(spanEl2.textContent.trim(), expectedFolioLegends[2].label);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on openModalRequest event from EditionFolioViewerComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, EditionFolioViewerStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(
                    EditionFolioViewerStubComponent
                ) as EditionFolioViewerStubComponent;

                const expectedModalSnippet = expectedSelectedConvolute.folios[0].content[0].linkTo;

                folioCmp.openModalRequest.emit(expectedModalSnippet);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            });

            it('... should not emit anything if no id is provided', () => {
                const expectedModalSnippet = undefined;

                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 0, expectedModalSnippet);
            });

            it('... should emit id of given modal snippet', () => {
                const expectedModalSnippet = expectedSelectedConvolute.folios[0].content[0].linkTo;

                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet()', () => {
            it('... should have a method `selectSvgSheet`', () => {
                expect(component.selectSvgSheet).toBeDefined();
            });

            it('... should trigger on selectSvgSheetRequest event from EditionFolioViewerComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, EditionFolioViewerStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(
                    EditionFolioViewerStubComponent
                ) as EditionFolioViewerStubComponent;

                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                folioCmp.selectSvgSheetRequest.emit(expectedSheetIds);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSheetIds);
            });

            it('... should not emit anything if no id is provided', () => {
                const expectedSheetIds = undefined;
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedSheetIds);

                const expectedNextSheetIds = { complexId: undefined, sheetId: undefined };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet within same complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });

            it('... should emit id of selected svg sheet for another complex', () => {
                const expectedSheetIds = { complexId: expectedComplexId, sheetId: expectedSvgSheet.id };
                component.selectSvgSheet(expectedSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSheetIds);

                const expectedNextSheetIds = { complexId: expectedNextComplexId, sheetId: expectedNextSvgSheet.id };
                component.selectSvgSheet(expectedNextSheetIds);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSheetIds);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                expectToEqual(routerLinks[0].linkParams, ['../report']);
            });

            it('... can get correct fragment from template', () => {
                expectToEqual(routerLinks[0].fragment, expectedFragment);
            });

            it('... can click report link in template', () => {
                const reportLinkDe = linkDes[0]; // Contact link DebugElement
                const reportLink = routerLinks[0]; // Contact link directive

                expect(reportLink.navigatedTo).toBeNull();

                click(reportLinkDe);
                fixture.detectChanges();

                expectToEqual(reportLink.navigatedTo, ['../report']);
            });

            it('... should navigate to report page with fragment when report link is clicked', () => {
                const reportLinkDe = linkDes[0]; // Contact link DebugElement
                const reportLink = routerLinks[0]; // Contact link directive

                expect(reportLink.navigatedTo).toBeNull();

                click(reportLinkDe);
                fixture.detectChanges();

                expectToEqual(reportLink.navigatedTo, ['../report']);
                expectToEqual(reportLink.navigatedToFragment, expectedFragment);
            });
        });
    });
});
