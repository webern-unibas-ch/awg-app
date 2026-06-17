import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

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
import { mockStatisticsData } from '@testing/mock-data';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';

import {
    StatisticsComplexBreakdown,
    StatisticsProgressBarConfig,
    StatisticsSectionBreakdown,
    StatisticsSeriesBreakdown,
} from '../models/statistics.model';
import { StatisticsBreakdownBadgeComponent } from '../statistics-breakdown-badge/statistics-breakdown-badge.component';
import { StatisticsProgressBarComponent } from '../statistics-progress-bar/statistics-progress-bar.component';

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
    showPercentageLabel = input<boolean>(true);
    boldPercentageLabel = input<boolean>(false);
    customType = input<string>('');
    useCustomTypeOnly = input<boolean>(false);
}

describe('StatisticsSeriesBreakdownComponent', () => {
    let component: StatisticsSeriesBreakdownComponent;
    let fixture: ComponentFixture<StatisticsSeriesBreakdownComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedSeriesBreakdownData: StatisticsSeriesBreakdown[];

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

        router = TestBed.inject(Router);

        expectedSeriesBreakdownData = [
            structuredClone(mockStatisticsData.mockSeriesBreakdown) as StatisticsSeriesBreakdown,
        ];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('seriesBreakdownData', []);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `seriesBreakdownData` (empty)', () => {
            expectToEqual(component.seriesBreakdownData(), []);
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
            fixture.componentRef.setInput('seriesBreakdownData', expectedSeriesBreakdownData);
            fixture.detectChanges();
        });

        it('... should have updated `seriesBreakdownData`', () => {
            expectToEqual(component.seriesBreakdownData(), expectedSeriesBreakdownData);
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
                        expectedSeriesBreakdownData.length,
                        expectedSeriesBreakdownData.length
                    );
                });

                it('... should contain 5 data cells (td) in each series breakdown row', () => {
                    const seriesTrDes = getAndExpectDebugElementByCss(
                        compDe,
                        'tbody tr.awg-statistics-series-breakdown',
                        expectedSeriesBreakdownData.length,
                        expectedSeriesBreakdownData.length
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
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const strongDes = getAndExpectDebugElementByCss(tdDes[0], 'strong', 1, 1);
                            const strongEl: HTMLElement = strongDes[0].nativeElement;

                            const expectedSeriesLabel = 'Series ' + expectedSeriesBreakdownData[index].series;

                            expectToBe(strongEl.textContent?.trim(), expectedSeriesLabel);
                        });
                    });

                    it('... should mute series label if activeSections is zero', () => {
                        const mockData = structuredClone(expectedSeriesBreakdownData) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 0;
                        fixture.componentRef.setInput('seriesBreakdownData', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
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
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const smallDes = getAndExpectDebugElementByCss(tdDes[0], 'small.text-muted', 1, 1);
                            const smallEl: HTMLElement = smallDes[0].nativeElement;

                            const expectedActiveSectionsText = `(${expectedSeriesBreakdownData[index].activeSections} active section)`;

                            expectToBe(smallEl.classList.contains('text-muted'), true);
                            expectToBe(smallEl.textContent?.trim(), expectedActiveSectionsText);
                        });
                    });

                    it('... should adjust section indicator depending on number of active sections', () => {
                        const mockData = structuredClone(expectedSeriesBreakdownData) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 2;
                        fixture.componentRef.setInput('seriesBreakdownData', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
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
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[1].nativeElement;

                            const strongDes = getAndExpectDebugElementByCss(tdDes[1], 'strong', 1, 1);
                            const strongEl: HTMLElement = strongDes[0].nativeElement;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            expectToBe(
                                strongEl.textContent?.trim(),
                                expectedSeriesBreakdownData[index].totalComplexes.toString()
                            );
                        });
                    });

                    it('... should mute total complexes if activeSections is zero', () => {
                        const mockData = structuredClone(expectedSeriesBreakdownData) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 0;
                        fixture.componentRef.setInput('seriesBreakdownData', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
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
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
                        );

                        seriesTrDes.forEach(seriesTrDe => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[2].nativeElement;
                            const expectedBadgeCount = expectedSeriesBreakdownData[0].totalComplexes > 0 ? 1 : 0;

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
                        const mockData = structuredClone(expectedSeriesBreakdownData) as StatisticsSeriesBreakdown[];
                        mockData[0].totalComplexes = 0;
                        fixture.componentRef.setInput('seriesBreakdownData', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
                        );

                        seriesTrDes.forEach(seriesTrDe => {
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
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
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

                            expectToEqual(
                                badgeCmp.breakdown(),
                                expectedSeriesBreakdownData[index].activeComplexBreakdown
                            );
                        });
                    });
                });

                describe('... fourth series data cell (td)', () => {
                    it('... should display centered active complexes (strong)', () => {
                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
                        );

                        seriesTrDes.forEach((seriesTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(seriesTrDe, 'td', 5, 5);
                            const tdEl: HTMLTableCellElement = tdDes[3].nativeElement;

                            const strongDes = getAndExpectDebugElementByCss(tdDes[3], 'strong', 1, 1);
                            const strongEl: HTMLElement = strongDes[0].nativeElement;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            expectToBe(
                                strongEl.textContent?.trim(),
                                expectedSeriesBreakdownData[index].activeComplexes.toString()
                            );
                        });
                    });

                    it('... should mute active complexes if activeSections is zero', () => {
                        const mockData = structuredClone(expectedSeriesBreakdownData) as StatisticsSeriesBreakdown[];
                        mockData[0].activeSections = 0;
                        fixture.componentRef.setInput('seriesBreakdownData', mockData);
                        fixture.detectChanges();

                        const seriesTrDes = getAndExpectDebugElementByCss(
                            compDe,
                            'tbody tr.awg-statistics-series-breakdown',
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
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
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
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
                            expectedSeriesBreakdownData.length,
                            expectedSeriesBreakdownData.length
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
                                percentage: expectedSeriesBreakdownData[0].progressRate,
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
                // Interface for helper function
                interface SectionTestContext {
                    sectionTrDe: DebugElement;
                    tdDes: DebugElement[];
                    seriesData: StatisticsSeriesBreakdown;
                    sectionData: StatisticsSectionBreakdown;
                }

                // Helper function to get all section rows with their context data for easier testing
                function getAllSectionRows(): SectionTestContext[] {
                    const contexts: SectionTestContext[] = [];

                    const tbodyDes = getAndExpectDebugElementByCss(compDe, 'tbody', 1, 1);
                    expectedSeriesBreakdownData.forEach(series => {
                        const sectionTrDes = getAndExpectDebugElementByCss(
                            tbodyDes[0],
                            `tr.awg-statistics-section-breakdown`,
                            series.sectionBreakdown.length,
                            series.sectionBreakdown.length
                        );

                        sectionTrDes.forEach((sectionTrDe, index) => {
                            const tdDes = getAndExpectDebugElementByCss(sectionTrDe, 'td', 5, 5);
                            contexts.push({
                                sectionTrDe: sectionTrDe,
                                tdDes: tdDes,
                                seriesData: series,
                                sectionData: series.sectionBreakdown[index],
                            });
                        });
                    });
                    return contexts;
                }

                it('... should contain as many section rows in table body as section breakdowns in data', () => {
                    const sectionRows = getAllSectionRows();
                    const expectedSectionRowCount = expectedSeriesBreakdownData.reduce(
                        (sum, series) => sum + series.sectionBreakdown.length,
                        0
                    );

                    expectToBe(sectionRows.length, expectedSectionRowCount);
                });

                it('... should contain 5 data cells (td) in each section breakdown row', () => {
                    const sectionRows = getAllSectionRows();

                    sectionRows.forEach(({ tdDes }) => {
                        expectToBe(tdDes.length, 5);
                    });
                });

                describe('... first section data cell (td)', () => {
                    it('... should display correct section prefixes and labels', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, seriesData, sectionData }) => {
                            // Prefix
                            const spanDes = getAndExpectDebugElementByCss(tdDes[0], 'span', 1, 1);
                            const spanEl: HTMLSpanElement = spanDes[0].nativeElement;
                            expectToBe(spanEl.textContent?.trim(), '└');

                            // Section Label
                            const aDes = getAndExpectDebugElementByCss(tdDes[0], 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;
                            const expectedSectionLabel = `Section ${seriesData.series}/${sectionData.section}`;

                            expectToBe(aEl.textContent?.trim(), expectedSectionLabel);
                        });
                    });

                    it('... should apply correct CSS classes and styles based on disabled state', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            // Prefix
                            const spanDes = getAndExpectDebugElementByCss(tdDes[0], 'span', 1, 1);
                            expectToBe(spanDes[0].nativeElement.classList.contains('text-muted'), true);

                            // Section Label
                            const aDes = getAndExpectDebugElementByCss(tdDes[0], 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                            if (sectionData.disabled) {
                                expectToBe(aEl.classList.contains('text-muted'), true);
                                expectToBe(aEl.classList.contains('pe-none'), true);
                                expectToBe(aEl.style.textDecoration, 'none');
                            } else {
                                expectToBe(aEl.classList.contains('text-muted'), false);
                                expectToBe(aEl.classList.contains('pe-none'), false);
                                expectToBe(aEl.style.textDecoration, '');
                            }
                        });
                    });

                    it('... should bind the correct target paths to RouterLink', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, seriesData, sectionData }) => {
                            const routerLinkDes = getAndExpectDebugElementByDirective(tdDes[0], RouterLink, 1, 1);
                            const routerLinkInstance = routerLinkDes[0].injector.get(RouterLink);

                            if (sectionData.disabled) {
                                expectToBe(routerLinkInstance.urlTree, null);
                            } else {
                                const { edition, series: routeSeries, section: routeSection } = component.ROUTES;
                                const expectedLink = `${edition.route}/${routeSeries.route}/${seriesData.series.length}/${routeSection.route}/${sectionData.section}`;

                                const actualUrl = routerLinkInstance.urlTree?.toString();
                                expectToBe(actualUrl, expectedLink);
                            }
                        });
                    });

                    it('... should navigate to the correct section when clicked', async () => {
                        const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                        const sectionRows = getAllSectionRows();

                        for (const { tdDes, seriesData, sectionData } of sectionRows) {
                            if (sectionData.disabled) {
                                continue;
                            }

                            navigateSpy.mockClear();

                            const aDes = getAndExpectDebugElementByCss(tdDes[0], 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                            click(aEl as HTMLElement);
                            await detectChangesOnPush(fixture);

                            expectSpyCall(navigateSpy, 1);
                            const firstCallArg = navigateSpy.mock.calls[0][0];
                            const actualUrl = firstCallArg.toString();

                            const { edition, series: routeSeries, section: routeSection } = component.ROUTES;
                            const expectedLink = `${edition.route}/${routeSeries.route}/${seriesData.series.length}/${routeSection.route}/${sectionData.section}`;

                            expectToContain(actualUrl, expectedLink);
                        }

                        navigateSpy.mockRestore();
                    });
                });

                describe('... second section data cell (td)', () => {
                    it('... should display centered total complexes', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            const tdEl: HTMLTableCellElement = tdDes[1].nativeElement;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            expectToBe(tdEl.textContent?.trim(), sectionData.totalComplexes.toString());
                        });
                    });

                    it('... should mute total complexes if section is disabled', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            const tdEl: HTMLTableCellElement = tdDes[1].nativeElement;
                            const shouldBeMuted = sectionData.disabled === true;

                            expectToBe(tdEl.classList.contains('text-muted'), shouldBeMuted);
                        });
                    });
                });

                describe('... third section data cell (td)', () => {
                    it('... should contain one centered breakdown badge component if total complexes is greater zero', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            const tdEl: HTMLTableCellElement = tdDes[2].nativeElement;
                            const expectedBadgeCount = sectionData.totalComplexes > 0 ? 1 : 0;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            getAndExpectDebugElementByDirective(
                                tdDes[2],
                                StatisticsBreakdownBadgeStubComponent,
                                expectedBadgeCount,
                                expectedBadgeCount
                            );
                        });
                    });

                    it('... should pass down corect inputs to breakdown badge component', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            const tdEl: HTMLTableCellElement = tdDes[2].nativeElement;
                            const expectedBadgeCount = sectionData.totalComplexes > 0 ? 1 : 0;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            const badgeDes = getAndExpectDebugElementByDirective(
                                tdDes[2],
                                StatisticsBreakdownBadgeStubComponent,
                                expectedBadgeCount,
                                expectedBadgeCount
                            );
                            if (expectedBadgeCount > 0) {
                                const badgeCmp = badgeDes[0].injector.get(StatisticsBreakdownBadgeStubComponent);
                                expectToEqual(badgeCmp.breakdown(), sectionData.activeComplexBreakdown);
                            }
                        });
                    });
                });

                describe('... fourth section data cell (td)', () => {
                    it('... should display centered active complexes', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            const tdEl: HTMLTableCellElement = tdDes[3].nativeElement;

                            expectToBe(tdEl.classList.contains('text-center'), true);
                            expectToBe(tdEl.textContent?.trim(), sectionData.activeComplexes.toString());
                        });
                    });

                    it('... should mute active complexes if section is disabled', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            const tdEl: HTMLTableCellElement = tdDes[3].nativeElement;
                            const shouldBeMuted = sectionData.disabled === true;

                            expectToBe(tdEl.classList.contains('text-muted'), shouldBeMuted);
                        });
                    });
                });

                describe('... fifth section data cell (td)', () => {
                    it('... should contain one progress bar component', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes }) => {
                            getAndExpectDebugElementByDirective(tdDes[4], StatisticsProgressBarStubComponent, 1, 1);
                        });
                    });

                    it('... should pass down corect inputs to progress bar component', () => {
                        const sectionRows = getAllSectionRows();

                        sectionRows.forEach(({ tdDes, sectionData }) => {
                            const progressBarDes = getAndExpectDebugElementByDirective(
                                tdDes[4],
                                StatisticsProgressBarStubComponent,
                                1,
                                1
                            );
                            const progressBarCmp = progressBarDes[0].injector.get(StatisticsProgressBarStubComponent);
                            const expectedPercentage = sectionData.totalComplexes > 0 ? sectionData.progressRate : 0;
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
