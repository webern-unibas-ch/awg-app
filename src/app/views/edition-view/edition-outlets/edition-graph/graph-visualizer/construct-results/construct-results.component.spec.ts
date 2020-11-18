import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructResultsComponent } from './construct-results.component';

describe('ConstructResultsComponent', () => {
    let component: ConstructResultsComponent;
    let fixture: ComponentFixture<ConstructResultsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConstructResultsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConstructResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
