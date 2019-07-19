/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
    let component: SearchFormComponent;
    let fixture: ComponentFixture<SearchFormComponent>;
    let compDe: DebugElement;
    let compEl: any;

    // create new instance of FormBuilder
    // see 'Karma formGroup expects a FormGroup instance. Please pass one in',
    // https://medium.com/@charlesprobaker/karma-testing-a-formgroup-instance-a0a90de831d4
    // https://stackoverflow.com/a/48671534
    const formBuilder: FormBuilder = new FormBuilder();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeModule, ReactiveFormsModule],
            declarations: [SearchFormComponent],
            providers: [{ provide: FormBuilder, useValue: formBuilder }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchFormComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // pass in the form dynamically
        component.searchForm = formBuilder.group({
            searchValueControl: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
