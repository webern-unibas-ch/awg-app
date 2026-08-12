import { Component, DebugElement, inject, Input, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionModule, NgbConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionSvgSheet, FolioConvolute } from '@awg-views/edition-view/models';

import { EditionConvoluteComponent } from './edition-convolute.component';

interface IFolioLegend {
    colorClass: string;
    label: string;
}

@Component({
    selector: 'awg-edition-folio-viewer',
    template: '',
    standalone: false,
})
class EditionFolioViewerStubComponent {
    @Input()
    selectedConvolute: FolioConvolute;
    @Input()
    selectedSvgSheet: EditionSvgSheet;
}

describe('EditionConvoluteComponent (DONE)', () => {
    let component: EditionConvoluteComponent;
    let fixture: ComponentFixture<EditionConvoluteComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks: RouterLinkStubDirective[];

    let expectedSelectedConvolute: FolioConvolute;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedFolioLegends: IFolioLegend[];
    let expectedFragment: string;
    let expectedSquareIcon: IconDefinition;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule, NgbDropdownModule], exports: [NgbAccordionModule, NgbDropdownModule] })
    class NgbConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, NgbAccordionModule, NgbDropdownModule, NgbConfigModule],
            declarations: [EditionConvoluteComponent, EditionFolioViewerStubComponent, RouterLinkStubDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedSelectedConvolute = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0]);
        expectedSvgSheet = structuredClone(mockEditionData.mockSvgSheet_Sk1);
        expectedFragment = `source_${expectedSelectedConvolute.convoluteId}`;
        expectedSquareIcon = faSquare;

        expectedFolioLegends = [
            {
                colorClass: 'olivedrab',
                label: 'aktuell ausgewählt',
            },
            {
                colorClass: 'orange',
                label: 'auswählbar',
            },
            {
                colorClass: 'grey',
                label: '(momentan noch) nicht auswählbar',
            },
        ];

        // Create component fixture
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
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

        it('... should have faSquare icon', () => {
            expectToEqual(component.faSquare, expectedSquareIcon);
        });

        it('... should have folioLegends', () => {
            expectToEqual(component.folioLegends, expectedFolioLegends);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and non-collapsible body yet in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.selectedConvolute = structuredClone(expectedSelectedConvolute);
            component.selectedSvgSheet = structuredClone(expectedSvgSheet);

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
            it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                const itemDes = getAndExpectDebugElementByCss(
                    accordionDes[0],
                    'div#awg-convolute-view.accordion-item',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(itemDes[0], 'div#awg-convolute-view > div.accordion-header', 1, 1);

                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div#awg-convolute-view-collapse', 1, 1);
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'show');
            });

            it('... should contain header title for the item (div.accordion-header)', () => {
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);

                const itemHeaderDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div#awg-convolute-view > div.accordion-header',
                    1,
                    1
                );
                const itemHeaderEl: HTMLDivElement = itemHeaderDes[0].nativeElement;

                const expectedTitle = 'Konvolutübersicht';

                expectToBe(itemHeaderEl.textContent.trim(), expectedTitle);
            });

            it('... should contain two divs and one EditionFolioViewerComponent (stubbed) in the item body (div.accordion-body)', () => {
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
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                const divDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div.accordion-body > div.awg-convolute-label',
                    1,
                    1
                );

                const aDes = getAndExpectDebugElementByCss(divDes[0], 'a', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.textContent, expectedSelectedConvolute.convoluteLabel);
            });

            it('... should contain three legend labels in the folio legend div', () => {
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                const legendDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div.accordion-body > div.awg-convolute-legend',
                    1,
                    1
                );
                const spanDes = getAndExpectDebugElementByCss(legendDes[0], 'span', 3, 3);

                spanDes.forEach((spanDe, index) => {
                    const spanEl: HTMLSpanElement = spanDe.nativeElement;

                    expectToBe(spanEl.className, expectedFolioLegends[index].colorClass);
                    expectToBe(spanEl.textContent.trim(), expectedFolioLegends[index].label);
                });
            });

            it('... should display square icon with the legend labels', () => {
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 1, 1);
                const legendDes = getAndExpectDebugElementByCss(
                    itemDes[0],
                    'div.accordion-body > div.awg-convolute-legend',
                    1,
                    1
                );
                const spanDes = getAndExpectDebugElementByCss(legendDes[0], 'span', 3, 3);

                spanDes.forEach(spanDe => {
                    const faIconDes = getAndExpectDebugElementByCss(spanDe, 'fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToBe(faIconIns(), expectedSquareIcon);
                });
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

            it('... can click report link in template', async () => {
                const reportLinkDe = linkDes[0];
                const reportLink = routerLinks[0];

                expectToBe(reportLink.navigatedTo, null);

                await clickAndAwaitChanges(reportLinkDe, fixture);

                expectToEqual(reportLink.navigatedTo, ['../report']);
            });

            it('... should navigate to report page with fragment when report link is clicked', async () => {
                const reportLinkDe = linkDes[0];
                const reportLink = routerLinks[0];

                expectToBe(reportLink.navigatedTo, null);

                await clickAndAwaitChanges(reportLinkDe, fixture);

                expectToEqual(reportLink.navigatedTo, ['../report']);
                expectToEqual(reportLink.navigatedToFragment, expectedFragment);
            });
        });
    });
});
