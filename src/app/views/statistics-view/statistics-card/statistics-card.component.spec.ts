import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsCardComponent } from './statistics-card.component';

describe('StatisticsCardComponent', () => {
    let component: StatisticsCardComponent;
    let fixture: ComponentFixture<StatisticsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatisticsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StatisticsCardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('... should display the title', () => {
        component.title = 'Test Title';
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('small').textContent).toBe('Test Title');
    });

    it('... should display the value', () => {
        component.value = 42;
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('h4').textContent).toBe('42');
    });

    it('... should apply the background class', () => {
        component.bgClass = 'bg-primary';
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('.card')).toHaveClass('bg-primary');
    });

    it('... should display the icon', () => {
        component.icon = 'fas fa-test';
        fixture.detectChanges();

        const compiled = fixture.nativeElement;
        expect(compiled.querySelector('i')).toHaveClass('fas');
        expect(compiled.querySelector('i')).toHaveClass('fa-test');
    });
});
