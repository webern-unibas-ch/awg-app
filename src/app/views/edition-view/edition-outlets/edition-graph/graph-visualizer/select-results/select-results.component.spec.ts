import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectResultsComponent } from './select-results.component';

describe('SelectResultsComponent', () => {
    let component: SelectResultsComponent;
    let fixture: ComponentFixture<SelectResultsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectResultsComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
