import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { ExtendedSearchFormComponent } from './extended-search-form.component';

describe('ExtendedSearchFormComponent', () => {
    let component: ExtendedSearchFormComponent;
    let fixture: ComponentFixture<ExtendedSearchFormComponent>;

    let formBuilder: UntypedFormBuilder;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, HttpClientTestingModule, ReactiveFormsModule],
            declarations: [ExtendedSearchFormComponent],
            providers: [UntypedFormBuilder],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExtendedSearchFormComponent);
        component = fixture.componentInstance;

        formBuilder = TestBed.inject(UntypedFormBuilder);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
