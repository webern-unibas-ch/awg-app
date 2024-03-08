/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbAccordionDirective, NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from 'testing/router-stubs';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS, EDITION_TYPE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex } from '@awg-views/edition-view/models';

import { EditionInfoComponent } from './edition-info.component';

/** Helper functions */
function generateExpectedOrderOfRouterlinks(editionComplexes: EditionComplex[]): string[][] {
    const editionOverviewLink = [[EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.SERIES.route]];
    const rowTablesLink = [[EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.ROWTABLES.route]];

    const editionLinks = editionComplexes.flatMap(complex => {
        const routes = [[complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route]];
        if (complex === EDITION_COMPLEXES.OP25) {
            routes.push([complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_GRAPH.route]);
        }
        return routes;
    });

    return [...editionOverviewLink, ...rowTablesLink, ...editionLinks];
}

function generateExpectedOrderOfHeaders(editionComplexes: EditionComplex[]): string[] {
    const editionOverviewHeader = EDITION_ROUTE_CONSTANTS.SERIES.full;
    const rowTablesHeader = EDITION_ROUTE_CONSTANTS.ROWTABLES.full;

    const editionHeaders = editionComplexes.flatMap(complex => {
        if (complex === EDITION_COMPLEXES.OP25) {
            return [EDITION_TYPE_CONSTANTS.SKETCH_EDITION.full, EDITION_ROUTE_CONSTANTS.EDITION_GRAPH.full];
        }
        return [EDITION_TYPE_CONSTANTS.SKETCH_EDITION.full];
    });

    return [editionOverviewHeader, rowTablesHeader, ...editionHeaders];
}

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedEditionComplexes: EditionComplex[];
    let expectedOrderOfRouterlinks: string[][];
    let expectedOrderOfHeaders: string[];

    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;
    const expectedEditionTypeConstants: typeof EDITION_TYPE_CONSTANTS = EDITION_TYPE_CONSTANTS;

    const expectedEditionInfoHeader = 'Edition';

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule, NgbAccordionDirective],
            declarations: [EditionInfoComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedEditionComplexes = [
            EDITION_COMPLEXES.OP12,
            EDITION_COMPLEXES.OP25,
            EDITION_COMPLEXES.M30,
            EDITION_COMPLEXES.M31,
            EDITION_COMPLEXES.M34,
            EDITION_COMPLEXES.M35_42,
            EDITION_COMPLEXES.M37,
        ];
        expectedOrderOfRouterlinks = generateExpectedOrderOfRouterlinks(expectedEditionComplexes);
        expectedOrderOfHeaders = generateExpectedOrderOfHeaders(expectedEditionComplexes);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `DISPLAYED_EDITION_COMPLEXES`', () => {
            expectToEqual(component.DISPLAYED_EDITION_COMPLEXES, expectedEditionComplexes);
        });

        it('... should have as many `DISPLAYED_EDITION_COMPLEXES` as there are complexes in the array', () => {
            expectToEqual(component.DISPLAYED_EDITION_COMPLEXES.length, expectedEditionComplexes.length);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        it('... should have `editionTypeConstants`', () => {
            expectToBe(component.editionTypeConstants, expectedEditionTypeConstants);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain one `h5` header in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-edition-info-header', 1, 1);
            });

            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render `editionInfoHeader`', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-edition-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expectToBe(headerEl.textContent, expectedEditionInfoHeader);
            });

            it('... should contain one div.accordion', () => {
                // NgbAccordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain 3 div.accordion-items with header and open body in div.accordion', () => {
                // NgbAccordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 3, 3);

                itemDes.forEach(item => {
                    // Header (div.accordion-header)
                    const itemHeaderDes = getAndExpectDebugElementByCss(item, 'div.accordion-header', 1, 1);
                    const itemHeaderEl = itemHeaderDes[0].nativeElement;

                    // Item body
                    const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });
            });

            it('... should display item header buttons with rowtables and edition series', () => {
                // Header debug elements
                const itemHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-header', 3, 3);

                const expectedHeaders = [
                    'Allgemein',
                    `${expectedEditionRouteConstants.EDITION.short} ${expectedEditionRouteConstants.SERIES_1.short}/${expectedEditionRouteConstants.SECTION_5.short}`,
                    `${expectedEditionRouteConstants.EDITION.short} ${expectedEditionRouteConstants.SERIES_2.short}/${expectedEditionRouteConstants.SECTION_2A.short}`,
                ];

                itemHeaderDes.forEach((itemHeaderDe, index) => {
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDe, 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button contents
                    expectToBe(btnEl.textContent.trim(), expectedHeaders[index]);
                });
            });

            it('... should toggle item body on click', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 3, 3);

                // Header debug elements
                const itemHeaderDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                // Button debug elements
                const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                // Button native elements to click on
                const btnEl = btnDes[0].nativeElement;

                // Item body is open
                let itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1, 'open');
                let itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'show');

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Item body is collapsed
                itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1, 'collapsed');
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'collapse');

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Item body is open again
                itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1, 'open');
                itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'show');
            });

            it('... should contain item body with 2 paragraphs in first item', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 3, 3);

                // Item body
                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                // Paragraph
                getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 2, 2);
            });

            it('... should contain item body with 2 paragraphs in second item', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 3, 3);

                // Item body
                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[1], 'div.accordion-body', 1, 1);

                // Length of expected paragraphs (first two items)
                const expectedLength = expectedEditionComplexes.slice(0, 2).length;

                // Paragraphs
                getAndExpectDebugElementByCss(itemBodyDes[0], 'p', expectedLength, expectedLength);
            });

            it('... should contain item body with 4 paragraphs in third item', () => {
                // Div.accordion-item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 3, 3);

                // Item body
                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[2], 'div.accordion-body', 1, 1);

                // Length of expected paragraphs (last items starting from index 2)
                const expectedLength = expectedEditionComplexes.slice(2).length;

                // Paragraphs
                getAndExpectDebugElementByCss(itemBodyDes[0], 'p', expectedLength, expectedLength);
            });

            it('... should render links in edition info headers', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-edition-info-header-link',
                    expectedOrderOfHeaders.length,
                    expectedOrderOfHeaders.length
                );

                aDes.forEach((aDe, index) => {
                    const aEl = aDe.nativeElement;

                    expectToEqual(aEl.textContent, expectedOrderOfHeaders[index]);
                });
            });

            it('... should render title of edition info headers', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-edition-info-header-title',
                    expectedEditionComplexes.length,
                    expectedEditionComplexes.length
                );

                titleDes.forEach((titleDe, index) => {
                    const titleEl = titleDe.nativeElement;

                    expectToBe(titleEl.innerHTML, expectedEditionComplexes[index].titleStatement.title);
                });
            });

            it('... should render catalogue number of edition info headers', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'span.awg-edition-info-header-catalogue',
                    expectedEditionComplexes.length,
                    expectedEditionComplexes.length
                );

                catalogueDes.forEach((catalogueDe, index) => {
                    const catalogueEl = catalogueDe.nativeElement;

                    expectToBe(catalogueEl.innerHTML, expectedEditionComplexes[index].complexId.short);
                });
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedOrderOfRouterlinks.length,
                    expectedOrderOfRouterlinks.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedOrderOfRouterlinks.length);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink, index) => {
                    expectToEqual(routerLink.linkParams, expectedOrderOfRouterlinks[index]);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedOrderOfRouterlinks[index];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });
    });
});
