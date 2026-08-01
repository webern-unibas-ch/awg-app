import { DebugElement, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { EDITION_GENERAL_LINKS } from '@awg-views/edition-view/edition-links.constants';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionOutlineSection } from '@awg-views/edition-view/models';
import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionInfoComponent } from './edition-info.component';

/** Helper functions */
function getExpectedRouterlinks(sections: EditionOutlineSection[]): string[] {
    const baseLinks = EDITION_GENERAL_LINKS.flatMap(link => link.route.join('/'));

    const itemLinks = (sections || []).flatMap(section => {
        const links: string[] = [];

        if (!section?.content?.intro?.disabled && section.content?.intro?.labeledRoute?.route) {
            links.push(section.content.intro.labeledRoute.route.join('/'));
        }

        const activeComplexes = (section.content?.sectionComplexes || []).filter(complex => !complex.disabled);

        activeComplexes.forEach(complex => {
            if (complex.labeledRoute?.route) {
                links.push(complex.labeledRoute.route.join('/'));
            }
        });

        return links;
    });

    return baseLinks.concat(itemLinks);
}

function getExpectedItemTitles(sections: EditionOutlineSection[], includeDisabled: boolean): string[] {
    let itemTitles = EDITION_GENERAL_LINKS.map(link => link.label);

    (sections || []).forEach(section => {
        if (!section.content?.intro?.disabled && section.content?.intro?.labeledRoute?.label) {
            itemTitles.push(section.content.intro.labeledRoute.label);
        }
        const activeComplexes = (section.content?.sectionComplexes || []).filter(
            complex => includeDisabled || !complex.disabled
        );

        const complexTitles = activeComplexes
            .map(c => c.labeledRoute?.label)
            .filter((label): label is string => !!label);

        itemTitles = itemTitles.concat(complexTitles);
    });

    return itemTitles;
}

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;

    let router: Router;

    let mockDocument: Document;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let outlineServiceGetEditionSectionByIdSpy: Spy;

    const expectedEditionInfoHeader = 'Edition';
    const expectedEditionRouteConstants: typeof EDITION_ROUTE_CONSTANTS = EDITION_ROUTE_CONSTANTS;
    let expectedSections: EditionOutlineSection[];

    let expectedRouterLinks: string[];
    let expectedItemTitles: string[];
    let expectedItemTitlesWithLinks: string[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionInfoComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        // Disable animation for NgbAccordion to avoid timing issues in tests
        const accordionConfig = TestBed.inject(NgbAccordionConfig);
        accordionConfig.animation = false;
    });

    beforeEach(() => {
        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);
        mockDocument = TestBed.inject(DOCUMENT);
        router = TestBed.inject(Router);

        // Service spies
        outlineServiceGetEditionSectionByIdSpy = vi
            .spyOn(editionOutlineService, 'getEditionSectionById')
            .mockImplementation((seriesId: string, sectionId: string) => {
                try {
                    return EditionStateHelper.getSection(seriesId, sectionId);
                } catch {
                    return undefined;
                }
            });

        // Test data
        expectedSections = [EditionStateHelper.getSection('1', '5'), EditionStateHelper.getSection('2', '2a')];
        expectedRouterLinks = getExpectedRouterlinks(expectedSections);
        expectedItemTitles = getExpectedItemTitles(expectedSections, true);
        expectedItemTitlesWithLinks = getExpectedItemTitles(expectedSections, false);

        // Create component fixture
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `EDITION_INFO_HEADER`', () => {
            expectToBe(component.EDITION_INFO_HEADER, expectedEditionInfoHeader);
        });

        it('... should have signal `selectedEditionSection` to hold expected section', () => {
            expectToBe(component.selectedEditionSection, editionStateService.selectedEditionSection);
        });
        it('... should have signal `sectionsData` to hold expected sections', () => {
            expectToEqual(component.sectionsData(), expectedSections);
        });

        it('... should filter out undefined sections from signal `sectionsData`', () => {
            outlineServiceGetEditionSectionByIdSpy
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce(expectedSections[1]);

            const freshFixture = TestBed.createComponent(EditionInfoComponent);
            const freshComponent = freshFixture.componentInstance;

            const result = freshComponent.sectionsData();

            expectToNotContain(result, undefined);
            expectToBe(result.length, expectedSections.length - 1);
            expectToEqual(result[0], expectedSections[1]);
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
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
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
                const hDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-edition-info-header', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedEditionInfoHeader);
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
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    if (index === 0) {
                        expectToContain(itemBodyEl.classList, 'show');
                    } else {
                        expectToContain(itemBodyEl.classList, 'collapse');
                    }
                });
            });

            it('... should open item body for selected section', async () => {
                for (const [sectionIndex, section] of expectedSections.entries()) {
                    const seriesId = section.seriesParent.route;
                    const series = EditionStateHelper.getSeries(seriesId);

                    editionStateService.updateSelectedEditionSeries(series);
                    editionStateService.updateSelectedEditionSection(section);

                    await detectChangesOnPush(fixture);

                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );

                    itemDes.forEach((itemDe, index) => {
                        const itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-collapse', 1, 1);
                        const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        if (index === 0 || index === sectionIndex + 1) {
                            expectToContain(itemBodyEl.classList, 'show');
                        } else {
                            expectToNotContain(itemBodyEl.classList, 'show');
                        }
                    });
                }
            });

            describe('... with open item bodies', () => {
                beforeEach(async () => {
                    // Open second and third item
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );

                    const itemHeaderDes1 = getAndExpectDebugElementByCss(itemDes[1], 'div.accordion-header', 1, 1);
                    const itemHeaderDes2 = getAndExpectDebugElementByCss(itemDes[2], 'div.accordion-header', 1, 1);

                    const btnDes1 = getAndExpectDebugElementByCss(itemHeaderDes1[0], 'button.accordion-button', 1, 1);
                    const btnDes2 = getAndExpectDebugElementByCss(itemHeaderDes2[0], 'button.accordion-button', 1, 1);

                    // Click header buttons to open
                    await clickAndAwaitChanges(btnDes1[0], fixture);
                    await clickAndAwaitChanges(btnDes2[0], fixture);
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
                        const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                        expectToBe(btnEl.textContent.trim(), expectedHeaders[index]);
                    });
                });

                it('... should toggle item bodies on click', async () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.accordion-item',
                        expectedSections.length + 1,
                        expectedSections.length + 1
                    );

                    for (const itemDe of itemDes) {
                        const itemHeaderDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-header', 1, 1);

                        const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                        // Item body is open
                        let itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-collapse', 1, 1, 'open');
                        let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item body is collapsed
                        itemBodyDes = getAndExpectDebugElementByCss(
                            itemDe,
                            'div.accordion-collapse',
                            1,
                            1,
                            'collapsed'
                        );
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToNotContain(itemBodyEl.classList, 'show');

                        // Click header button
                        await clickAndAwaitChanges(btnDes[0], fixture);

                        // Item body is open again
                        itemBodyDes = getAndExpectDebugElementByCss(itemDe, 'div.accordion-collapse', 1, 1, 'open');
                        itemBodyEl = itemBodyDes[0].nativeElement;

                        expectToContain(itemBodyEl.classList, 'show');
                    }
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

                        const currentSection = expectedSections[index - 1];
                        const allComplexesCount = currentSection.content?.sectionComplexes?.length ?? 0;

                        const expectedLength = !currentSection.content?.intro?.disabled
                            ? allComplexesCount + 1
                            : allComplexesCount;

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
                        const spanEl: HTMLSpanElement = spanDe.nativeElement;

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
                        const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                        const mockSpan = mockDocument.createElement('span');
                        mockSpan.innerHTML = itemTitles[index];

                        expectToBe(spanEl.textContent.trim(), mockSpan.textContent.trim());
                    });
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(async () => {
                // Open second and third item
                const itemDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-item', 3, 3);

                const itemHeaderDes1 = getAndExpectDebugElementByCss(itemDes[1], 'div.accordion-header', 1, 1);
                const itemHeaderDes2 = getAndExpectDebugElementByCss(itemDes[2], 'div.accordion-header', 1, 1);

                const btnDes1 = getAndExpectDebugElementByCss(itemHeaderDes1[0], 'button.accordion-button', 1, 1);
                const btnDes2 = getAndExpectDebugElementByCss(itemHeaderDes2[0], 'button.accordion-button', 1, 1);

                await clickAndAwaitChanges(btnDes1[0], fixture);
                await clickAndAwaitChanges(btnDes2[0], fixture);

                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLink,
                    expectedRouterLinks.length,
                    expectedRouterLinks.length
                );

                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedRouterLinks.length);
            });

            it('... can get correct linkParams from template', () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const urlTree = routerLink.urlTree;
                    const expectedRouterLink = expectedRouterLinks[index];

                    expectToBe(urlTree.toString(), expectedRouterLink);
                }
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                for (const [index] of routerLinks.entries()) {
                    navigateSpy.mockClear();

                    const linkDe = linkDes[index];
                    const expectedRouterLink = expectedRouterLinks[index];

                    await clickAndAwaitChanges(linkDe, fixture);

                    expect(navigateSpy).toHaveBeenCalled();
                    const actualUrl = navigateSpy.mock.calls[0][0].toString();

                    expectToBe(actualUrl, expectedRouterLink);
                }

                navigateSpy.mockRestore();
            });
        });
    });
});
