import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockStatisticsData } from '@testing/mock-data';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import {
    StatisticsComplexBreakdown,
    StatisticsProgressBarConfig,
    StatisticsSeriesBreakdown,
} from '@awg-views/statistics-view/models';
import { StatisticsBreakdownBadgeComponent } from '@awg-views/statistics-view/statistics-breakdown-badge';
import { StatisticsProgressBarComponent } from '@awg-views/statistics-view/statistics-progress-bar';

import { StatisticsSeriesBreakdownComponent } from './statistics-series-breakdown.component';

// Mock components

@Component({
    selector: 'awg-statistics-breakdown-badge',
    template: '',
})
class StatisticsBreakdownBadgeStubComponent {
    breakdown = input<StatisticsComplexBreakdown>(new StatisticsComplexBreakdown());
    containerClasses = input<string>('small text-muted');
    showEmptyBadges = input<boolean>(false);
}

@Component({
    selector: 'awg-statistics-progress-bar',
    template: '',
})
class StatisticsProgressBarStubComponent {
    config = input.required<StatisticsProgressBarConfig>();
    headerLabel = input<string>();
    height = input<string>('15px');
    minWidth = input<string>('120px');
    showPercentageLabel = input<boolean>(true);
    boldPercentageLabel = input<boolean>(false);
    customClasses = input<string>('');
    useCustomClassesOnly = input<boolean>(false);
}

