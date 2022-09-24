/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { FulltextSearchFormComponent } from './fulltext-search-form.component';

describe('FulltextSearchFormComponent', () => {
    let component: FulltextSearchFormComponent;
    let fixture: ComponentFixture<FulltextSearchFormComponent>;
    let compDe: DebugElement;

    // Create new instance of FormBuilder
    // See 'Karma formGroup expects a FormGroup instance. Please pass one in',
    // https://medium.com/@charlesprobaker/karma-testing-a-formgroup-instance-a0a90de831d4
    // https://stackoverflow.com/a/48671534
    const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, ReactiveFormsModule],
            declarations: [FulltextSearchFormComponent],
            providers: [{ provide: UntypedFormBuilder, useValue: formBuilder }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FulltextSearchFormComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Pass in the form dynamically
        component.searchForm = formBuilder.group({
            searchValueControl: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
