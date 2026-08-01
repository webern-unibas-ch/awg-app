import { DebugElement, isSignal, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSeriesComponent } from './edition-series.component';

describe('EditionSeriesComponent (DONE)', () => {
    let component: EditionSeriesComponent;
    let fixture: ComponentFixture<EditionSeriesComponent>;
    let compDe: DebugElement;

    let editionStateService: EditionStateService;

    let stateServiceUpdateSeriesSpy: Spy;

    let mockOutlineSignal: WritableSignal<EditionOutlineSeries[]>;
    let expectedOutline: EditionOutlineSeries[];

    beforeEach(async () => {
        // Mock services
        expectedOutline = EditionStateHelper.getOutline();
        mockOutlineSignal = signal<EditionOutlineSeries[]>(expectedOutline);

        await TestBed.configureTestingModule({
            declarations: [EditionSeriesComponent, RouterLinkStubDirective],
            providers: [
                {
                    provide: EditionOutlineService,
                    useValue: {
                        editionOutline: mockOutlineSignal.asReadonly(),
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionStateService = TestBed.inject(EditionStateService);

        // Service spies
        stateServiceUpdateSeriesSpy = vi.spyOn(editionStateService, 'updateSelectedEditionSeries');

        // Create component fixture
        fixture = TestBed.createComponent(EditionSeriesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `editionOutline` to hold the expected outline', () => {
            expectToBe(isSignal(component.editionOutline), true);

            expectToEqual(component.editionOutline(), expectedOutline);
        });

        it('... should have cleared the selected edition series in the constructor (via service)', () => {
            expectSpyCall(stateServiceUpdateSeriesSpy, 1, null);
        });

        describe('VIEW', () => {
            it('... should not contain one div.awg-edition-series-grid yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-grid', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            const getSeriesDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
            const getSeriesTextDes = () =>
                getAndExpectDebugElementByCss(getSeriesDes()[0], 'div.awg-edition-series-text', 1, 1);
            const getSeriesGridDes = () =>
                getAndExpectDebugElementByCss(getSeriesDes()[0], 'div.awg-edition-series-grid', 1, 1);
            const getGridColDes = (expectedLength: number) =>
                getAndExpectDebugElementByCss(getSeriesGridDes()[0], 'div.col', expectedLength, expectedLength);
            const getSeriesCardDes = (expectedLength: number) =>
                getAndExpectDebugElementByCss(
                    getSeriesGridDes()[0],
                    'div.awg-edition-series-card',
                    expectedLength,
                    expectedLength
                );

            it('... should contain one `div.awg-edition-series`', () => {
                getSeriesDes();
            });

            it('... should contain one `div.awg-edition-series-text` in `div.awg-edition-series`', () => {
                getSeriesTextDes();
            });

            it('... should contain two paragraphs in `div.awg-edition-series-text`', () => {
                getAndExpectDebugElementByCss(getSeriesTextDes()[0], 'p', 2, 2);
            });

            it('... should contain one `div.awg-edition-series-grid` in `div.awg-edition-series`', () => {
                getSeriesGridDes();
            });

            it('... should contain as many div.col in `div.awg-edition-series-grid` as there are series', () => {
                getGridColDes(expectedOutline.length);
            });

            it('... should contain a div.awg-edition-series-card in each div.col', () => {
                const colDes = getGridColDes(expectedOutline.length);

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByCss(colDe, 'div.awg-edition-series-card', 1, 1);
                });
            });

            describe('... should contain card layout elements in each series card', () => {
                it.each([
                    { desc: 'a h5.card-header', selector: 'h5.card-header' },
                    { desc: 'a div.card-body', selector: 'div.card-body' },
                    { desc: 'a div.card-footer', selector: 'div.card-footer' },
                ])('... should contain $desc in each div.awg-edition-series-card', ({ selector }) => {
                    const cardDes = getSeriesCardDes(expectedOutline.length);

                    cardDes.forEach(cardDe => {
                        getAndExpectDebugElementByCss(cardDe, selector, 1, 1);
                    });
                });
            });

            it('... should display series name in each h5.card-header', () => {
                const cardDes = getSeriesCardDes(expectedOutline.length);

                cardDes.forEach((cardDe, index) => {
                    const expectedSeries = expectedOutline[index].series;
                    const hDes = getAndExpectDebugElementByCss(cardDe, 'h5.card-header', 1, 1);
                    const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                    expectToBe(hEl.textContent.trim(), expectedSeries.full);
                });
            });

            describe('... div.card-body', () => {
                it('... should contain a ul.list-group in each div.card-body', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const cardBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card-body',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    cardBodyDes.forEach(cardBodyDe => {
                        getAndExpectDebugElementByCss(cardBodyDe, 'ul.list-group', 1, 1);
                    });
                });

                it('... should contain as many li.list-group-item in ul.list-group as there are sections in a series', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSectionsLength = expectedOutline[index].sections.length;

                        getAndExpectDebugElementByCss(
                            ulDe,
                            'li.list-group-item',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );
                    });
                });

                it('... should display section name in each li.list-group-item', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSections = expectedOutline[index].sections;

                        const liDes = getAndExpectDebugElementByCss(
                            ulDe,
                            'li.list-group-item',
                            expectedSections.length,
                            expectedSections.length
                        );

                        liDes.forEach((liDe, liIndex) => {
                            const expectedSection = expectedSections[liIndex].section;
                            const liEl: HTMLLIElement = liDe.nativeElement;

                            expectToBe(liEl.textContent.trim(), expectedSection.full);
                        });
                    });
                });

                it('... should contain a routerLink and no span.text-muted in li.list-group-item if section is not disabled', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSections = expectedOutline[index].sections;

                        const liDes = getAndExpectDebugElementByCss(
                            ulDe,
                            'li.list-group-item',
                            expectedSections.length,
                            expectedSections.length
                        );

                        liDes.forEach((liDe, liIndex) => {
                            const expectedSection = expectedSections[liIndex];

                            if (!expectedSection.disabled) {
                                getAndExpectDebugElementByDirective(liDe, RouterLinkStubDirective, 1, 1);
                                getAndExpectDebugElementByCss(liDe, 'span.text-muted', 0, 0);
                            }
                        });
                    });
                });

                it('... should contain no router link, but a span.text-muted in li.list-group-item if section is disabled', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSections = expectedOutline[index].sections;

                        const liDes = getAndExpectDebugElementByCss(
                            ulDe,
                            'li.list-group-item',
                            expectedSections.length,
                            expectedSections.length
                        );

                        liDes.forEach((liDe, liIndex) => {
                            const expectedSection = expectedSections[liIndex];

                            if (expectedSection.disabled) {
                                getAndExpectDebugElementByDirective(liDe, RouterLinkStubDirective, 0, 0);
                                getAndExpectDebugElementByCss(liDe, 'span.text-muted', 1, 1);
                            }
                        });
                    });
                });
            });

            describe('... div.card-footer', () => {
                it('... should contain a routerLink in each div.card-footer', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-series-card',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    cardDes.forEach(cardDe => {
                        const footerDes = getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);
                        getAndExpectDebugElementByDirective(footerDes[0], RouterLinkStubDirective, 1, 1);
                    });
                });

                it('... should have correct routerLink in each div.card-footer', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-series-card',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSeries = expectedOutline[index].series;

                        const footerDes = getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);

                        const footerLinkDes = getAndExpectDebugElementByDirective(
                            footerDes[0],
                            RouterLinkStubDirective,
                            1,
                            1
                        );
                        const footerLink = footerLinkDes[0].injector.get(RouterLinkStubDirective);

                        const expectedLinkParams = [expectedSeries.route];

                        expectToEqual(footerLink.linkParams, expectedLinkParams);
                    });
                });

                it('... should display correct text in each routerLink in div.card-footer', () => {
                    const expectedSeriesLength = expectedOutline.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    cardDes.forEach(cardDe => {
                        const footerDes = getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);

                        const footerLinkDes = getAndExpectDebugElementByDirective(
                            footerDes[0],
                            RouterLinkStubDirective,
                            1,
                            1
                        );
                        const footerLinkEl: HTMLAnchorElement = footerLinkDes[0].nativeElement;

                        const expectedLinkText = 'Mehr ...';

                        expectToBe(footerLinkEl.textContent.trim(), expectedLinkText);
                    });
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: string | any[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 5, 5);

                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 5);
            });

            it('... can get correct linkParams from template', () => {
                let linkIndex = 0;
                expectedOutline.forEach(series => {
                    series.sections.forEach(section => {
                        if (!section.disabled) {
                            // Check the router link for the section
                            const expectedSectionLinkParams = [series.series.route, 'section', section.section.route];
                            expectToEqual(routerLinks[linkIndex++].linkParams, expectedSectionLinkParams);
                        }
                    });

                    // Check the final router link for the series
                    const expectedSeriesLinkParams = [series.series.route];
                    expectToEqual(routerLinks[linkIndex++].linkParams, expectedSeriesLinkParams);
                });
            });

            it('... can click section link in template', async () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expectToBe(sectionLink.navigatedTo, null);

                await clickAndAwaitChanges(sectionLinkDe, fixture);

                expectToEqual(sectionLink.navigatedTo, ['1', 'section', '5']);
            });

            it('... should navigate to section page when section link is clicked', async () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expectToBe(sectionLink.navigatedTo, null);

                await clickAndAwaitChanges(sectionLinkDe, fixture);

                expectToEqual(sectionLink.navigatedTo, ['1', 'section', '5']);
            });

            it('... can click series link in template', async () => {
                const seriesLinkDe = linkDes[1];
                const seriesLink = routerLinks[1];

                expectToBe(seriesLink.navigatedTo, null);

                await clickAndAwaitChanges(seriesLinkDe, fixture);

                expectToEqual(seriesLink.navigatedTo, ['1']);
            });

            it('... should navigate to series page when series link is clicked', async () => {
                const seriesLinkDe = linkDes[1];
                const seriesLink = routerLinks[1];

                expectToBe(seriesLink.navigatedTo, null);

                await clickAndAwaitChanges(seriesLinkDe, fixture);

                expectToEqual(seriesLink.navigatedTo, ['1']);
            });
        });
    });
});
