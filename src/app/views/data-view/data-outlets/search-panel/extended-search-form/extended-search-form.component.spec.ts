import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedSearchFormComponent } from './extended-search-form.component';

describe('ExtendedSearchFormComponent', () => {
    let component: ExtendedSearchFormComponent;
    let fixture: ComponentFixture<ExtendedSearchFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExtendedSearchFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExtendedSearchFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
