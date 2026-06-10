import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToEqual } from '@testing/expect-helper';

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

    let expectedSeriesBreakdown: StatisticsSeriesBreakdown;

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

        expectedSeriesBreakdown = new StatisticsSeriesBreakdown('Test Series');
        expectedSeriesBreakdown.totalComplexes = 10;
        expectedSeriesBreakdown.activeComplexes = 5;
        expectedSeriesBreakdown.complexBreakdown = new StatisticsComplexBreakdown({ opus: 3, mnr: 2, mnrX: 0 });
        expectedSeriesBreakdown.activeComplexBreakdown = new StatisticsComplexBreakdown({ opus: 2, mnr: 1, mnrX: 0 });

        // Set required input signal with default value for initial tests
        fixture.componentRef.setInput('seriesBreakdown', [new StatisticsSeriesBreakdown('Test Default Series')]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have required `seriesBreakdown`', () => {
            expectToEqual(component.seriesBreakdown(), [new StatisticsSeriesBreakdown('Test Default Series')]);
        });

        it('... should have `ROUTES` with edition route constants', () => {
            expectToEqual(component.ROUTES, {
                edition: EDITION_ROUTE_CONSTANTS.EDITION,
                series: EDITION_ROUTE_CONSTANTS.SERIES,
                section: EDITION_ROUTE_CONSTANTS.SECTION,
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent updating the input signals
            fixture.componentRef.setInput('seriesBreakdown', [expectedSeriesBreakdown]);
            fixture.detectChanges();
        });

        it('... should have updated `seriesBreakdown`', () => {
            expectToEqual(component.seriesBreakdown(), [expectedSeriesBreakdown]);
        });

        it('... should have `ROUTES` with edition route constants unchanged', () => {
            expectToEqual(component.ROUTES, {
                edition: EDITION_ROUTE_CONSTANTS.EDITION,
                series: EDITION_ROUTE_CONSTANTS.SERIES,
                section: EDITION_ROUTE_CONSTANTS.SECTION,
            });
        });
    });
});
