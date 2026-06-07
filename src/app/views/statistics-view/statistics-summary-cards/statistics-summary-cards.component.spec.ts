import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsSummaryCardsComponent } from './statistics-summary-cards.component';

describe('StatisticsSummaryCardsComponent', () => {
    let component: StatisticsSummaryCardsComponent;
    let fixture: ComponentFixture<StatisticsSummaryCardsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsSummaryCardsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsSummaryCardsComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
