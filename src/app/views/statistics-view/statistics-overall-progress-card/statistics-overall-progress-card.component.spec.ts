import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { StatisticsProgressBarConfig } from '../models';
import { StatisticsProgressBarComponent } from '../statistics-progress-bar';
import { StatisticsOverallProgressCardComponent } from './statistics-overall-progress-card.component';

// Mock components
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

describe('StatisticsOverallProgressComponent', () => {
    let component: StatisticsOverallProgressCardComponent;
    let fixture: ComponentFixture<StatisticsOverallProgressCardComponent>;
    let compDe: DebugElement;

    let expectedProgressRate: number;
    let expectedAvailableComplexes: number;
    let expectedTotalComplexes: number;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsOverallProgressCardComponent],
        })
            .overrideComponent(StatisticsOverallProgressCardComponent, {
                remove: { imports: [StatisticsProgressBarComponent] },
                add: { imports: [StatisticsProgressBarStubComponent] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(StatisticsOverallProgressCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedProgressRate = 50;
        expectedAvailableComplexes = 8;
        expectedTotalComplexes = 16;

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('progressRate', 0);
        fixture.componentRef.setInput('availableComplexes', 0);
        fixture.componentRef.setInput('totalComplexes', 0);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `progressRate`', () => {
            expectToBe(component.progressRate(), 0);
        });

        it('... should have required `availableComplexes`', () => {
            expectToBe(component.availableComplexes(), 0);
        });

        it('... should have required `totalComplexes`', () => {
            expectToBe(component.totalComplexes(), 0);
        });

        describe('VIEW', () => {
            it('... should contain one card div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress-card', 1, 1);
            });

            it('... should have correct classes on card div', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress-card', 1, 1);
                const cardEl: HTMLDivElement = cardDes[0].nativeElement;

                expectToBe(cardEl.classList.length, 4);
                expectToContain(cardEl.classList, 'awg-statistics-card');
                expectToContain(cardEl.classList, 'awg-statistics-overall-progress-card');
                expectToContain(cardEl.classList, 'card');
                expectToContain(cardEl.classList, 'mb-4');
            });

            it('... should contain one card header div', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-overall-progress-card > div.card-header',
                    1,
                    1
                );
            });

            it('... should contain h3 title element in card header', () => {
                const cardHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card-header', 1, 1);
                getAndExpectDebugElementByCss(cardHeaderDes[0], 'h3.card-title', 1, 1);
            });

            it('... should contain correct title in card header', () => {
                const cardHeaderDes = getAndExpectDebugElementByCss(compDe, 'div.card-header', 1, 1);
                const hDes = getAndExpectDebugElementByCss(cardHeaderDes[0], 'h3.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;
                expectToBe(hEl.textContent?.trim(), 'Overall Progress');
            });

            it('... should contain one card body div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress-card > div.card-body', 1, 1);
            });

            it('... should contain one progress bar component (stubbed) in card body', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                getAndExpectDebugElementByDirective(cardBodyDes[0], StatisticsProgressBarStubComponent, 1, 1);
            });

            it('... should contain one centered div with no content yet', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const infoDes = getAndExpectDebugElementByCss(cardBodyDes[0], 'div.text-center', 1, 1);
                const infoEl: HTMLDivElement = infoDes[0].nativeElement;

                expectToBe(infoEl.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set input signals with test data
            fixture.componentRef.setInput('progressRate', expectedProgressRate);
            fixture.componentRef.setInput('availableComplexes', expectedAvailableComplexes);
            fixture.componentRef.setInput('totalComplexes', expectedTotalComplexes);

            fixture.detectChanges();
        });

        it('... should have updated `progressRate`', () => {
            expectToBe(component.progressRate(), expectedProgressRate);
        });

        it('... should have updated `availableComplexes`', () => {
            expectToBe(component.availableComplexes(), expectedAvailableComplexes);
        });

        it('... should have updated `totalComplexes`', () => {
            expectToBe(component.totalComplexes(), expectedTotalComplexes);
        });

        describe('VIEW', () => {
            it('... should pass down correct values (incl. progress rate) to progress bar component', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const progressBarDes = getAndExpectDebugElementByDirective(
                    cardBodyDes[0],
                    StatisticsProgressBarStubComponent,
                    1,
                    1
                );
                const progressBarCmp = progressBarDes[0].injector.get(StatisticsProgressBarStubComponent);

                expectToEqual(progressBarCmp.config(), { mode: 'percentage', percentage: expectedProgressRate });
                expectToBe(progressBarCmp.headerLabel(), 'Edition Completion');
                expectToBe(progressBarCmp.height(), '20px');
                expectToBe(progressBarCmp.showPercentageLabel(), true);
                expectToBe(progressBarCmp.boldPercentageLabel(), true);
            });

            it('... should display available/total complexes info in centered div', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const infoDes = getAndExpectDebugElementByCss(cardBodyDes[0], 'div.text-center', 1, 1);
                const infoEl: HTMLDivElement = infoDes[0].nativeElement;

                expectToContain(
                    infoEl.textContent?.trim(),
                    `${expectedAvailableComplexes} of ${expectedTotalComplexes} currently enabled edition complexes available`
                );
            });
        });
    });
});
