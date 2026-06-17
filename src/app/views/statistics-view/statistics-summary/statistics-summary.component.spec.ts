import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { faCheckCircle, faFolder, faList, faMusic, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { StatisticsSummaryCardData, StatisticsSummaryData } from '../models/statistics.model';
import { StatisticsSummaryCardComponent } from '../statistics-summary-card/statistics-summary-card.component';

import { StatisticsSummaryComponent } from './statistics-summary.component';

// Mock components
@Component({
    selector: 'awg-statistics-summary-card',
    template: '',
})
class StatisticsSummaryCardStubComponent {
    title = input<string>();
    value = input<number | string>();
    icon = input<IconDefinition>();
    bgClass = input<string>();
}

describe('StatisticsSummaryComponent', () => {
    let component: StatisticsSummaryComponent;
    let fixture: ComponentFixture<StatisticsSummaryComponent>;
    let compDe: DebugElement;

    let expectedSummaryData: StatisticsSummaryData;
    let expectedSummaryCards: StatisticsSummaryCardData[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsSummaryComponent],
        })
            .overrideComponent(StatisticsSummaryComponent, {
                remove: { imports: [StatisticsSummaryCardComponent] },
                add: { imports: [StatisticsSummaryCardStubComponent] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StatisticsSummaryComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSummaryData = {
            activeSeries: 5,
            activeSections: 10,
            activeComplexes: 8,
            totalComplexes: 15,
        };

        expectedSummaryCards = [
            { title: 'Active Series', value: expectedSummaryData.activeSeries, icon: faList, bgClass: 'bg-primary' },
            {
                title: 'Active Sections',
                value: expectedSummaryData.activeSections,
                icon: faFolder,
                bgClass: 'bg-info',
            },
            {
                title: 'Total Complexes',
                value: expectedSummaryData.totalComplexes,
                icon: faMusic,
                bgClass: 'bg-secondary',
            },
            {
                title: 'Active Complexes',
                value: expectedSummaryData.activeComplexes,
                icon: faCheckCircle,
                bgClass: 'bg-success',
            },
        ];

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('summaryData', {
            activeSeries: 0,
            activeSections: 0,
            activeComplexes: 0,
            totalComplexes: 0,
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `summaryData`', () => {
            expectToEqual(component.summaryData(), {
                activeSeries: 0,
                activeSections: 0,
                activeComplexes: 0,
                totalComplexes: 0,
            });
        });

        describe('VIEW', () => {
            it('... should contain no cards div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary-card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent updating the input signal
            fixture.componentRef.setInput('summaryData', expectedSummaryData);
            fixture.detectChanges();
        });

        it('... should have updated `summaryData`', () => {
            expectToEqual(component.summaryData(), expectedSummaryData);
        });

        it('... should have computed `summaryCards` based on `statisticsData`', () => {
            const summaryCards = component.summaryCards();

            expectToBe(summaryCards.length, 4);
            summaryCards.forEach((card, index) => {
                expectToBe(card.title, expectedSummaryCards[index].title);
                expectToBe(card.value, expectedSummaryCards[index].value);
                expectToEqual(card.icon, expectedSummaryCards[index].icon);
                expectToBe(card.bgClass, expectedSummaryCards[index].bgClass);
            });
        });

        describe('VIEW', () => {
            it('... should contain one cards div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
            });

            it('... should have correct classes on cards div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                const cardsEl: HTMLElement = cardsDes[0].nativeElement;

                expectToBe(cardsEl.classList.length, 3);
                expectToContain(cardsEl.classList, 'awg-statistics-summary');
                expectToContain(cardsEl.classList, 'row');
                expectToContain(cardsEl.classList, 'mb-4');
            });

            it('... should contain 4 div.col components in cards div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                getAndExpectDebugElementByCss(cardsDes[0], 'div.col-md-3.mb-3', 4, 4);
            });

            it('... should contain one card component (stubbed) in each col div', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                const colDes = getAndExpectDebugElementByCss(cardsDes[0], 'div.col-md-3.mb-3', 4, 4);

                colDes.forEach(colDe => {
                    getAndExpectDebugElementByDirective(colDe, StatisticsSummaryCardStubComponent, 1, 1);
                });
            });

            it('... should pass down correct card data to each card component', () => {
                const cardsDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-summary', 1, 1);
                const cardDes = getAndExpectDebugElementByDirective(
                    cardsDes[0],
                    StatisticsSummaryCardStubComponent,
                    expectedSummaryCards.length,
                    expectedSummaryCards.length
                );

                expectedSummaryCards.forEach((card, index) => {
                    const cardCmp = cardDes[index].injector.get(StatisticsSummaryCardStubComponent);

                    expectToBe(cardCmp.title(), card.title);
                    expectToBe(cardCmp.value(), card.value);
                    expectToEqual(cardCmp.icon(), card.icon);
                    expectToBe(cardCmp.bgClass(), card.bgClass);
                });
            });
        });

        describe('#summaryCards', () => {
            it('... should have a computed signal `summaryCards`', () => {
                expect(component.summaryCards).toBeDefined();
            });

            it('... should return empty array if `summaryData` is null', () => {
                fixture.componentRef.setInput('summaryData', null);

                const summaryCards = component.summaryCards();

                expectToBe(summaryCards.length, 0);
                expectToEqual(summaryCards, []);
            });

            it('... should return correct summary card data based on summaryData input', () => {
                fixture.componentRef.setInput('summaryData', expectedSummaryData);

                const summaryCards = component.summaryCards();

                expectToBe(summaryCards.length, 4);
                summaryCards.forEach((card, index) => {
                    expectToBe(card.title, expectedSummaryCards[index].title);
                    expectToBe(card.value, expectedSummaryCards[index].value);
                    expectToEqual(card.icon, expectedSummaryCards[index].icon);
                    expectToBe(card.bgClass, expectedSummaryCards[index].bgClass);
                });
            });
        });
    });
});
