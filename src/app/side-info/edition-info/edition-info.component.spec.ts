/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordionDirective, NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from 'testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, EditionOutlineSection } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { DOCUMENT } from '@angular/common';
import { EditionInfoComponent } from './edition-info.component';

/** Helper functions */
function getComplexesFromSections(
    sections: EditionOutlineSection[],
    includeDisabled: boolean = true
): EditionComplex[] {
    return sections.flatMap(section => {
        if (section?.content?.complexTypes) {
            let complexes = [...section.content.complexTypes.opus, ...section.content.complexTypes.mnr];
            if (!includeDisabled) {
                complexes = complexes.filter(complex => !complex.disabled);
            }
            return complexes.map(complex => complex.complex);
        }
        return [];
    });
}

function getExpectedRouterlinks(sections: EditionOutlineSection[]): string[][] {
    const {
        EDITION,
        SERIES,
        ROWTABLES,
        PREFACE,
        SERIES_1,
        SECTION,
        SECTION_5,
        EDITION_INTRO,
        EDITION_SHEETS,
        EDITION_GRAPH,
    } = EDITION_ROUTE_CONSTANTS;

    const editionOverviewLink = [[EDITION.route, SERIES.route]];
    const rowTablesLink = [[EDITION.route, ROWTABLES.route]];
    const prefaceLink = [[EDITION.route, PREFACE.route]];

    let itemLinks = [];
    sections.forEach(section => {
        if (!section.content.intro.disabled) {
            const introLink = [
                EDITION.route,
                SERIES.route,
                section.seriesParent.route,
                SECTION.route,
                section.section.route,
                EDITION_INTRO.route,
            ];
            itemLinks.push(introLink);
        }
        const complexes: EditionComplex[] = getComplexesFromSections([section], false);
        const complexLinks = complexes.map(complex => [complex.baseRoute, EDITION_SHEETS.route]);
        itemLinks = itemLinks.concat(complexLinks);
    });

    return [...editionOverviewLink, ...rowTablesLink, ...prefaceLink, ...itemLinks];
}

