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
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EDITION_OUTLINE_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

import { EditionSeriesComponent } from './edition-series.component';

describe('EditionSeriesComponent (DONE)', () => {
    let component: EditionSeriesComponent;
    let fixture: ComponentFixture<EditionSeriesComponent>;
    let compDe: DebugElement;

    let mockEditionService: Partial<EditionService>;

    let clearSelectionsSpy: Spy;
    let getEditionOutlineSpy: Spy;
    let serviceClearSelectedEditionSeriesSpy: Spy;
    let serviceClearSelectedEditionSectionSpy: Spy;
    let serviceGetEditionOutlineSpy: Spy;

    let expectedEditionOutline: EditionOutlineSeries[];

    beforeEach(waitForAsync(() => {
        mockEditionService = {
            clearSelectedEditionSeries: () => {},
            clearSelectedEditionSection: () => {},
            getEditionOutline: (): EditionOutlineSeries[] => EDITION_OUTLINE_DATA,
        };
        TestBed.configureTestingModule({
            declarations: [EditionSeriesComponent, RouterLinkStubDirective],
            providers: [{ provide: EditionService, useValue: mockEditionService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSeriesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedEditionOutline = EDITION_OUTLINE_DATA;

        // Spies
        clearSelectionsSpy = spyOn(component, 'clearSelections').and.callThrough();
        getEditionOutlineSpy = spyOn(component, 'getEditionOutline').and.callThrough();
        serviceClearSelectedEditionSeriesSpy = spyOn(
            mockEditionService,
            'clearSelectedEditionSeries'
        ).and.callThrough();
        serviceClearSelectedEditionSectionSpy = spyOn(
            mockEditionService,
            'clearSelectedEditionSection'
        ).and.callThrough();
        serviceGetEditionOutlineSpy = spyOn(mockEditionService, 'getEditionOutline').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const editionService = TestBed.inject(EditionService);
        expectToBe(mockEditionService === editionService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `editionOutline`', () => {
            expect(component.editionOutline).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should not contain one div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Component.editionOutline = expectedEditionOutline;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `editionOutline`', () => {
            expect(component.editionOutline).toBeDefined();
            expect(component.editionOutline).toEqual(expectedEditionOutline);
        });

        it('...should trigger `clearSelections` method on init', () => {
            expectSpyCall(clearSelectionsSpy, 1);
        });

        it('...should trigger `getEditionOutline` method on init', () => {
            expectSpyCall(getEditionOutlineSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            });

            it('... should contain as many div.col in div.row as there are series', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);

                getAndExpectDebugElementByCss(rowDe[0], 'div.col', expectedSeriesLength, expectedSeriesLength);
            });

            it('... should contain a div.card in each div.col', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const colDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.col',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                colDe.forEach((de, _index) => {
                    getAndExpectDebugElementByCss(de, 'div.card', 1, 1);
                });
            });

            it('... should contain a h5.card-header in each div.card', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDe.forEach((de, _index) => {
                    getAndExpectDebugElementByCss(de, 'h5.card-header', 1, 1);
                });
            });

            it('... should display series name in each h5.card-header', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDe.forEach((de, index) => {
                    const expectedSeries = expectedEditionOutline[index].series;
                    const h5De = getAndExpectDebugElementByCss(de, 'h5.card-header', 1, 1);
                    const h5El = h5De[0].nativeElement;

                    expectToBe(h5El.textContent.trim(), expectedSeries.full);
                });
            });

            it('... should contain a div.card-body in each div.card', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDe.forEach((de, _index) => {
                    getAndExpectDebugElementByCss(de, 'div.card-body', 1, 1);
                });
            });

            it('... should contain a ul.list-group in each div.card-body', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardBodyDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-body',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardBodyDe.forEach((de, _index) => {
                    getAndExpectDebugElementByCss(de, 'ul.list-group', 1, 1);
                });
            });

            it('... should contain as many li.list-group-item in ul.list-group as there are sections in a series', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const ulDe = getAndExpectDebugElementByCss(
                    compDe,
                    'ul.list-group',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                ulDe.forEach((de, index) => {
                    const expectedSectionsLength = expectedEditionOutline[index].sections.length;

                    getAndExpectDebugElementByCss(
                        de,
                        'li.list-group-item',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );
                });
            });

            it('... should display section name in each li.list-group-item', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const ulDe = getAndExpectDebugElementByCss(
                    compDe,
                    'ul.list-group',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                ulDe.forEach((de, index) => {
                    const expectedSections = expectedEditionOutline[index].sections;

                    const liDe = getAndExpectDebugElementByCss(
                        de,
                        'li.list-group-item',
                        expectedSections.length,
                        expectedSections.length
                    );

                    liDe.forEach((li, liIndex) => {
                        const expectedSection = expectedSections[liIndex].section;
                        const liEl = li.nativeElement;

                        expectToBe(liEl.textContent.trim(), expectedSection.full);
                    });
                });
            });

            it('... should contain a routerLink and no span.text-muted in li.list-group-item if section is not disabled', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const ulDe = getAndExpectDebugElementByCss(
                    compDe,
                    'ul.list-group',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                ulDe.forEach((de, index) => {
                    const expectedSections = expectedEditionOutline[index].sections;

                    const liDe = getAndExpectDebugElementByCss(
                        de,
                        'li.list-group-item',
                        expectedSections.length,
                        expectedSections.length
                    );

                    liDe.forEach((li, liIndex) => {
                        const expectedSection = expectedSections[liIndex];

                        if (!expectedSection.disabled) {
                            getAndExpectDebugElementByDirective(li, RouterLinkStubDirective, 1, 1);
                            getAndExpectDebugElementByCss(li, 'span.text-muted', 0, 0);
                        }
                    });
                });
            });

            it('... should contain no router link, but a span.text-muted in li.list-group-item if section is disabled', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const ulDe = getAndExpectDebugElementByCss(
                    compDe,
                    'ul.list-group',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                ulDe.forEach((de, index) => {
                    const expectedSections = expectedEditionOutline[index].sections;

                    const liDe = getAndExpectDebugElementByCss(
                        de,
                        'li.list-group-item',
                        expectedSections.length,
                        expectedSections.length
                    );

                    liDe.forEach((li, liIndex) => {
                        const expectedSection = expectedSections[liIndex];

                        if (expectedSection.disabled) {
                            getAndExpectDebugElementByDirective(li, RouterLinkStubDirective, 0, 0);
                            getAndExpectDebugElementByCss(li, 'span.text-muted', 1, 1);
                        }
                    });
                });
            });

            it('... should contain a div.card-footer in each div.card', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDe.forEach((de, _index) => {
                    getAndExpectDebugElementByCss(de, 'div.card-footer', 1, 1);
                });
            });

            it('... should contain a routerLink in each div.card-footer', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDe.forEach((de, _index) => {
                    const footerDe = getAndExpectDebugElementByCss(de, 'div.card-footer', 1, 1);
                    getAndExpectDebugElementByDirective(footerDe[0], RouterLinkStubDirective, 1, 1);
                });
            });

            it('... should have correct routerLink in each div.card-footer', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDe.forEach((de, index) => {
                    const expectedSeries = expectedEditionOutline[index].series;

                    const footerDe = getAndExpectDebugElementByCss(de, 'div.card-footer', 1, 1);

                    const footerLinkDe = getAndExpectDebugElementByDirective(
                        footerDe[0],
                        RouterLinkStubDirective,
                        1,
                        1
                    );
                    const footerLink = footerLinkDe[0].injector.get(RouterLinkStubDirective);

                    const expectedLinkParams = [expectedSeries.route];

                    expect(footerLink.linkParams).toEqual(expectedLinkParams);
                });
            });

            it('... should display correct text in each routerLink in div.card-footer', () => {
                const expectedSeriesLength = expectedEditionOutline.length;

                const cardDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card',
                    expectedSeriesLength,
                    expectedSeriesLength
                );

                cardDe.forEach((de, _index) => {
                    const footerDe = getAndExpectDebugElementByCss(de, 'div.card-footer', 1, 1);

                    const footerLinkDe = getAndExpectDebugElementByDirective(
                        footerDe[0],
                        RouterLinkStubDirective,
                        1,
                        1
                    );
                    const footerLinkEl = footerLinkDe[0].nativeElement;

                    const expectedLinkText = 'Mehr ...';

                    expectToBe(footerLinkEl.textContent.trim(), expectedLinkText);
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
                EDITION_OUTLINE_DATA.forEach((series, _seriesIndex) => {
                    series.sections.forEach((section, _sectionIndex) => {
                        if (!section.disabled) {
                            // Check the router link for the section
                            const expectedSectionLinkParams = [series.series.route, 'section', section.section.route];
                            expect(routerLinks[linkIndex++].linkParams).toEqual(expectedSectionLinkParams);
                        }
                    });

                    // Check the final router link for the series
                    const expectedSeriesLinkParams = [series.series.route];
                    expect(routerLinks[linkIndex++].linkParams).toEqual(expectedSeriesLinkParams);
                });
            });

            it('... can click section link in template', () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expect(sectionLink.navigatedTo).toBeNull();

                click(sectionLinkDe);
                fixture.detectChanges();

                expectToEqual(sectionLink.navigatedTo, ['1', 'section', '5']);
            });

            it('... should navigate to section page when section link is clicked', () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expect(sectionLink.navigatedTo).toBeNull();

                click(sectionLinkDe);
                fixture.detectChanges();

                expectToEqual(sectionLink.navigatedTo, ['1', 'section', '5']);
            });

            it('... can click series link in template', () => {
                const seriesLinkDe = linkDes[1];
                const seriesLink = routerLinks[1];

                expect(seriesLink.navigatedTo).toBeNull();

                click(seriesLinkDe);
                fixture.detectChanges();

                expectToEqual(seriesLink.navigatedTo, ['1']);
            });

            it('... should navigate to section page when section link is clicked', () => {
                const seriesLinkDe = linkDes[1];
                const seriesLink = routerLinks[1];

                expect(seriesLink.navigatedTo).toBeNull();

                click(seriesLinkDe);
                fixture.detectChanges();

                expectToEqual(seriesLink.navigatedTo, ['1']);
            });
        });

        describe('#clearSelections()', () => {
            it('... should have a method `clearSelections`', () => {
                expect(component.clearSelections).toBeDefined();
            });

            it('...should call `clearSelectedEditionSeries` from EditionService', () => {
                expectSpyCall(serviceClearSelectedEditionSectionSpy, 1);

                component.clearSelections();

                expectSpyCall(serviceClearSelectedEditionSeriesSpy, 2);
            });

            it('...should call `clearSelectedEditionSection` from EditionService', () => {
                expectSpyCall(serviceClearSelectedEditionSectionSpy, 1);

                component.clearSelections();

                expectSpyCall(serviceClearSelectedEditionSeriesSpy, 2);
            });
        });

        describe('#getEditionOutline()', () => {
            it('... should have a method `getEditionOutline`', () => {
                expect(component.getEditionOutline).toBeDefined();
            });

            it('...should call `getEditionOutline` from EditionService', () => {
                expectSpyCall(serviceGetEditionOutlineSpy, 1);

                component.getEditionOutline();

                expectSpyCall(serviceGetEditionOutlineSpy, 2);
            });

            it('...should set `editionOutline`', () => {
                const anotherEditionOutline = JSON.parse(JSON.stringify(EDITION_OUTLINE_DATA));
                anotherEditionOutline[0].series = EDITION_ROUTE_CONSTANTS.SERIES_2;

                serviceGetEditionOutlineSpy.and.returnValue(anotherEditionOutline);

                component.getEditionOutline();

                expectToEqual(component.editionOutline, anotherEditionOutline);
                expect(component.editionOutline).not.toEqual(expectedEditionOutline);
            });
        });
    });
});
