import { Component, DebugElement, input, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { StatisticsOverallProgressData, StatisticsProgressBarConfig } from '../models/statistics.model';
import { StatisticsProgressBarComponent } from '../statistics-progress-bar/statistics-progress-bar.component';

import { StatisticsOverallProgressComponent } from './statistics-overall-progress.component';

// Mock components
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

describe('StatisticsOverallProgressComponent', () => {
    let component: StatisticsOverallProgressComponent;
    let fixture: ComponentFixture<StatisticsOverallProgressComponent>;
    let compDe: DebugElement;

    let expectedOverallProgressData: StatisticsOverallProgressData;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsOverallProgressComponent],
        })
            .overrideComponent(StatisticsOverallProgressComponent, {
                remove: { imports: [StatisticsProgressBarComponent] },
                add: { imports: [StatisticsProgressBarStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedOverallProgressData = {
            progressRate: 50,
            activeComplexes: 8,
            totalComplexes: 16,
        };

        // Create component fixture
        fixture = TestBed.createComponent(StatisticsOverallProgressComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `overallProgressData`', () => {
            expectToBe(isSignal(component.overallProgressData), true);

            expect(() => component.overallProgressData()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no overall progress card div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress.card', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set input signals with test data
            fixture.componentRef.setInput('overallProgressData', expectedOverallProgressData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `overallProgressData` to hold the provided data', () => {
            expectToEqual(component.overallProgressData(), expectedOverallProgressData);
        });

        describe('VIEW', () => {
            it('... should contain one overall progress card div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress.card', 1, 1);
            });

            it('... should have correct classes on overall progress card div', () => {
                const cardDes = getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress.card', 1, 1);
                const cardEl: HTMLDivElement = cardDes[0].nativeElement;

                expectToBe(cardEl.classList.length, 4);
                expectToContain(cardEl.classList, 'awg-statistics-card');
                expectToContain(cardEl.classList, 'awg-statistics-overall-progress');
                expectToContain(cardEl.classList, 'card');
                expectToContain(cardEl.classList, 'mb-4');
            });

            it('... should contain one card header div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress > div.card-header', 1, 1);
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
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-overall-progress > div.card-body', 1, 1);
            });

            it('... should contain one progress bar component (stubbed) in card body', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);

                getAndExpectDebugElementByDirective(cardBodyDes[0], StatisticsProgressBarStubComponent, 1, 1);
            });

            it('... should pass down correct values (incl. progress rate) to progress bar component', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const progressBarDes = getAndExpectDebugElementByDirective(
                    cardBodyDes[0],
                    StatisticsProgressBarStubComponent,
                    1,
                    1
                );
                const progressBarCmp = progressBarDes[0].injector.get(StatisticsProgressBarStubComponent);

                expectToEqual(progressBarCmp.config(), {
                    mode: 'percentage',
                    percentage: expectedOverallProgressData.progressRate,
                });
                expectToBe(progressBarCmp.headerLabel(), 'Edition Completion');
                expectToBe(progressBarCmp.height(), '20px');
                expectToBe(progressBarCmp.showPercentageLabel(), true);
                expectToBe(progressBarCmp.boldPercentageLabel(), true);
            });

            it('... should display active/total complexes info in centered div', () => {
                const cardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card-body', 1, 1);
                const infoDes = getAndExpectDebugElementByCss(cardBodyDes[0], 'div.text-center', 1, 1);
                const infoEl: HTMLDivElement = infoDes[0].nativeElement;

                expectToContain(
                    infoEl.textContent?.trim(),
                    `${expectedOverallProgressData.activeComplexes} of ${expectedOverallProgressData.totalComplexes} currently enabled edition complexes active`
                );
            });
        });
    });
});
