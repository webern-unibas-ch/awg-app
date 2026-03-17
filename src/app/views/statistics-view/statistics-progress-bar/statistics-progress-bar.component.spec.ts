import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsProgressBarComponent } from './statistics-progress-bar.component';

describe('StatisticsProgressBarComponent', () => {
    let component: StatisticsProgressBarComponent;
    let fixture: ComponentFixture<StatisticsProgressBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatisticsProgressBarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('#getProgressBarClass', () => {
        it('... should return bg-success for percentage >= 80', () => {
            expect(component.getProgressBarClass(80)).toBe('bg-success');
            expect(component.getProgressBarClass(90)).toBe('bg-success');
            expect(component.getProgressBarClass(100)).toBe('bg-success');
        });

        it('... should return bg-warning for percentage >= 50 and < 80', () => {
            expect(component.getProgressBarClass(50)).toBe('bg-warning');
            expect(component.getProgressBarClass(60)).toBe('bg-warning');
            expect(component.getProgressBarClass(79)).toBe('bg-warning');
        });

        it('... should return bg-danger for percentage < 50', () => {
            expect(component.getProgressBarClass(0)).toBe('bg-danger');
            expect(component.getProgressBarClass(25)).toBe('bg-danger');
            expect(component.getProgressBarClass(49)).toBe('bg-danger');
        });
    });

    describe('Input properties', () => {
        it('... should have default values', () => {
            expect(component.percentage).toBe(0);
            expect(component.showLabel).toBe(true);
            expect(component.height).toBe('15px');
            expect(component.minWidth).toBe('120px');
            expect(component.customClasses).toBe('');
            expect(component.boldLabel).toBe(false);
            expect(component.useCustomClassesOnly).toBe(false);
        });

        it('... should accept custom values', () => {
            component.percentage = 75;
            component.showLabel = false;
            component.height = '20px';
            component.minWidth = '100px';
            component.customClasses = 'custom-class';
            component.boldLabel = true;
            component.useCustomClassesOnly = true;

            expect(component.percentage).toBe(75);
            expect(component.showLabel).toBe(false);
            expect(component.height).toBe('20px');
            expect(component.minWidth).toBe('100px');
            expect(component.customClasses).toBe('custom-class');
            expect(component.boldLabel).toBe(true);
            expect(component.useCustomClassesOnly).toBe(true);
        });
    });
});