function getExpectedItemTitles(sections: EditionOutlineSection[], includeDisabled: boolean): string[] {
    const { SERIES, ROWTABLES, PREFACE, EDITION_INTRO } = EDITION_ROUTE_CONSTANTS;
    let itemTitles: string[] = [SERIES.full, ROWTABLES.full, PREFACE.full];

    sections.forEach(section => {
        if (!section.content.intro.disabled) {
            itemTitles.push(EDITION_INTRO.full);
        }
        const complexes: EditionComplex[] = getComplexesFromSections([section], includeDisabled);
        const complexTitels = complexes.map(complex => complex.complexId.full);
        itemTitles = itemTitles.concat(complexTitels);
    });

    return itemTitles;
}

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let mockDocument: Document;
    let mockEditionStateService: Partial<EditionStateService>;

    let setupEditionViewSpy: Spy;
    let editionStateServiceGetSelectedEditionSectionSpy: Spy;

    const expectedEditionInfoHeader = 'Edition';
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;
    let expectedSections: EditionOutlineSection[];

    let expectedRouterLinks: string[][];
    let expectedItemTitles: string[];
    let expectedItemTitlesWithLinks: string[];
    let expectedEditionComplexes: EditionComplex[];

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(waitForAsync(() => {
        // Mock edition state service
        mockEditionStateService = {
            getSelectedEditionSection: (): Observable<EditionOutlineSection> => observableOf(null),
        };

        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule, NgbAccordionDirective],
            declarations: [EditionInfoComponent, RouterLinkStubDirective],
            providers: [{ provide: EditionStateService, useValue: mockEditionStateService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockEditionStateService = TestBed.inject(EditionStateService);
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedSections = [
            EditionOutlineService.getEditionSectionById('1', '5'),
            EditionOutlineService.getEditionSectionById('2', '2a'),
        ];
        expectedEditionComplexes = getComplexesFromSections(expectedSections);
        expectedRouterLinks = getExpectedRouterlinks(expectedSections);
        expectedItemTitles = getExpectedItemTitles(expectedSections, true);
        expectedItemTitlesWithLinks = getExpectedItemTitles(expectedSections, false);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        setupEditionViewSpy = spyOn(component, 'setupEditionView').and.callThrough();
        editionStateServiceGetSelectedEditionSectionSpy = spyOn(
            mockEditionStateService,
            'getSelectedEditionSection'
        ).and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `DISPLAYED_SECTIONS`', () => {
            expectToEqual(component.DISPLAYED_SECTIONS, expectedSections);
        });

        it('... should have as many `DISPLAYED_SECTIONS` as there are sections in the array', () => {
            expectToEqual(component.DISPLAYED_SECTIONS.length, expectedSections.length);
        });

        it('... should have `editionRouteConstants`', () => {
            expectToBe(component.editionRouteConstants, expectedEditionRouteConstants);
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain one `h5` header in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-edition-info-header', 1, 1);
            });

            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain 1 div.accordion-item with header and non-collapsed body in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);

                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have triggerd `setupEditionView` method', () => {
            expectSpyCall(setupEditionViewSpy, 1);
        });

        describe('VIEW', () => {
            it('... should render `editionInfoHeader`', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-edition-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expectToBe(headerEl.textContent, expectedEditionInfoHeader);
            });

            it('... should contain 3 div.accordion-items with header', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                const itemDes = getAndExpectDebugElementByCss(
                    accordionDes[0],
                    'div.accordion-item',
                    expectedSections.length + 1,
                    expectedSections.length + 1
                );

                itemDes.forEach(itemDe => {
                    getAndExpectDebugElementByCss(itemDe, 'div.accordion-header', 1, 1);
                });
            });

            it('... should only have open body for first div.accordion-item in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                const itemDes = getAndExpectDebugElementByCss(
                    accordionDes[0],
                    'div.accordion-item',
                    expectedSections.length + 1,
                    expectedSections.length + 1
                );

                itemDes.forEach((itemDe, index) => {
                    const itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-collapse', 1, 1);
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    if (index === 0) {
                        expectToContain(itemBodyEl.classList, 'show');
                    } else {
                        expectToContain(itemBodyEl.classList, 'collapse');
                    }
                });
            });

            it('... should open item body for selected section', () => {
                expectedSections.forEach((section, sectionIndex) => {
                    component.selectedEditionSection = section;
                    fixture.detectChanges();

                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );

                    itemDes.forEach((itemDe, index) => {
                        const itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-collapse', 1, 1);
                        const itemBodyEl = itemBodyDes[0].nativeElement;

                        if (index === 0 || index === sectionIndex + 1) {
                            expectToContain(itemBodyEl.classList, 'show');
                        } else {
                            expect(itemBodyEl.classList).not.toContain('show');
                        }
                    });
                });
            });

            describe('... with open item bodies', () => {
                beforeEach(() => {
                    // Open second and third item
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );

                    const itemHeader1Des = getAndExpectDebugElementByCss(itemDes[1], 'div.accordion-header', 1, 1);
                    const itemHeader2Des = getAndExpectDebugElementByCss(itemDes[2], 'div.accordion-header', 1, 1);

                    const btn1Des = getAndExpectDebugElementByCss(itemHeader1Des[0], 'button.accordion-button', 1, 1);
                    const btn2Des = getAndExpectDebugElementByCss(itemHeader2Des[0], 'button.accordion-button', 1, 1);

                    const btn1El = btn1Des[0].nativeElement;
                    const btn2El = btn2Des[0].nativeElement;

                    // Click header buttons to open
                    click(btn1El as HTMLElement);
                    click(btn2El as HTMLElement);
                    fixture.detectChanges();
                });

                it('... should display item header buttons', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-header', 3, 3);

                    const expectedHeaders = ['Allgemein'];
                    expectedSections.forEach(expectedSection => {
                        const awg = expectedEditionRouteConstants.EDITION.short;
                        const series = expectedSection.seriesParent.short;
                        const section = expectedSection.section.short;
                        expectedHeaders.push(`${awg} ${series}/${section}`);
                    });

                    itemHeaderDes.forEach((itemHeaderDe, index) => {
                        const btnDes = getAndExpectDebugElementByCss(itemHeaderDe, 'button.accordion-button', 1, 1);
                        const btnEl = btnDes[0].nativeElement;

                        expectToBe(btnEl.textContent.trim(), expectedHeaders[index]);
                    });
                });

                it('... should toggle item bodies on click', () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );

                    itemDes.forEach(itemDe => {
                        const itemHeaderDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-header', 1, 1);

                        const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                        const btnEl = btnDes[0].nativeElement;

                        // Item body is open
                        let itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-collapse', 1, 1, 'open');
                        let itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Item body is collapsed
                        itemBodyDes = getAndExpectDebugElementByCss(
                            itemDe,
                            'div.accordion-collapse',
                            1,
                            1,
                            'collapsed'
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expect(itemBodyEl.classList).not.toContain('show');

                        // Click header button
                        click(btnEl as HTMLElement);
                        detectChangesOnPush(fixture);

                        // Item body is open again
                        itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-collapse', 1, 1, 'open');
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');
                    });
                });

                it('... should contain item body with 3 paragraphs in first item', () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );
                    const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-body', 1, 1);

                    getAndExpectDebugElementByCss(itemBodyDes[0], 'p', 3, 3);
                });

                it('... should contain item bodies with as many paragraphs as complexes (plus intro) in following items', () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );

                    itemDes.forEach((itemDe, index) => {
                        if (index < 1) {
                            return;
                        }
                        const itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-body', 1, 1);

                        const complexes = getComplexesFromSections([expectedSections[index - 1]]);
                        let expectedLength = complexes.length;

                        if (!expectedSections[index - 1].content.intro.disabled) {
                            expectedLength++;
                        }

                        getAndExpectDebugElementByCss(itemBodyDes[0], 'p', expectedLength, expectedLength);
                    });
                });

                it('... should render titles of all available edition info items', () => {
                    const itemTitles = expectedItemTitles;

                    const spanDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-edition-info-item-title',
                        itemTitles.length,
                        itemTitles.length
                    );

                    spanDes.forEach((spanDe, index) => {
                        const spanEl = spanDe.nativeElement;

                        const mockSpan = mockDocument.createElement('span');
                        mockSpan.innerHTML = itemTitles[index];

                        expectToBe(spanEl.textContent.trim(), mockSpan.textContent.trim());
                    });
                });

                it('... should render links only for non-disabled edition info items', () => {
                    const itemTitles = expectedItemTitlesWithLinks;

                    const aDes = getAndExpectDebugElementByCss(
                        compDe,
                        'a.awg-edition-info-item-link',
                        itemTitles.length,
                        itemTitles.length
                    );

                    aDes.forEach((aDe, index) => {
                        const spanDes = getAndExpectDebugElementByCss(aDe, 'span.awg-edition-info-item-title', 1, 1);
                        const spanEl = spanDes[0].nativeElement;

                        const mockSpan = mockDocument.createElement('span');
                        mockSpan.innerHTML = itemTitles[index];

                        expectToBe(spanEl.textContent.trim(), mockSpan.textContent.trim());
                    });
                });
            });
        });

        describe('#setupEditionView()', () => {
            it('... should have a method `setupEditionView`', () => {
                expect(component.setupEditionView).toBeDefined();
            });

            it('... should trigger `getSelectedEditionSection` method (via EditionStateService)', () => {
                expectSpyCall(setupEditionViewSpy, 1);
                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 1);

                component.setupEditionView();

                expectSpyCall(setupEditionViewSpy, 2);
                expectSpyCall(editionStateServiceGetSelectedEditionSectionSpy, 2);
            });

            it('... should get selectedEditionSection (via EditionStateService)', waitForAsync(() => {
                editionStateServiceGetSelectedEditionSectionSpy.and.returnValue(observableOf(expectedSections[0]));

                expectToEqual(component.selectedEditionSection, null);

                component.setupEditionView();

                expectToEqual(component.selectedEditionSection, expectedSections[0]);
            }));
        });

        describe('#combineComplexes()', () => {
            it('... should have a method `combineComplexes`', () => {
                expect(component.combineComplexes).toBeDefined();
            });

            describe('... should return an empty array if ...', () => {
                it('... both opus and mnr complexes are empty', () => {
                    const section: EditionOutlineSection = {
                        content: {
                            complexTypes: {
                                opus: [],
                                mnr: [],
                            },
                        },
                    } as EditionOutlineSection;

                    const result = component.combineComplexes(section);

                    expectToEqual(result, []);
                });

                it('... both opus and mnr complexes are undefined', () => {
                    const section: EditionOutlineSection = {
                        content: {
                            complexTypes: {
                                opus: undefined,
                                mnr: undefined,
                            },
                        },
                    } as EditionOutlineSection;

                    const result = component.combineComplexes(section);

                    expectToEqual(result, []);
                });

                it('... complexTypes are undefined', () => {
                    const section: EditionOutlineSection = {
                        content: {
                            complexTypes: undefined,
                        },
                    } as EditionOutlineSection;

                    const result = component.combineComplexes(section);

                    expectToEqual(result, []);
                });
            });

            it('... should return combined opus and mnr complexes', () => {
                const opusComplex = EditionComplexesService.getEditionComplexById('OP12');
                const mnrComplex = EditionComplexesService.getEditionComplexById('M22');

                const section: EditionOutlineSection = {
                    content: {
                        complexTypes: {
                            opus: [{ complex: opusComplex, disabled: false }],
                            mnr: [{ complex: mnrComplex, disabled: false }],
                        },
                    },
                } as EditionOutlineSection;

                const result = component.combineComplexes(section);

                expectToEqual(result, [
                    { complex: opusComplex, disabled: false },
                    { complex: mnrComplex, disabled: false },
                ]);
            });

            it('... should return only opus complexes if mnr complexes are empty', () => {
                const opusComplex = EditionComplexesService.getEditionComplexById('OP12');
                const section: EditionOutlineSection = {
                    content: {
                        complexTypes: {
                            opus: [{ complex: opusComplex, disabled: false }],
                            mnr: [],
                        },
                    },
                } as EditionOutlineSection;

                const result = component.combineComplexes(section);

                expectToEqual(result, [{ complex: opusComplex, disabled: false }]);
            });

            it('... should return only mnr complexes if opus complexes are empty', () => {
                const mnrComplex = EditionComplexesService.getEditionComplexById('M22');
                const section: EditionOutlineSection = {
                    content: {
                        complexTypes: {
                            opus: [],
                            mnr: [{ complex: mnrComplex, disabled: false }],
                        },
                    },
                } as EditionOutlineSection;

                const result = component.combineComplexes(section);

                expectToEqual(result, [{ complex: mnrComplex, disabled: false }]);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Open second and third item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 3, 3);

                const itemHeader1Des = getAndExpectDebugElementByCss(itemDes[1], 'div.accordion-header', 1, 1);
                const itemHeader2Des = getAndExpectDebugElementByCss(itemDes[2], 'div.accordion-header', 1, 1);

                const btn1Des = getAndExpectDebugElementByCss(itemHeader1Des[0], 'button.accordion-button', 1, 1);
                const btn2Des = getAndExpectDebugElementByCss(itemHeader2Des[0], 'button.accordion-button', 1, 1);

                const btn1El = btn1Des[0].nativeElement;
                const btn2El = btn2Des[0].nativeElement;

                // Click header buttons to open
                click(btn1El as HTMLElement);
                click(btn2El as HTMLElement);
                detectChangesOnPush(fixture);

                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedRouterLinks.length,
                    expectedRouterLinks.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedRouterLinks.length);
            });

            it('... can get correct linkParams from template', () => {
                routerLinks.forEach((routerLink: RouterLinkStubDirective, index: number) => {
                    const expectedRouterLink = expectedRouterLinks[index];
                    expectToEqual(routerLink.linkParams, expectedRouterLink);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink: RouterLinkStubDirective, index: number) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedRouterLinks[index];

                    expectToBe(routerLink.navigatedTo, null);

                    click(linkDe);
                    fixture.detectChanges();

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                });
            });
        });
    });
});
