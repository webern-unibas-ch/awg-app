import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { StatisticsSeriesBreakdownComponent } from './statistics-series-breakdown.component';

describe('StatisticsSeriesBreakdownComponent', () => {
    let component: StatisticsSeriesBreakdownComponent;
    let fixture: ComponentFixture<StatisticsSeriesBreakdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsSeriesBreakdownComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsSeriesBreakdownComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
