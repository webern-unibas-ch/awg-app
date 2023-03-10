import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionSvgSheet, FolioConvolute } from '@awg-views/edition-view/models';

import { click } from '@testing/click-helper';
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
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
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
        expectedSvgSheet = mockEditionData.mockSvgSheet_Sk2;
        expectedNextSvgSheet = mockEditionData.mockSvgSheet_Sk3;
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
            expect(component.faSquare).toBeDefined();
            expect(component.faSquare).withContext(`should be faSquare`).toBe(faSquare);
        });

        it('... should have folioLegends', () => {
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
            expect(component.selectedConvolute).toBeDefined();
            expect(component.selectedConvolute)
                .withContext(`should be ${expectedSelectedConvolute}`)
                .toBe(expectedSelectedConvolute);
        });

        it('... should have `selectedSvgSheet` input', () => {
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
                const headerEl = headerDes[0].nativeElement;

                const expectedTitle = 'Konvolutübersicht';

                expect(headerEl.textContent).toBeDefined();
                expect(headerEl.textContent.trim()).withContext(`should be ${expectedTitle}`).toBe(expectedTitle);
            });

            it('... should contain two divs and one EditionFolioViewerComponent (stubbed) in the panel body (div.accordion-body)', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                const bodyDes = getAndExpectDebugElementByCss(panelDes[0], 'div.accordion-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-convolute-label', 1, 1);
                getAndExpectDebugElementByDirective(bodyDes[0], EditionFolioViewerStubComponent, 1, 1);
                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-convolute-legend', 1, 1);
            });

            it('... should pass down `selectedConvolute` to the EditionFolioViewerComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, EditionFolioViewerStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(
                    EditionFolioViewerStubComponent
                ) as EditionFolioViewerStubComponent;

                expect(folioCmp.selectedConvolute).toBeTruthy();
                expect(folioCmp.selectedConvolute)
                    .withContext(`should equal ${expectedSelectedConvolute}`)
                    .toEqual(expectedSelectedConvolute);
            });

            it('... should pass down `selectedSvgSheet` to the EditionFolioViewerComponent', () => {
                const folioDes = getAndExpectDebugElementByDirective(compDe, EditionFolioViewerStubComponent, 1, 1);
                const folioCmp = folioDes[0].injector.get(
                    EditionFolioViewerStubComponent
                ) as EditionFolioViewerStubComponent;

                expect(folioCmp.selectedSvgSheet).toBeTruthy();
                expect(folioCmp.selectedSvgSheet)
                    .withContext(`should equal ${expectedSvgSheet}`)
                    .toEqual(expectedSvgSheet);
            });

            it('... should contain one link with convolute label in the convolute label div', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                const divDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div.accordion-body > div.awg-convolute-label',
                    1,
                    1
                );

                const anchorDes = getAndExpectDebugElementByCss(divDes[0], 'a', 1, 1);
                const anchorEl = anchorDes[0].nativeElement;

                expect(anchorEl.textContent).toBeDefined();
                expect(anchorEl.textContent)
                    .withContext(`should be ${expectedSelectedConvolute.convoluteLabel}`)
                    .toBe(expectedSelectedConvolute.convoluteLabel);
            });

            it('... should contain three legend labels in the folio legend div', () => {
                // Ngb-accordion panel debug element
                const panelDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion > div.accordion-item', 1, 1);

                const legendDes = getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div.accordion-body > div.awg-convolute-legend',
                    1,
                    1
                );

                const spanDes = getAndExpectDebugElementByCss(legendDes[0], 'span', 3, 3);
                const spanEl0 = spanDes[0].nativeElement;
                const spanEl1 = spanDes[1].nativeElement;
                const spanEl2 = spanDes[2].nativeElement;

                expect(spanEl0.className).toBeDefined();
                expect(spanEl0.className)
                    .withContext(`should be ${expectedFolioLegends[0].color}`)
                    .toBe(expectedFolioLegends[0].color);
                expect(spanEl0.textContent).toBeDefined();
                expect(spanEl0.textContent.trim())
                    .withContext(`should be ${expectedFolioLegends[0].label}`)
                    .toBe(expectedFolioLegends[0].label);

                expect(spanEl1.className).toBeDefined();
                expect(spanEl1.className)
                    .withContext(`should be ${expectedFolioLegends[1].color}`)
                    .toBe(expectedFolioLegends[1].color);
                expect(spanEl1.textContent).toBeDefined();
                expect(spanEl1.textContent.trim())
                    .withContext(`should be ${expectedFolioLegends[1].label}`)
                    .toBe(expectedFolioLegends[1].label);

                expect(spanEl2.className).toBeDefined();
                expect(spanEl2.className)
                    .withContext(`should be ${expectedFolioLegends[2].color}`)
                    .toBe(expectedFolioLegends[2].color);
                expect(spanEl2.textContent).toBeDefined();
                expect(spanEl2.textContent.trim())
                    .withContext(`should be ${expectedFolioLegends[2].label}`)
                    .toBe(expectedFolioLegends[2].label);
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

                folioCmp.selectSvgSheetRequest.emit(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetSpy, 1, expectedNextSvgSheet.id);
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

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expect(routerLinks.length).withContext('should have 1 routerLink').toBe(1);
            });

            it('... can get correct linkParams from template', () => {
                expect(routerLinks[0].linkParams).withContext(`should equal ['../report']`).toEqual(['../report']);
            });

            it('... can get correct fragment from template', () => {
                expect(routerLinks[0].fragment)
                    .withContext(`should equal ${expectedFragment}`)
                    .toEqual(expectedFragment);
            });

            it('... can click report link in template', () => {
                const reportLinkDe = linkDes[0]; // Contact link DebugElement
                const reportLink = routerLinks[0]; // Contact link directive

                expect(reportLink.navigatedTo).toBeNull();

                click(reportLinkDe);
                fixture.detectChanges();

                expect(reportLink.navigatedTo).withContext(`should equal ['../report']`).toEqual(['../report']);
            });

            it('... should navigate to report page with fragment when report link is clicked', () => {
                const reportLinkDe = linkDes[0]; // Contact link DebugElement
                const reportLink = routerLinks[0]; // Contact link directive

                expect(reportLink.navigatedTo).toBeNull();

                click(reportLinkDe);
                fixture.detectChanges();

                expect(reportLink.navigatedTo).withContext(`should equal ['../report']`).toEqual(['../report']);
                expect(reportLink.navigatedToFragment)
                    .withContext(`should equal ${expectedFragment}`)
                    .toEqual(expectedFragment);
            });
        });
    });
});