describe('StatisticsSeriesBreakdownComponent', () => {
    let component: StatisticsSeriesBreakdownComponent;
    let fixture: ComponentFixture<StatisticsSeriesBreakdownComponent>;
    let compDe: DebugElement;

    let expectedSeriesBreakdown: StatisticsSeriesBreakdown[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsSeriesBreakdownComponent],
            providers: [provideRouter([])],
        })
            .overrideComponent(StatisticsSeriesBreakdownComponent, {
                remove: { imports: [StatisticsBreakdownBadgeComponent, StatisticsProgressBarComponent] },
                add: { imports: [StatisticsBreakdownBadgeStubComponent, StatisticsProgressBarStubComponent] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StatisticsSeriesBreakdownComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        expectedSeriesBreakdown = [
            structuredClone(mockStatisticsData.mockSeriesBreakdown) as StatisticsSeriesBreakdown,
        ];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('seriesBreakdown', []);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `seriesBreakdown` (empty)', () => {
            expectToEqual(component.seriesBreakdown(), []);
        });

        it('... should have `ROUTES` with edition route constants', () => {
            expectToEqual(component.ROUTES, {
                edition: EDITION_ROUTE_CONSTANTS.EDITION,
                series: EDITION_ROUTE_CONSTANTS.SERIES,
                section: EDITION_ROUTE_CONSTANTS.SECTION,
            });
        });

        describe('VIEW', () => {
            it('... should contain one series breakdown card', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-edition-breakdown.card', 1, 1);
            });

            it('... should contain one card header in series breakdown card', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-edition-breakdown', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card-header', 1, 1);
            });

            it('... should contain one card title in series breakdown card header', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-edition-breakdown', 1, 1);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-header', 1, 1);

                getAndExpectDebugElementByCss(headerDes[0], 'h3.card-title', 1, 1);
            });

            it('... should display correct title in card title', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-edition-breakdown', 1, 1);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-header', 1, 1);
                const hDes = getAndExpectDebugElementByCss(headerDes[0], 'h3.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToEqual(hEl.textContent?.trim(), 'Series & Sections Breakdown');
            });

            it('... should contain one card body in series breakdown card', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-edition-breakdown', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);
            });

            it('... should contain one responsive table div with table in card body', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-edition-breakdown', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.table-responsive > table.table', 1, 1);
            });

            it('... should contain 1 table head with 2 rows in table', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'div.table-responsive > table.table', 1, 1);
                const theadDes = getAndExpectDebugElementByCss(tableDes[0], 'thead', 1, 1);

                getAndExpectDebugElementByCss(theadDes[0], 'tr', 2, 2);
            });

            it('... should contain correct table head content in first header row', () => {
                const theadDes = getAndExpectDebugElementByCss(compDe, 'thead', 1, 1);
                const trDes = getAndExpectDebugElementByCss(theadDes[0], 'tr', 2, 2);
                const thDes = getAndExpectDebugElementByCss(trDes[0], 'th', 3, 3);

                const expectedHeaders = [
                    { text: 'Series / Section', rowspan: '2', colspan: null, classes: 'text-center align-bottom' },
                    {
                        text: 'Complexes',
                        rowspan: null,
                        colspan: '3',
                        classes: 'text-center table-light border-bottom-0',
                    },
                    { text: 'Progress', rowspan: '2', colspan: null, classes: 'text-center align-bottom' },
                ];

                thDes.forEach((thDe, index) => {
                    const expectedHeader = expectedHeaders[index];
                    const thEl: HTMLTableCellElement = thDe.nativeElement;

                    expectToBe(thEl.textContent?.trim(), expectedHeader.text);
                    expectToBe(thEl.getAttribute('rowspan'), expectedHeader.rowspan);
                    expectToBe(thEl.getAttribute('colspan'), expectedHeader.colspan);
                    expectedHeader.classes.split(' ').forEach(headerClass => {
                        expectToBe(thEl.classList.contains(headerClass), true);
                    });
                });
            });

            it('... should contain correct table head content in second header row', () => {
                const theadDes = getAndExpectDebugElementByCss(compDe, 'thead', 1, 1);
                const trDes = getAndExpectDebugElementByCss(theadDes[0], 'tr', 2, 2);
                const thDes = getAndExpectDebugElementByCss(trDes[1], 'th', 3, 3);

                const expectedHeaders = [
                    { text: 'Total', classes: 'text-center' },
                    { text: 'Distribution', classes: 'text-center' },
                    { text: 'Active', classes: 'text-center' },
                ];

                thDes.forEach((thDe, index) => {
                    const expectedHeader = expectedHeaders[index];
                    const thEl: HTMLTableCellElement = thDe.nativeElement;

                    expectToBe(thEl.textContent?.trim(), expectedHeader.text);
                    expectedHeader.classes.split(' ').forEach(headerClass => {
                        expectToBe(thEl.classList.contains(headerClass), true);
                    });
                });
            });

            it('... should contain one table body with no content yet in table', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'div.table-responsive > table.table', 1, 1);

                const tbodyDes = getAndExpectDebugElementByCss(tableDes[0], 'tbody', 1, 1);
                getAndExpectDebugElementByCss(tbodyDes[0], 'tr', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent updating the input signals
            fixture.componentRef.setInput('seriesBreakdown', expectedSeriesBreakdown);
            fixture.detectChanges();
        });

        it('... should have updated `seriesBreakdown`', () => {
            expectToEqual(component.seriesBreakdown(), expectedSeriesBreakdown);
        });

        it('... should have `ROUTES` with edition route constants unchanged', () => {
            expectToEqual(component.ROUTES, {
                edition: EDITION_ROUTE_CONSTANTS.EDITION,
                series: EDITION_ROUTE_CONSTANTS.SERIES,
                section: EDITION_ROUTE_CONSTANTS.SECTION,
            });
        });

        describe('VIEW', () => {
            describe('Series Breakdown Rows', () => {
                it('... should contain as many series breakdown rows in table body as series breakdowns in data', () => {
                    const tbodyDes = getAndExpectDebugElementByCss(compDe, 'tbody', 1, 1);

                    getAndExpectDebugElementByCss(
                        tbodyDes[0],
                        'tr.awg-statistics-series-breakdown',
                        expectedSeriesBreakdown.length,
                        expectedSeriesBreakdown.length
                    );
                });

                it('... should contain 5 data cells (td) in each series breakdown row', () => {
                    const seriesTrDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tbody tr.awg-statistics-series-breakdown',
                        expectedSeriesBreakdown.length,
                        expectedSeriesBreakdown.length
                    );

                    seriesTrDes.forEach(seriesTrDe => {
                        getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                    });
                });

                describe('... first series data cell (td)', () => {
                    it('... should display correct series label (strong)', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const strongDes = getAndExpectDebugElementByCss(tdDes[0], 'strong', 1, 1);
                            const strongEl: HTMLElement = strongDes[0].nativeElement;

                            const expectedSeriesLabel = 'Series ' + expectedSeriesBreakdown[index].series;

                            expectToBe(strongEl.textContent?.trim(), expectedSeriesLabel);
                        });
                    });

                    it('... should mute series label if activeSections is zero', () => {
                        const mockData = structuredClone(expectedSeriesBreakdown) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 0;
                        fixture.componentRef.setInput('seriesBreakdown', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const strongDes = getAndExpectDebugElementByCss(tdDes[0], 'strong', 1, 1);
                            const strongEl: HTMLElement = strongDes[0].nativeElement;
                            const shouldBeMuted = mockData[index].activeSections === 0;

                            expectToBe(strongEl.classList.contains('text-muted'), shouldBeMuted);
                        });
                    });

                    it('... should have a small, muted indication of active sections', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const smallDes = getAndExpectDebugElementByCss(tdDes[0], 'small.text-muted', 1, 1);
                            const smallEl: HTMLElement = smallDes[0].nativeElement;

                            const expectedActiveSectionsText = `(${expectedSeriesBreakdown[index].activeSections} active section)`;

                            expectToBe(smallEl.classList.contains('text-muted'), true);
                            expectToBe(smallEl.textContent?.trim(), expectedActiveSectionsText);
                        });
                    });

                    it('... should adjust section indicator depending on number of active sections', () => {
                        const mockData = structuredClone(expectedSeriesBreakdown) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 2;
                        fixture.componentRef.setInput('seriesBreakdown', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const smallDes = getAndExpectDebugElementByCss(tdDes[0], 'small.text-muted', 1, 1);
                            const smallEl: HTMLElement = smallDes[0].nativeElement;

                            const expectedActiveSectionsText = `(${mockData[index].activeSections} active sections)`;

                            expectToBe(smallEl.textContent?.trim(), expectedActiveSectionsText);
                        });
                    });
                });

                describe('... second series data cell (td)', () => {
                    it('... should display centered total complexes (strong)', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[1].nativeElement;

                            const strongDes = getAndExpectDebugElementByCss(tdDes[1], 'strong', 1, 1);
                            const strongEl: HTMLElement = strongDes[0].nativeElement;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            expectToBe(
                                strongEl.textContent?.trim(),
                                expectedSeriesBreakdown[index].totalComplexes.toString()
                            );
                        });
                    });

                    it('... should mute total complexes if activeSections is zero', () => {
                        const mockData = structuredClone(expectedSeriesBreakdown) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 0;
                        fixture.componentRef.setInput('seriesBreakdown', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[1].nativeElement;
                            const shouldBeMuted = mockData[index].activeSections === 0;

                            expectToBe(tdEl.classList.contains('text-muted'), shouldBeMuted);
                        });
                    });
                });

                describe('... third series data cell (td)', () => {
                    it('... should have centered breakdown badge component if total complexes is greater zero', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach(seriesTrDe => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[2].nativeElement;
                            const expectedBadgeCount = expectedSeriesBreakdown[0].totalComplexes > 0 ? 1 : 0;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            getAndExpectDebugElementByDirective(
                                tdDes[2],
                                StatisticsBreakdownBadgeStubComponent,
                                expectedBadgeCount,
                                expectedBadgeCount
                            );
                        });
                    });

                    it('... should not have breakdown badge component if total complexes is zero', () => {
                        const mockData = structuredClone(expectedSeriesBreakdown) as StatisticsSeriesBreakdown[];
                        mockData[0].totalComplexes = 0;
                        fixture.componentRef.setInput('seriesBreakdown', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const expectedBadgeCount = mockData[0].totalComplexes > 0 ? 1 : 0;

                            getAndExpectDebugElementByDirective(
                                tdDes[2],
                                StatisticsBreakdownBadgeStubComponent,
                                expectedBadgeCount,
                                expectedBadgeCount
                            );
                        });
                    });

                    it('... should pass down corect inputs to breakdown badge component', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const badgeDes = getAndExpectDebugElementByDirective(
                                tdDes[2],
                                StatisticsBreakdownBadgeStubComponent,
                                1,
                                1
                            );
                            const badgeCmp = badgeDes[0].injector.get(StatisticsBreakdownBadgeStubComponent);

                            expectToEqual(badgeCmp.breakdown(), expectedSeriesBreakdown[index].activeComplexBreakdown);
                        });
                    });
                });

                describe('... fourth series data cell (td)', () => {
                    it('... should display centered active complexes (strong)', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[3].nativeElement;

                            const strongDes = getAndExpectDebugElementByCss(tdDes[3], 'strong', 1, 1);
                            const strongEl: HTMLElement = strongDes[0].nativeElement;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            expectToBe(
                                strongEl.textContent?.trim(),
                                expectedSeriesBreakdown[index].activeComplexes.toString()
                            );
                        });
                    });

                    it('... should mute active complexes if activeSections is zero', () => {
                        const mockData = structuredClone(expectedSeriesBreakdown) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 0;
                        fixture.componentRef.setInput('seriesBreakdown', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[3].nativeElement;
                            const shouldBeMuted = mockData[index].activeSections === 0;

                            expectToBe(tdEl.classList.contains('text-muted'), shouldBeMuted);
                        });
                    });
                });

                describe('... fifth series data cell (td)', () => {
                    it('... should have progress bar component', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach(seriesTrDe => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            getAndExpectDebugElementByDirective(tdDes[4], StatisticsProgressBarStubComponent, 1, 1);
                        });
                    });

                    it('... should pass down corect inputs to progress bar component', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdown.length,
                            expectedSeriesBreakdown.length
                        );

                        seriesTrDes.forEach(seriesTrDe => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const progressBarDes = getAndExpectDebugElementByDirective(
                                tdDes[4],
                                StatisticsProgressBarStubComponent,
                                1,
                                1
                            );
                            const progressBarCmp = progressBarDes[0].injector.get(StatisticsProgressBarStubComponent);
                            const expectedConfig: StatisticsProgressBarConfig = {
                                mode: 'percentage',
                                percentage: expectedSeriesBreakdown[0].progressRate,
                            };
                            const expectedHeight = '20px';
                            const expectedBoldPercentageLabel = true;

                            expectToEqual(progressBarCmp.config(), expectedConfig);
                            expectToBe(progressBarCmp.height(), expectedHeight);
                            expectToBe(progressBarCmp.boldPercentageLabel(), expectedBoldPercentageLabel);
                        });
                    });
                });
            });

            describe('Section Breakdown Rows', () => {
                it('... should contain as many section rows in table body as section breakdowns in data', () => {
                    const tbodyDes = getAndExpectDebugElementByCss(compDe, 'tbody', 1, 1);

                    expectedSeriesBreakdown.forEach(series => {
                        const expectedSectionRows = series.sectionBreakdown.length;
                        getAndExpectDebugElementByCss(
                            tbodyDes[0],
                            `tr.awg-statistics-section-breakdown`,
                            expectedSectionRows,
                            expectedSectionRows
                        );
                    });
                });

                it('... should contain 5 data cells (td) in each section breakdown row', () => {
                    expectedSeriesBreakdown.forEach(series => {
                        const expectedSectionRows = series.sectionBreakdown.length;
                        const sectionTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            `tr.awg-statistics-section-breakdown`,
                            expectedSectionRows,
                            expectedSectionRows
                        );
                        sectionTrDes.forEach(sectionTrDe => {
                            getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                        });
                    });
                });

                describe('... first section data cell (td)', () => {
                    it('... should display correct section label', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);

                                // Span prefix
                                const spanDes = getAndExpectDebugElementByCss(tdDes[0], 'span', 1, 1);
                                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;
                                const expectedSectionPrefix = '└ ';

                                expectToBe(spanEl.classList.contains('text-muted'), true);
                                expectToBe(spanEl.textContent?.trim(), expectedSectionPrefix.trim());

                                // Link with section label
                                const aDes = getAndExpectDebugElementByCss(tdDes[0], 'a', 1, 1);
                                const aEl: HTMLAnchorElement = aDes[0].nativeElement;
                                const section = series.sectionBreakdown[index];
                                const expectedSectionLabel = 'Section ' + series.series + '/' + section.section;

                                expectToBe(aEl.textContent?.trim(), expectedSectionLabel);

                                if (section.disabled) {
                                    expectToBe(aEl.classList.contains('text-muted'), true);
                                    expectToBe(aEl.classList.contains('pe-none'), true);
                                    expectToBe(aEl.style.textDecoration, 'none');
                                    const routerLinkDes = getAndExpectDebugElementByDirective(
                                        tdDes[0],
                                        RouterLink,
                                        1,
                                        1
                                    );
                                    const routerLinkInstance = routerLinkDes[0].injector.get(RouterLink);
                                    expectToBe(routerLinkInstance.href, null);
                                } else {
                                    expectToBe(aEl.classList.contains('text-muted'), false);
                                    expectToBe(aEl.classList.contains('pe-none'), false);
                                    expectToBe(aEl.style.textDecoration, '');

                                    const routerLinkDes = getAndExpectDebugElementByDirective(
                                        tdDes[0],
                                        RouterLink,
                                        1,
                                        1
                                    );
                                    const routerLinkInstance = routerLinkDes[0].injector.get(RouterLink);
                                    const { edition, series: routeSeries, section: routeSection } = component.ROUTES;
                                    const expectedLink = `${edition.route}/${routeSeries.route}/${series.series.length}/${routeSection.route}/${section.section}`;

                                    expectToBe(routerLinkInstance.href, expectedLink);
                                }
                            });
                        });
                    });
                });

                describe('... second section data cell (td)', () => {
                    it('... should display centered total complexes', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                const tdEl: HTMLTableCellElement = tdDes[1].nativeElement;
                                const section = series.sectionBreakdown[index];

                                expectToBe(tdEl.classList.contains('text-center'), true);
                                expectToBe(tdEl.textContent?.trim(), section.totalComplexes.toString());
                            });
                        });
                    });

                    it('... should mute total complexes if section is disabled', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                const tdEl: HTMLTableCellElement = tdDes[1].nativeElement;
                                const section = series.sectionBreakdown[index];
                                const shouldBeMuted = section.disabled === true;

                                expectToBe(tdEl.classList.contains('text-muted'), shouldBeMuted);
                            });
                        });
                    });
                });

                describe('... third section data cell (td)', () => {
                    it('... should have centered breakdown badge component if total complexes is greater zero', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                const tdEl: HTMLTableCellElement = tdDes[2].nativeElement;
                                const section = series.sectionBreakdown[index];
                                const expectedBadgeCount = section.totalComplexes > 0 ? 1 : 0;

                                expectToBe(tdEl.classList.contains('text-center'), true);
                                getAndExpectDebugElementByDirective(
                                    tdDes[2],
                                    StatisticsBreakdownBadgeStubComponent,
                                    expectedBadgeCount,
                                    expectedBadgeCount
                                );
                            });
                        });
                    });

                    it('... should pass down corect inputs to breakdown badge component', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                const tdEl: HTMLTableCellElement = tdDes[2].nativeElement;
                                const section = series.sectionBreakdown[index];
                                const expectedBadgeCount = section.totalComplexes > 0 ? 1 : 0;

                                expectToBe(tdEl.classList.contains('text-center'), true);
                                const badgeDes = getAndExpectDebugElementByDirective(
                                    tdDes[2],
                                    StatisticsBreakdownBadgeStubComponent,
                                    expectedBadgeCount,
                                    expectedBadgeCount
                                );
                                if (expectedBadgeCount > 0) {
                                    const badgeCmp = badgeDes[0].injector.get(StatisticsBreakdownBadgeStubComponent);
                                    expectToEqual(badgeCmp.breakdown(), section.activeComplexBreakdown);
                                }
                            });
                        });
                    });
                });

                describe('... fourth section data cell (td)', () => {
                    it('... should display centered active complexes', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                const tdEl: HTMLTableCellElement = tdDes[3].nativeElement;
                                const section = series.sectionBreakdown[index];

                                expectToBe(tdEl.classList.contains('text-center'), true);
                                expectToBe(tdEl.textContent?.trim(), section.activeComplexes.toString());
                            });
                        });
                    });

                    it('... should mute active complexes if section is disabled', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                const tdEl: HTMLTableCellElement = tdDes[3].nativeElement;
                                const section = series.sectionBreakdown[index];
                                const shouldBeMuted = section.disabled === true;

                                expectToBe(tdEl.classList.contains('text-muted'), shouldBeMuted);
                            });
                        });
                    });
                });

                describe('... fifth section data cell (td)', () => {
                    it('... should have progress bar component', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach(sectionTrDe => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                getAndExpectDebugElementByDirective(tdDes[4], StatisticsProgressBarStubComponent, 1, 1);
                            });
                        });
                    });

                    it('... should pass down corect inputs to progress bar component', () => {
                        expectedSeriesBreakdown.forEach(series => {
                            const expectedSectionRows = series.sectionBreakdown.length;
                            const sectionTrDes = getAndExpectDebugElementByCss(
                                compDe,
                                `tr.awg-statistics-section-breakdown`,
                                expectedSectionRows,
                                expectedSectionRows
                            );

                            sectionTrDes.forEach((sectionTrDe, index) => {
                                const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                                const progressBarDes = getAndExpectDebugElementByDirective(
                                    tdDes[4],
                                    StatisticsProgressBarStubComponent,
                                    1,
                                    1
                                );

                                const progressBarCmp = progressBarDes[0].injector.get(
                                    StatisticsProgressBarStubComponent
                                );
                                const section = series.sectionBreakdown[index];
                                const expectedPercentage = section.totalComplexes > 0 ? section.progressRate : 0;
                                const expectedConfig: StatisticsProgressBarConfig = {
                                    mode: 'percentage',
                                    percentage: expectedPercentage,
                                };

                                expectToEqual(progressBarCmp.config(), expectedConfig);
                            });
                        });
                    });
                });
            });
        });
    });
});
