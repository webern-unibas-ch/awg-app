import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';

import { ResourceInfoComponent } from './resource-info.component';

describe('ResourceInfoComponent', () => {
    let component: ResourceInfoComponent;
    let fixture: ComponentFixture<ResourceInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeModule, ReactiveFormsModule, RouterTestingModule],
            declarations: [ResourceInfoComponent, CompileHtmlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
