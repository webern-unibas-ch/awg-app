import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ExtendedSearchFormComponent } from './extended-search-form.component';

describe('ExtendedSearchFormComponent', () => {
    let component: ExtendedSearchFormComponent;
    let fixture: ComponentFixture<ExtendedSearchFormComponent>;

    let formBuilder: FormBuilder;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, ReactiveFormsModule],
            declarations: [ExtendedSearchFormComponent],
            providers: [FormBuilder],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExtendedSearchFormComponent);
        component = fixture.componentInstance;

        formBuilder = TestBed.inject(FormBuilder);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
