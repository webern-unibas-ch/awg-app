import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionOutline } from '@testing/mock-data/mockEditionOutline';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSeriesComponent } from './edition-series.component';

describe('EditionSeriesComponent (DONE)', () => {
    let component: EditionSeriesComponent;
    let fixture: ComponentFixture<EditionSeriesComponent>;
    let compDe: DebugElement;

    let mockEditionStateService: Partial<EditionStateService>;

    let clearSelectionsSpy: Spy;
    let getEditionOutlineSpy: Spy;
    let serviceClearSelectedEditionSeriesSpy: Spy;
    let serviceClearSelectedEditionSectionSpy: Spy;
    let serviceGetEditionOutlineSpy: Spy;

    let expectedEditionOutline: EditionOutlineSeries[];

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(waitForAsync(() => {
        // Mock edition state service
        mockEditionStateService = {
            clearSelectedEditionSeries: () => {},
            clearSelectedEditionSection: () => {},
        };

        TestBed.configureTestingModule({
            declarations: [EditionSeriesComponent, RouterLinkStubDirective],
            providers: [{ provide: EditionStateService, useValue: mockEditionStateService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSeriesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedEditionOutline = EditionOutlineService.getEditionOutline();

        // Spies
        clearSelectionsSpy = spyOn(component, 'clearSelections').and.callThrough();
        getEditionOutlineSpy = spyOn(component, 'getEditionOutline').and.callThrough();
        serviceClearSelectedEditionSeriesSpy = spyOn(
            mockEditionStateService,
            'clearSelectedEditionSeries'
        ).and.callThrough();
        serviceClearSelectedEditionSectionSpy = spyOn(
            mockEditionStateService,
            'clearSelectedEditionSection'
        ).and.callThrough();
        serviceGetEditionOutlineSpy = spyOn(EditionOutlineService, 'getEditionOutline').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const editionStateService = TestBed.inject(EditionStateService);
        expectToBe(mockEditionStateService === editionStateService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionOutline`', () => {
            expect(component.editionOutline).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should not contain one div.awg-edition-series-grid yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-grid', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.editionOutline = expectedEditionOutline;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `editionOutline`', () => {
            expectToEqual(component.editionOutline, expectedEditionOutline);
        });

        it('...should trigger `clearSelections` method on init', () => {
            expectSpyCall(clearSelectionsSpy, 1);
        });

        it('...should trigger `getEditionOutline` method on init', () => {
            expectSpyCall(getEditionOutlineSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-edition-series`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
            });

            it('... should contain one `div.awg-edition-series-text` in `div.awg-edition-series`', () => {
                const seriesDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
                getAndExpectDebugElementByCss(seriesDes[0], 'div.awg-edition-series-text', 1, 1);
            });

            it('... should contain two paragraphs in `div.awg-edition-series-text`', () => {
                const textDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-text', 1, 1);
                getAndExpectDebugElementByCss(textDes[0], 'p', 2, 2);
            });

            it('... should contain one `div.awg-edition-series-grid` in `div.awg-edition-series`', () => {
                const seriesDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series', 1, 1);
                getAndExpectDebugElementByCss(seriesDes[0], 'div.awg-edition-series-grid', 1, 1);
            });

            it('... should contain as many div.col in `div.awg-edition-series-grid` as there are series', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const gridDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-series-grid', 1, 1);

                getAndExpectDebugElementByCss(gridDes[0], 'div.col', expectedSeriesLength, expectedSeriesLength);
            });

            it('... should contain a div.awg-edition-series-card in each div.col', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const colDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByCss(colDe, 'div.awg-edition-series-card', 1, 1);
                });
            });

            it('... should contain a h5.card-header in each div.awg-edition-series-card', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-series-card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDes.forEach(cardDe => {
                    getAndExpectDebugElementByCss(cardDe, 'h5.card-header', 1, 1);
                });
            });

            it('... should display series name in each h5.card-header', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-series-card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDes.forEach((cardDe, index) => {
                    const expectedSeries = expectedEditionOutline[index].series;
                    const h5De = getAndExpectDebugElementByCss(cardDe, 'h5.card-header', 1, 1);
                    const h5El = h5De[0].nativeElement;

                    expectToBe(h5El.textContent.trim(), expectedSeries.full);
                });
            });

            it('... should contain a div.card-body in each div.awg-edition-series-card', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-series-card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDes.forEach(cardDe => {
                    getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                });
            });

            it('... should contain a div.card-footer in each div.awg-edition-series-card', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-series-card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDes.forEach(cardDe => {
                    getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);
                });
            });

            describe('... div.card-body', () => {
                it('... should contain a ul.list-group in each div.card-body', () => {
                    const expectedSeriesLength = expectedEditionOutline.length;

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
                    const expectedSeriesLength = expectedEditionOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSectionsLength = expectedEditionOutline[index].sections.length;

                        getAndExpectDebugElementByCss(
                            ulDe,
                            'li.list-group-item',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );
                    });
                });

                it('... should display section name in each li.list-group-item', () => {
                    const expectedSeriesLength = expectedEditionOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSections = expectedEditionOutline[index].sections;

                        const liDes = getAndExpectDebugElementByCss(
                            ulDe,
                            'li.list-group-item',
                            expectedSections.length,
                            expectedSections.length
                        );

                        liDes.forEach((liDe, liIndex) => {
                            const expectedSection = expectedSections[liIndex].section;
                            const liEl = liDe.nativeElement;

                            expectToBe(liEl.textContent.trim(), expectedSection.full);
                        });
                    });
                });

                it('... should contain a routerLink and no span.text-muted in li.list-group-item if section is not disabled', () => {
                    const expectedSeriesLength = expectedEditionOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSections = expectedEditionOutline[index].sections;

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
                    const expectedSeriesLength = expectedEditionOutline.length;

                    const ulDes = getAndExpectDebugElementByCss(
                        compDe,
                        'ul.list-group',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    ulDes.forEach((ulDe, index) => {
                        const expectedSections = expectedEditionOutline[index].sections;

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
                    const expectedSeriesLength = expectedEditionOutline.length;

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
                    const expectedSeriesLength = expectedEditionOutline.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-series-card',
                        expectedSeriesLength,
                        expectedSeriesLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSeries = expectedEditionOutline[index].series;

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
                    const expectedSeriesLength = expectedEditionOutline.length;

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
                        const footerLinkEl = footerLinkDes[0].nativeElement;

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
                expectedEditionOutline.forEach(series => {
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

            it('... can click section link in template', () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expectToBe(sectionLink.navigatedTo, null);

                click(sectionLinkDe);
                fixture.detectChanges();

                expectToEqual(sectionLink.navigatedTo, ['1', 'section', '5']);
            });

            it('... should navigate to section page when section link is clicked', () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expectToBe(sectionLink.navigatedTo, null);

                click(sectionLinkDe);
                fixture.detectChanges();

                expectToEqual(sectionLink.navigatedTo, ['1', 'section', '5']);
            });

            it('... can click series link in template', () => {
                const seriesLinkDe = linkDes[1];
                const seriesLink = routerLinks[1];

                expectToBe(seriesLink.navigatedTo, null);

                click(seriesLinkDe);
                fixture.detectChanges();

                expectToEqual(seriesLink.navigatedTo, ['1']);
            });

            it('... should navigate to series page when series link is clicked', () => {
                const seriesLinkDe = linkDes[1];
                const seriesLink = routerLinks[1];

                expectToBe(seriesLink.navigatedTo, null);

                click(seriesLinkDe);
                fixture.detectChanges();

                expectToEqual(seriesLink.navigatedTo, ['1']);
            });
        });

        describe('#clearSelections()', () => {
            it('... should have a method `clearSelections`', () => {
                expect(component.clearSelections).toBeDefined();
            });

            it('...should call `clearSelectedEditionSeries` from EditionStateService', () => {
                expectSpyCall(serviceClearSelectedEditionSectionSpy, 1);

                component.clearSelections();

                expectSpyCall(serviceClearSelectedEditionSeriesSpy, 2);
            });

            it('...should call `clearSelectedEditionSection` from EditionStateService', () => {
                expectSpyCall(serviceClearSelectedEditionSectionSpy, 1);

                component.clearSelections();

                expectSpyCall(serviceClearSelectedEditionSeriesSpy, 2);
            });
        });

        describe('#getEditionOutline()', () => {
            it('... should have a method `getEditionOutline`', () => {
                expect(component.getEditionOutline).toBeDefined();
            });

            it('...should call `getEditionOutline` from EditionStateService', () => {
                expectSpyCall(serviceGetEditionOutlineSpy, 1);

                component.getEditionOutline();

                expectSpyCall(serviceGetEditionOutlineSpy, 2);
            });

            it('...should set `editionOutline`', () => {
                const anotherEditionOutline = JSON.parse(JSON.stringify(mockEditionOutline));
                anotherEditionOutline[0].series = EDITION_ROUTE_CONSTANTS.SERIES_2;

                serviceGetEditionOutlineSpy.and.returnValue(anotherEditionOutline);

                component.getEditionOutline();

                expectToEqual(component.editionOutline, anotherEditionOutline);
                expect(component.editionOutline).not.toEqual(expectedEditionOutline);
            });
        });
    });
});
